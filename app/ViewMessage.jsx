import React, { useState, useContext, useEffect,useCallback } from 'react';
import { StyleSheet, Text, FlatList, View, ScrollView, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);

const ViewMessage = ( { navigation } ) => {
    console.log("Looping entire ViewMessaage");
  const { user } = useContext(UserContext);  // Get the current user from UserContext
  const [colleges, setColleges] = useState([]);
  const [collegeName, setCollegeName] = useState('');
  const [userName, setUsername] = useState('');
  const [otherName, setOtherName] = useState('');
  const [activeMessages, setActiveMessages] = useState([]);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const theme = useContext(themeContext);

         //console.log("LOOP");

  useEffect(() => {
    const fetchCommittedColleges = async () => {
      if (!user || !user.uid) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      try {
        // Query the "Users" collection for the document where "User_UID" matches the current user's UID
        const usersQuery = query(collection(firestore, 'Users'),
            where('User_UID', '==', user.uid));
        const querySnapshot = await getDocs(usersQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];  // Get the first matching document
          const data = userDoc.data();

          // Set the colleges from the user's Committed_Colleges field
          setActiveMessages(data.activeMessages || []);
        } else {
          Alert.alert('Error', 'User data not found.');
        }
      } catch (error) {
        console.error('Error fetching committed colleges:', error);
        Alert.alert('Error', 'Something went wrong while fetching committed colleges.');
      }
        console.log("LOOP INSIDE USEEFFECT");
    };

    fetchCommittedColleges();
  }, [user]);

    const handleMessageNavigation = useCallback(
        async (userUID,otherUID) => {

          //navigate to the roomate's messaging page
          const firestore = getFirestore(db);
          const messagingRef = collection(firestore, 'Messaging');
          //Get recruiter status of the other user
          const otherQuery = query(collection(firestore, 'Users'), where('User_UID', '==', otherUID));
          const otherSnapshot = await getDocs(otherQuery);
          if(!otherSnapshot.empty){
              const otherData = otherSnapshot.docs[0].data();
            setIsRecruiter(otherData.IsRecruiter);
          if(otherData.IsRecruiter == true){
              console.log("IsRecruiter");
                  const existingConvoQuery = query(
                      messagingRef,
                      where('Recruiter_UID', '==', otherUID),
                      where('User_UID', '==', user.uid)
                    );
                    const existingConvoSnapshot = await getDocs(existingConvoQuery);

                    if (!existingConvoSnapshot.empty) {
                      // Conversation already exists, navigate to the existing conversation
                      const conversationId = existingConvoSnapshot.docs[0].id;
                      navigation.navigate('Message', { conversationId });
                    } else {
                      //populate recruiter and users active messages
                             try {
                               const usersRef = collection(firestore, 'Users');
                               const q = query(usersRef, where('User_UID', '==', user.uid));
                               const k = query(usersRef,where('User_UID', '==', otherUID));
                               const queryUserSnapshot = await getDocs(q);
                               const queryRecruiterSnapshot = await getDocs(k);
                               if (!queryUserSnapshot.empty && !queryRecruiterSnapshot.empty) {
                                 const userDoc = queryUserSnapshot.docs[0];
                                 const userDocRef = doc(firestore, 'Users', userDoc.id);
                                 const recruiterDoc = queryRecruiterSnapshot.docs[0];
                                 const recruiterDocRef = doc(firestore, 'Users', recruiterDoc.id);
                                 const userData = userDoc.data();
                                 const recruiterData = recruiterDoc.data();
                                 //populate the users active messages with the recruiters uid
                                 await updateDoc(userDocRef, {
                                      activeMessages: arrayUnion(recruiterUID),
                                  })
                                  //populate the recruiters active messages with the users uid
                                 await updateDoc(recruiterDocRef, {
                                      activeMessages: arrayUnion(user.uid),
                                  })
                               } else {
                                 console.error('No user found with the given UID.');
                               }
                             } catch (error) {
                               console.error('Error Fetching Username:', error);
                             }
                      // No conversation exists, create a new one

                      // Create a sub-collection 'conv' within the new conversation document

                      // Navigate to the newly created conversation
                      navigation.navigate('Message', { conversationId: newConvoRef.id });
                    }
              }
          console.log("Not Recruiter");
          }
          //const messagingRef = collection(firestore, 'Messaging');
          const existingConvoInQuery = query(
            messagingRef,
            where('Roomate_UID', '==', userUID),
            where('User_UID', '==', otherUID)
          );
          const existingConvoOutQuery = query(
            messagingRef,
            where('Roomate_UID', '==', otherUID),
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
              console.log("No existing convo");
              console.log(userUID);
              console.log(otherUID);
            // No conversation exists, create a new one

            // Create a sub-collection 'conv' within the new conversation document
          }
        },
        [db, user, navigation] // Dependencies for useCallback
      );
  const handleFollowedForumsNavigation = () => {
    navigation.navigate('FollowedForums');
    console.log("LOOP AT END");
  };


  //console.log(getDocs(query(collection(firestore,'Users'),where('Users_UID', '==',item)))).docs[0].data().Username);
      const renderItem = ({ item }) => (
          <View style={styles.card}>
              <Text style={styles.username}>{
              item}</Text>
              <Button
                  style={styles.button}
                  onPress={() => handleMessageNavigation(user.uid,item)}
                  title="Message"
              />
          </View>
      );


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Currently Active Conversations</Text>
            <FlatList
                data={activeMessages}
                renderItem={renderItem}
                //keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
      title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          color: '#faf7f7',
          textAlign: 'center',
      },
    card: {
        backgroundColor: '#8f8f8f',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
  buttonContainer: {
    marginBottom: 16,
  },
  noCollegesText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  followedForumsButtonContainer: {
    marginTop: 20,
    padding: 10,
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
  },
      username: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 5,
      },
});

export default ViewMessage;