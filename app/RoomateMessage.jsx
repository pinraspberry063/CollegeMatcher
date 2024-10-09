import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, doc, Timestamp, onSnapshot, query, orderBy, getFirestore, getDoc, where, getDocs } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';
import { handleReport } from '../src/utils/reportUtils';

const Message = ({ route, navigation }) => {
  const theme = useContext(themeContext);
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomateUID, setRoomateUID] = useState(null);
  const [documentID, setDocumentID] = useState(null);
  //const [isRecruiter, setIsRecruiter] = useState(false);
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
          setRoomateUID(data.Roomate_UID);
          setDocumentID(conversationDocRef.id);

          // Fetch usernames
          fetchUsernames([data.User_UID, data.Roomate_UID], firestore).then(() => {
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

    // Listener is used to display the ordered messages from the database.
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

    // Fetch the usernames of the users to be used in messaging.
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

    // Handle the sending of messages.
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

  const handleReportMessage = async (messageId, reportedUser) => {
    const reportData = {
      messageId,
      reportedUser,
      source: 'message'
    };

    const success = await handleReport(reportData);
    if (success) {
      Alert.alert('Report Submitted', 'Thank you for your report. Our moderators will review it shortly.');
    } else {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
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
              (message.sender_UID === user.uid) || (message.sender_UID === roomateUID)
                ? styles.userMessage
                : styles.roomateMessage
            ]}
          >
            <Text style={styles.messageSender}>
              {usernames[message.sender_UID] || 'Unknown'}
            </Text>
            <Text style={styles.messageContent}>{message.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
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
  roomateMessage: {
    backgroundColor: '#f8d7da',
    alignSelf: 'flex-start',
  },
  messageSender: {
    fontWeight: 'bold',
  },
  messageContent: {
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 80,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#841584',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Message;
