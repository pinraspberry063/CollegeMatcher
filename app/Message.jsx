import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, doc, Timestamp, onSnapshot, query, orderBy, getFirestore, getDoc, where, getDocs } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const Message = ({ route, navigation }) => {
  const theme = useContext(themeContext);
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recruiterUID, setRecruiterUID] = useState(null);
  const [documentID, setDocumentID] = useState(null);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [usernames, setUsernames] = useState({});

  const conversationId = route.params?.conversationId; // Safely get conversationId from route params

  useEffect(() => {
    const firestore = getFirestore(db);
    const fetchConversation = async () => {
      if (!user) return;

      let conversationDocRef;
      if (conversationId) {
        conversationDocRef = doc(firestore, 'Messaging', conversationId);
      } else {
        // Scan all collections in "Messaging" for a document with the current user's UID incase no conversationID was found
        const messagingRef = collection(firestore, 'Messaging');
        const userQuery = query(messagingRef, where('User_UID', '==', user.uid));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          conversationDocRef = userDoc.ref;
        } else {
          console.warn('No conversation found for the current user');
          return;
        }
      }

      getDoc(conversationDocRef).then((docSnap) => {
        if (docSnap.exists) {
          const data = docSnap.data();
          if (data.User_UID === user.uid) {
            setRecruiterUID(data.Recruiter_UID);
            setIsRecruiter(false);
          } else if (data.Recruiter_UID === user.uid) {
            setRecruiterUID(data.User_UID);
            setIsRecruiter(true);
          }
          setDocumentID(conversationDocRef.id);

          // Fetch usernames
          fetchUsernames([data.User_UID, data.Recruiter_UID], firestore).then(() => {
            // Set up listener for messages
            setupMessageListener(firestore, conversationDocRef.id);
          });
        } else {
          console.warn('No matching conversation found!');
        }
      }).catch((error) => {
        console.error('Error fetching conversation:', error);
      });
    };

    fetchConversation();
  }, [user, conversationId]);

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

  const fetchUsernames = async (uids, firestore) => {
    const usersRef = collection(firestore, 'Users');
    const usernameMap = {};

    for (const uid of uids) {
      const userQuery = query(usersRef, where('User_UID', '==', uid));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        usernameMap[uid] = userDoc.data().Username;
      } else {
        console.log(`No user found for UID: ${uid}`); // Debugging log
      }
    }

    setUsernames(usernameMap);
    console.log('Set usernames:', usernameMap); // Debugging log
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

  if (!conversationId && !documentID) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>No conversation selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
              {usernames[message.sender_UID] || 'Unknown'}
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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    maxWidth: '75%',
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
