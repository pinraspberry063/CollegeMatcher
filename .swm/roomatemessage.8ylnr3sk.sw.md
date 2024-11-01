---
title: RoomateMessage
---
<SwmSnippet path="/app/RoomateMessage.jsx" line="12">

---

ReportModal is a function that allows for the reporting of specific messages for a selected reason and handles the submision of the report.

```javascript
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
```

---

</SwmSnippet>

<SwmSnippet path="/app/RoomateMessage.jsx" line="53">

---

Message is a function that handles the getting and setting of user past and present user inputted messages to and from one another. Using the given user and the recipient, the previous message data is obtained and fet into the MessageListener if it exists in the form of the conversations Id

```javascript

const Message = ({ route, navigation }) => {
  const theme = useContext(themeContext);
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomateUID, setRoomateUID] = useState(null);
  const [documentID, setDocumentID] = useState(null);
  //const [isRecruiter, setIsRecruiter] = useState(false);
  const [usernames, setUsernames] = useState({});
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [currentReportData, setCurrentReportData] = useState(null);

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
```

---

</SwmSnippet>

<SwmSnippet path="/app/RoomateMessage.jsx" line="114">

---

&nbsp;

```javascript
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
```

---

</SwmSnippet>

<SwmSnippet path="/app/RoomateMessage.jsx" line="53">

---

The MessageListener obtains snapshots of each message and populates the messages&nbsp;

```javascript

const Message = ({ route, navigation }) => {
  const theme = useContext(themeContext);
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomateUID, setRoomateUID] = useState(null);
  const [documentID, setDocumentID] = useState(null);
  //const [isRecruiter, setIsRecruiter] = useState(false);
  const [usernames, setUsernames] = useState({});
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [currentReportData, setCurrentReportData] = useState(null);

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
```

---

</SwmSnippet>

<SwmSnippet path="/app/RoomateMessage.jsx" line="129">

---

This code chunck fetches the username that is to be displayed by using the uid to query the Users database for a match

```javascript
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
```

---

</SwmSnippet>

<SwmSnippet path="/app/RoomateMessage.jsx" line="149">

---

handleSend is a function that grabs the Messaging database and then adds the newly inputted message to the relevant users records of the conversations.

```javascript
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

  const handleReportMessage = (messageId, reportedUsername) => {
    setCurrentReportData({ messageId, reportedUsername });
    setIsReportModalVisible(true);
  };

  if (!conversationId && !documentID) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>No conversation selected</Text>
      </View>
    );
  }
```

---

</SwmSnippet>

<SwmSnippet path="/app/RoomateMessage.jsx" line="177">

---

The below code chunck populates the page itself with visual implementations of the messages according to user, date sent, and order. The messages appear on different sides of the screen according to who is the user and who is the potential roomate. The user always appears on the right hand side of the screen in a green text box while the potential roomate will always be on the left side of the screen in a purple text box. An input box is located at the bottom of the screen for uses to interat with, allowing them to type a message. A submit icon accompanies the text box and allows for submission of the message, actively populating it on both users ends visually and in the database. A physical button also exists to allow for the reporting of offending messages and selection of the offense.

```javascript

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.message,
              (message.sender_UID === user.uid)
                ? styles.userMessage
                : styles.roomateMessage
            ]}
          >
            <View style={styles.messageHeader}>
              <Text style={styles.messageSender}>
                {usernames[message.sender_UID] || 'Unknown'}
              </Text>
              {message.sender_UID !== user.uid && (
                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={() => handleReportMessage(message.id, usernames[message.sender_UID])}
                >
                  <Ionicons name="flag-outline" size={16} color="#999" />
                </TouchableOpacity>
              )}
            </View>
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
      <ReportModal
        isVisible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        onSubmit={async (reason) => {
          setIsReportModalVisible(false);
          if (currentReportData) {
            const { messageId, reportedUsername } = currentReportData;
            const reportData = {
              messageId,
              reportedUser: reportedUsername,
              source: 'message',
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
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>