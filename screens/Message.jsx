import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, doc, Timestamp, onSnapshot, query, orderBy, getFirestore, getDocs, where, setDoc } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const Message = ({ navigation }) => {
  const theme = useContext(themeContext);
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recruiterUID, setRecruiterUID] = useState(null);
  const [documentID, setDocumentID] = useState(null);
  const [isRecruiter, setIsRecruiter] = useState(false);

  useEffect(() => {
    if (user) {
      const firestore = getFirestore(db);
      const messagingRef = collection(firestore, 'Messaging');

      // Query to find the document with the current user's UID as User_UID or Recruiter_UID
      const userQuery = query(messagingRef, where('User_UID', '==', user.uid));
      const recruiterQuery = query(messagingRef, where('Recruiter_UID', '==', user.uid));

      getDocs(userQuery).then((userSnapshot) => {
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const data = userDoc.data();
          setRecruiterUID(data.Recruiter_UID);
          setDocumentID(userDoc.id);
          setIsRecruiter(false); // This user is not the recruiter

          // Set up a listener for messages
          setupMessageListener(firestore, userDoc.id);
        } else {
          getDocs(recruiterQuery).then((recruiterSnapshot) => {
            if (!recruiterSnapshot.empty) {
              const recruiterDoc = recruiterSnapshot.docs[0];
              const data = recruiterDoc.data();
              console.log('User Document Data (Recruiter_UID match):', data); // Debugging log
              setRecruiterUID(data.User_UID); // The other party is the user
              setDocumentID(recruiterDoc.id);
              setIsRecruiter(true); // This user is the recruiter

              // Set up a listener for messages
              setupMessageListener(firestore, recruiterDoc.id);
            } else {
              console.warn('No matching document found! Creating a new one.');
              createNewDocument(firestore);
            }
          });
        }
      }).catch((error) => {
        console.error('Error fetching document:', error);
      });
    }
  }, [user]);

  const setupMessageListener = (firestore, docId) => {
    const messagesRef = collection(firestore, 'Messaging', docId, 'conv');
    const q = query(messagesRef, orderBy('order'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  };

  const createNewDocument = async (firestore) => {
    const newDocRef = doc(collection(firestore, 'Messaging'));
    const newDocData = {
      User_UID: user.uid,
      Recruiter_UID: '', // Placeholder for recruiter UID, will be updated later
    };
    await setDoc(newDocRef, newDocData);
    setDocumentID(newDocRef.id);
    setRecruiterUID(''); // Placeholder value

    // Set up a listener for messages
    setupMessageListener(firestore, newDocRef.id);
  };

  const handleSend = async () => {
    if (newMessage.trim() && user && documentID) {
      const firestore = getFirestore(db);
      const messagesRef = collection(firestore, 'Messaging', documentID, 'conv');
      const newMessageDoc = {
        content: newMessage,
        sender_UID: user.uid,
        timestamp: Timestamp.now(),
        order: messages.length + 1
      };
      await addDoc(messagesRef, newMessageDoc);
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.color }]}>Message</Text>
      </SafeAreaView>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.message,
              (message.sender_UID === user.uid && !isRecruiter) || (message.sender_UID === recruiterUID && isRecruiter)
                ? styles.userMessage
                : styles.recruiterMessage
            ]}
          >
            <Text style={styles.messageSender}>
              {(message.sender_UID === user.uid && !isRecruiter) || (message.sender_UID === recruiterUID && isRecruiter) ? 'You' : 'Recruiter'}
            </Text>
            <Text style={styles.messageContent}>{message.content}</Text>
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type your message..."
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  message: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  recruiterMessage: {
    backgroundColor: '#f8d7da',
    alignSelf: 'flex-start',
  },
  messageSender: {
    fontWeight: 'bold',
  },
  messageContent: {
    marginTop: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 20,
    backgroundColor: '#fff',
  },
});

export default Message;
