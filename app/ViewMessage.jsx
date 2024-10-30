import React, { useState, useContext, useEffect,useCallback } from 'react';
import { StyleSheet, Text, FlatList, View, ScrollView, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserContext } from '../components/UserContext';
import FastImage from 'react-native-fast-image';

const firestore = getFirestore(db);

const ViewMessage = ( { navigation } ) => {
    console.log("Looping entire ViewMessaage");
  const { user } = useContext(UserContext);  // Get the current user from UserContext
  const [colleges, setColleges] = useState([]);
  const [collegeName, setCollegeName] = useState('');
  const [userName, setUsername] = useState('');
  const [otherName, setOtherName] = useState('');
  const [activeMessages, setActiveMessages] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [isRecruiter, setIsRecruiter] = useState(false);

         //console.log("LOOP");

         useEffect(() => {
          const fetchActiveMessages = async () => {
            if (!user || !user.uid) {
              Alert.alert('Error', 'User not logged in.');
              return;
            }
      
            try {
              const usersQuery = query(collection(firestore, 'Users'),
                  where('User_UID', '==', user.uid));
              const querySnapshot = await getDocs(usersQuery);
      
              if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const data = userDoc.data();
      
                const activeUserNames = data.activeMessages || [];
                console.log("Below is activeUserNames");
                console.log(activeUserNames);
                setActiveMessages(data.activeMessages || []);
      
                // Fetch usernames of active users
                const resolvedUserNames = await Promise.all(
                  activeUserNames.map(async (activeUser) => {
                    const userNamesQuery = query(
                      collection(firestore, 'Users'),
                      where('User_UID', '==', activeUser)
                    );
                    const querySnapshot = await getDocs(userNamesQuery);
      
                    if (!querySnapshot.empty) {
                      const userNameDoc = querySnapshot.docs[0];
                      const data = userNameDoc.data();
                      return data;  // Return the whole data object instead of JSON string
                    }
                    return null;
                  })
                );
                // Filter out null values (in case no data is found)
                setUserNames(resolvedUserNames.filter(Boolean));
      
              } else {
                Alert.alert('Error', 'User data not found.');
              }
            } catch (error) {
              console.error('Error fetching usernames:', error);
              Alert.alert('Error', 'Something went wrong while fetching usernames.');
            }
          };
      
          fetchActiveMessages();
        }, []);

        useEffect(() => {
          const fetchOtherUsers = async () => {
      
            try {
              await getDoc(doc(collection(firestore, 'Users'), user.uid))
              .then(rm => {
                const messages = [];
                const data = rm.data()
                const top5Room = data.top5Roomates;
                top5Room.map(async(roomi)=> {
                  const qry = query(collection(firestore, 'Users'), where('User_UID', '==',roomi.roomate_uid ))
                  const matches = await getDocs(qry);

                  if(!matches.empty){
                    const suggested = matches.docs[0];
                    const suggData = suggested.data();
                    messages.push(suggData);
                    console.log(messages.length)
                  
                  }
                
                })
                setNewMessages(messages);
              })
             
            } catch (error) {
              console.error('Error fetching usernames:', error);
              Alert.alert('Error', 'Something went wrong while fetching usernames.');
            }
          };
      
          fetchOtherUsers();
        }, []);

        const handleMessageNavigation = useCallback(
          async (userUID, otherUID) => {
            const firestore = getFirestore(db);
            const messagingRef = collection(firestore, 'Messaging');
            
            try {
              // Handle Recruiter Logic
              const otherQuery = query(collection(firestore, 'Users'), where('User_UID', '==', otherUID));
              const otherSnapshot = await getDocs(otherQuery);
        
              if (!otherSnapshot.empty) {
                const otherData = otherSnapshot.docs[0].data();
                setIsRecruiter(otherData.IsRecruiter);
        
                if (otherData.IsRecruiter) {
                  const existingConvoQuery = query(
                    messagingRef,
                    where('Recruiter_UID', '==', otherUID),
                    where('User_UID', '==', user.uid)
                  );
                  const existingConvoSnapshot = await getDocs(existingConvoQuery);
        
                  if (!existingConvoSnapshot.empty) {
                    // Navigate to the existing conversation
                    const conversationId = existingConvoSnapshot.docs[0].id;
                    navigation.navigate('Message', { conversationId , otherUID});
                  } else {
                    // Handle creating a new conversation if needed
                    // Navigate to the new conversation page
                    
                    const newConvoRef = await addDoc(collection(firestore, 'Messaging'), {
                      Roomate_UID: roomateUID,
                      User_UID: userUID,
                    });

                    // Create a sub-collection 'conv' within the new conversation document
                    await addDoc(collection(newConvoRef, 'conv'), {});
                  }
                  return;
                }
              }
        
              // Handle Roommate Logic
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
        
                // Navigate to the existing roommate conversation
                const conversationId = !existingConvoInSnapshot.empty
                  ? existingConvoInSnapshot.docs[0].id
                  : existingConvoOutSnapshot.docs[0].id;
                  
                navigation.navigate('RoomateMessage', { conversationId });
              
            } catch (error) {
              console.error("Error navigating to conversation:", error);
            }
          },
          [db, user, navigation] // Ensure user and navigation are dependencies
        );
         // Dependencies for useCallback
      
  const handleFollowedForumsNavigation = () => {
    navigation.navigate('FollowedForums');
    console.log("LOOP AT END");
  };


  //console.log(getDocs(query(collection(firestore,'Users'),where('Users_UID', '==',item)))).docs[0].data().Username);
      const renderItem = ({ item }) => {
          // const other = JSON.stringify(item);
          // console.log(other);
          // console.log(userNames.Username);
         
          return(
                    <View style={styles.card}>
                        <Text style={styles.username}>{item.Username}</Text>
                        <Button
                            style={styles.button}
                            onPress={() => handleMessageNavigation(user.uid,item.User_UID)}
                            title="Send Message"
                        />
                    </View>
                )

          };


    return (
      <FastImage source={require('../assets/galaxy.webp')} style={styles.background}>
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Currently Active Conversations</Text>
            <FlatList
                data={userNames}
                renderItem={renderItem}
                //keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
            <Text style={styles.title}>Suggested</Text>
            <FlatList
                data={newMessages}
                renderItem={renderItem}
                //keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
      </FastImage>
    );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
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
          color: 'black'
      },
});

export default ViewMessage;