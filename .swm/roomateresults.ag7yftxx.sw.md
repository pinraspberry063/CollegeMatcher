---
title: RoomateResults
---
<SwmSnippet path="/app/RoomateResults.jsx" line="9">

---

This page handles the viewing of the top 5 potential roomate canidates. It allows for navigation to the messaging page for individual roomates as well.

```javascript
const RoomateResults = ({ route, navigation }) => {
    const top5  = route.params.top5;
    const { user } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const [usernames, setUsernames] = useState({});
    const handleRoomateViewQuiz =  async (roomate_uid) => {
            console.log("handleRoomateViewQuiz");
            console.log(roomate_uid);
            navigation.navigate('RoomateViewQuiz', { roomate_UID: roomate_uid});
    };
```

---

</SwmSnippet>

<SwmSnippet path="/app/RoomateResults.jsx" line="19">

---

The handleMessageNavigation function uses the selected roomates uid and the users uid to query for their information. By doing so, existing conversations can be detected and routed to while a new convresation between the two users can generate a new data storage for their individual messages between one another. A try statment also exists for logging all of a users active conversations for future use. Once the relevant data is detected or created, the  conversations unique id is fed into a function call for a RoomateMessage page.

```javascript
    const handleMessageNavigation = useCallback(
        async (userUID,roomateUID) => {

          //navigate to the roomate's messaging page
          const firestore = getFirestore(db);
          const messagingRef = collection(firestore, 'Messaging');
          const existingConvoInQuery = query(
            messagingRef,
            where('Roomate_UID', '==', userUID),
            where('User_UID', '==', roomateUID)
          );
          const existingConvoOutQuery = query(
            messagingRef,
            where('Roomate_UID', '==', roomateUID),
            where('User_UID', '==', userUID)
          );
          const existingConvoInSnapshot = await getDocs(existingConvoInQuery);
          const existingConvoOutSnapshot = await getDocs(existingConvoOutQuery);
          if (!existingConvoInSnapshot.empty || !existingConvoOutSnapshot.empty) {
            // Conversation already exists, navigate to the existing conversation
            if(!existingConvoInSnapshot.empty){
                const conversationId = existingConvoInSnapshot.docs[0].id;

                navigation.navigate('RoomateMessage', { conversationId });
                }
            else if(!existingConvoOutSnapshot.empty){
                const conversationId = existingConvoOutSnapshot.docs[0].id;
                navigation.navigate('RoomateMessage', { conversationId });
                }
          } else {
            //Populate roomate and user's activeMessages
               try {
                 const usersRef = collection(firestore, 'Users');
                 const q = query(usersRef, where('User_UID', '==', userUID));
                 const k = query(usersRef,where('User_UID', '==', roomateUID));
                 const queryUserSnapshot = await getDocs(q);
                 const queryRoomateSnapshot = await getDocs(k);
                 if (!queryUserSnapshot.empty && !queryRoomateSnapshot.empty) {
                   const userDoc = queryUserSnapshot.docs[0];
                   const userDocRef = doc(firestore, 'Users', userDoc.id);
                   const roomateDoc = queryRoomateSnapshot.docs[0];
                   const roomateDocRef = doc(firestore, 'Users', roomateDoc.id);
                   const userData = userDoc.data();
                   const roomateData = roomateDoc.data();
                   //populate the users active messages with the roomates uid
                   await updateDoc(userDocRef, {
                        activeMessages: arrayUnion(roomateUID),
                    })
                    //populate the roomates active messages with the users uid
                   await updateDoc(roomateDocRef, {
                        activeMessages: arrayUnion(userUID),
                    })
                 } else {
                   console.error('(RoomateMatcher/username)No user found with the given UID.');
                 }
               } catch (error) {
                 console.error('Error Fetching Username and CollegeName:', error);
               }
            // No conversation exists, create a new one

            const newConvoRef = await addDoc(collection(firestore, 'Messaging'), {
              Roomate_UID: roomateUID,
              User_UID: userUID,
            });

            // Create a sub-collection 'conv' within the new conversation document
            await addDoc(collection(newConvoRef, 'conv'), {});

            // Navigate to the newly created conversation
            navigation.navigate('RoomateMessage', { conversationId: newConvoRef.id });
          }
        },
        [db, user, navigation] // Dependencies for useCallback
      );
```

---

</SwmSnippet>

<SwmSnippet path="/app/RoomateResults.jsx" line="93">

---

The below code displays the top 5 roomates to the user, including the score compatability in percentage form, a potential but unsude feature for viewing other roomates quiz choices, and a button to access direct messageing with the given roomate.

```javascript
    const renderItem = ({ item }) => (

        <View style={styles.card}>
            <Text style={styles.username}>{item.name}</Text>
            <Text style={styles.roomateScore}>Match Accuracy: {item.score}%</Text>
            {/*
            <Button
                style={styles.button}
                onPress={() => handleRoomateViewQuiz(item.roomate_uid)}
                title="View Roommate Quiz"
            />
            */}
            <Button
                style={styles.button}
                onPress={() => handleMessageNavigation(user.uid,item.roomate_uid)}
                title="Message"
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Top 5 Roomate Matches</Text>
            <FlatList
                data={top5}
                renderItem={renderItem}
                //keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    roomateScore: {
        fontSize: 16,
        color: '#555',
    },
    button: {
        marginTop: 20,
    },
});
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>