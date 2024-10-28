import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, Modal, Button , Image,FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, doc, Timestamp, onSnapshot, query, orderBy, getFirestore, getDoc, where, getDocs } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';
import { handleReport } from '../src/utils/reportUtils';
import { Ionicons } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { getStorage, ref, getDownloadURL } from '@react-native-firebase/storage';




const ReportModal = ({ isVisible, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const reasons = [
    'Inappropriate content',
    'Spam',
    'Harassment',
    'False information',
    'Other'
  ];

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select a reason for reporting:</Text>
          {reasons.map((reason) => (
            <TouchableOpacity
              key={reason}
              style={[
                styles.reasonButton,
                selectedReason === reason && styles.selectedReasonButton
              ]}
              onPress={() => setSelectedReason(reason)}
            >
              <Text style={selectedReason === reason ? styles.selectedReasonText : styles.reasonText}>{reason}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={onClose} color="#841584" />
            <Button
              title="Submit"
              onPress={() => onSubmit(selectedReason)}
              disabled={!selectedReason}
              color="#841584"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const RoomateMessage = ({ route, navigation }) => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomateUID, setRoomateUID] = useState(null);
  const [documentID, setDocumentID] = useState(null);
  //const [isRecruiter, setIsRecruiter] = useState(false);
  const [usernames, setUsernames] = useState({});
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [currentReportData, setCurrentReportData] = useState(null);
  const [url, seturl] = useState();

  const {conversationId , otherUID} = route.params; // Safely get conversationId from route params

  

  useEffect(() => {
      const func = async () => {
          const storage = getStorage();
          const reference = ref(storage, "images/" + otherUID + "/profile");

          await getDownloadURL(reference)
              .then((x)=> {seturl(x);})
              .catch((error)=> {

                  getDownloadURL(ref(storage, "profile.jpg"))
                  .then((x)=> {seturl(x);})
              })
      }
      func();
  }, []);

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

  const handleReportMessage = (messageId, reportedUsername, messageContent) => {
    setCurrentReportData({ messageId, reportedUsername, messageContent });
    setIsReportModalVisible(true);
  };

  const renderMessage = ({item}) => (
    <View style={{flex:1}}>
      { item.sender_UID !== user.uid &&
      <FastImage 
      source={{uri: url }} 
      style={{width: 40, height: 40, borderRadius: 20}}
      onError={(error) => console.log('FastImage error:', error.nativeEvent)}
      />
      
      }
    
    <View key={item.id}
    style={[
      styles.message,
      item.sender_UID === user.uid ? styles.userMessage : styles.roomateMessage
    ]}>
      
            
            <View style={styles.messageHeader}>
              <Text style={styles.messageSender}>
                {usernames[item.sender_UID] || 'Unknown'}
              </Text>
              {item.sender_UID !== user.uid && (
                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={() => handleReportMessage(item.id, usernames[item.sender_UID], item.content)}
                >
                  <Ionicons name="flag-outline" size={16} color="#999" />
                </TouchableOpacity>
              )}
              
            </View>
            <Text style={styles.messageContent}>{item.content}</Text>

    </View>
    </View>
  )
  if (!conversationId && !documentID) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>No conversation selected</Text>
      </View>
    );
  }

  return (
    <FastImage source={require('../assets/galaxy_msg.jpg')} style={styles.container}> 
    <View style={styles.container}>
      <FlatList
        data={messages}

        renderItem={renderMessage}
        style={styles.messagesContainer}
      />

      
      
      <ReportModal
        isVisible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        onSubmit={async (reason) => {
          setIsReportModalVisible(false);
          if (currentReportData) {
            const { messageId, reportedUsername, messageContent } = currentReportData;
            const reportData = {
              messageId,
              reportedUser: reportedUsername,
              content: messageContent,
              source: 'message',
              type: 'roommate_message',
              reason: reason
            };

            const success = await handleReport(reportData);
            if (success) {
              Alert.alert('Report Submitted', 'Thank you for your report. Our moderators will review it shortly.');
            } else {
              Alert.alert('Error', 'Failed to submit report. Please try again.');
            }
          }
        }}
      />


    <View style={styles.inputContainer}>
        <TextInput
            style={[styles.input]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            placeholderTextColor='white'
            color='white'
        />

          <TouchableOpacity onPress={handleSend}>
            <Image source={require('../assets/arrow.png')}  style={{height: 45, width: 45, marginLeft: 10}}/>

          </TouchableOpacity>
        {/* <Button title="Send" onPress={sendMessage} /> */}
        {/*<Button title="Send" onPress={run} />*/}
      </View>
    </View>
    </FastImage>
  );
};

export default RoomateMessage

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
    borderRadius: 10,
  },
  roomateMessage: {
    backgroundColor: '#f8d7da',
    alignSelf: 'flex-start',
    borderRadius: 10,
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
    paddingVertical: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    // backgroundColor: '#fff',
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
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reportButton: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  reasonButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedReasonButton: {
    backgroundColor: '#e0e0e0',
  },
  reasonText: {
    color: '#000',
  },
  selectedReasonText: {
    color: '#841584',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

