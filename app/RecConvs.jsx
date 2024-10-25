import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, updateDoc, doc, arrayUnion, arrayRemove, getDocs, where, addDoc } from 'firebase/firestore';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { UserContext } from '../components/UserContext';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window'); // Get device dimensions

const RecConvs = ({ navigation }) => {
  const theme = useContext(themeContext);
  const { user } = useContext(UserContext);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [recruiters, setRecruiters] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      const firestore = getFirestore(db);

      // Fetch user data
      const usersQuery = query(collection(firestore, 'Users'), where('User_UID', '==', user.uid));
      const userSnapshot = await getDocs(usersQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setIsRecruiter(userData.IsRecruiter);
        if (userData.IsRecruiter) {
          // If user is a recruiter, fetch conversations with non-recruiters
          fetchConversations();
        } else {
          // If user is not a recruiter, fetch recruiters for their committed colleges
          fetchRecruitersForColleges(userData.Committed_Colleges || []);
        }
      } else {
        Alert.alert('Error', 'User data not found.');
      }
    };

    const fetchConversations = async () => {
      const firestore = getFirestore(db);
      const messagingRef = collection(firestore, 'Messaging');
      const recruiterQuery = query(messagingRef, where('Recruiter_UID', '==', user.uid));

      const querySnapshot = await getDocs(recruiterQuery);
      const convs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConversations(convs);

      const userUIDs = convs.map(conv => conv.User_UID);
      fetchUsernames(userUIDs);
    };

    const fetchRecruitersForColleges = async (committedColleges) => {
      const firestore = getFirestore(db);
      let recruiterUIDs = [];

      // Loop through each committed college and match it by 'shool_name' in 'CompleteColleges' collection
      for (const collegeName of committedColleges) {
        const collegesQuery = query(
          collection(firestore, 'CompleteColleges'),
          where('shool_name', '==', collegeName)
        );
        const collegeSnapshot = await getDocs(collegesQuery);

        if (!collegeSnapshot.empty) {
          const collegeDoc = collegeSnapshot.docs[0]; // Get the first matching college
          const collegeData = collegeDoc.data();
          recruiterUIDs = recruiterUIDs.concat(collegeData.RecruiterUIDs || []);
        }
      }

      recruiterUIDs = [...new Set(recruiterUIDs)]; // Remove duplicates
      fetchUsernames(recruiterUIDs);
      setRecruiters(recruiterUIDs);
    };

    const fetchUsernames = async (userUIDs) => {
      const firestore = getFirestore(db);
      const usersRef = collection(firestore, 'Users');
      const usernameMap = {};

      for (const uid of userUIDs) {
        const userQuery = query(usersRef, where('User_UID', '==', uid));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          usernameMap[uid] = userDoc.data().Username;
        }
      }

      setUsernames(usernameMap);
    };

    fetchUserData();
  }, [user]);

  // Memoize the handleMessageNavigation function to avoid re-creation during each render
  const handleMessageNavigation = useCallback(
    async (recruiterUID) => {
      const firestore = getFirestore(db);

      // Check if a conversation already exists between the user and the recruiter
      const messagingRef = collection(firestore, 'Messaging');
      const existingConvoQuery = query(
        messagingRef,
        where('Recruiter_UID', '==', recruiterUID),
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
                 const k = query(usersRef,where('User_UID', '==', recruiterUID));
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

        const newConvoRef = await addDoc(collection(firestore, 'Messaging'), {
          Recruiter_UID: recruiterUID,
          User_UID: user.uid,
        });

        // Create a sub-collection 'conv' within the new conversation document
        await addDoc(collection(newConvoRef, 'conv'), {});

        // Navigate to the newly created conversation
        navigation.navigate('Message', { conversationId: newConvoRef.id });
      }
    },
    [db, user, navigation] // Dependencies for useCallback
  );

 return (
  <FastImage source={require('../assets/galaxy.webp')} style={styles.background}>
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { color: '#fff' }]}>
        {isRecruiter ? 'Conversations with Users' : 'Available Recruiters'}
      </Text>
      <ScrollView style={styles.conversationsContainer}>
        {isRecruiter ? (
          conversations.length > 0 ? (
            conversations.map(conv => (
              <View key={conv.id} style={styles.conversation}>
                <Text style={[styles.conversationText, { color: '#fff' }]}>
                  User: {usernames[conv.User_UID] || conv.User_UID}
                </Text>
                <Button title="Message" onPress={() => navigation.navigate('Message', { conversationId: conv.id })} />
              </View>
            ))
          ) : (
            <Text style={[styles.noConversationsText, { color: '#fff' }]}>No conversations found.</Text>
          )
        ) : (
          recruiters.length > 0 ? (
            recruiters.map(uid => (
              <View key={uid} style={styles.conversation}>
                <Text style={[styles.conversationText, { color: '#fff' }]}>
                  Recruiter: {usernames[uid] || uid}
                </Text>
                <Button title="Message" onPress={() => handleMessageNavigation(uid)} />
              </View>
            ))
          ) : (
            <Text style={styles.noRecruitersText}>No recruiters found for your committed colleges.</Text>
          )
        )}
      </ScrollView>
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
    paddingHorizontal: width * 0.05, // Scaled horizontal padding
    paddingTop: height * 0.02, // Scaled top padding
  },
  title: {
    fontSize: height * 0.03, // Scaled font size for title
    fontWeight: 'bold',
    marginVertical: height * 0.02, // Scaled vertical margin for title
  },
  conversationsContainer: {
    flex: 1,
  },
  conversation: {
    padding: height * 0.02, // Scaled padding
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: height * 0.01, // Scaled vertical margin
  },
  conversationText: {
    fontSize: height * 0.025, // Scaled font size
  },
  noConversationsText: {
    fontSize: height * 0.02, // Scaled font size for no conversations message
    textAlign: 'center',
    marginTop: height * 0.05, // Scaled top margin for no conversations message
  },
  noRecruitersText: {
    fontSize: height * 0.02, // Scaled font size for no recruiters message
    textAlign: 'center',
    marginTop: height * 0.05, // Scaled top margin for no recruiters message
  },
});

export default RecConvs;
