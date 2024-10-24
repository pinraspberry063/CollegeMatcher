import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, getDocs, where, addDoc } from 'firebase/firestore';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { UserContext } from '../components/UserContext';

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

      // Loop through each committed college and match it by 'school_name' in 'CompleteColleges' collection
      for (const collegeName of committedColleges) {
        const collegesQuery = query(
          collection(firestore, 'CompleteColleges'),
          where('school_name', '==', collegeName)
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
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { color: theme.color }]}>
        {isRecruiter ? 'Conversations with Users' : 'Available Recruiters'}
      </Text>
      <ScrollView style={styles.conversationsContainer}>
        {isRecruiter ? (
          // If recruiter, display conversations with users
          conversations.length > 0 ? (
            conversations.map(conv => (
              <View key={conv.id} style={styles.conversation}>
                <Text style={styles.conversationText}>User: {usernames[conv.User_UID] || conv.User_UID}</Text>
                <Button title="Message" onPress={() => navigation.navigate('Message', { conversationId: conv.id })} />
              </View>
            ))
          ) : (
            <Text style={styles.noConversationsText}>No conversations found.</Text>
          )
        ) : (
          // If not a recruiter, display available recruiters
          recruiters.length > 0 ? (
            recruiters.map(uid => (
              <View key={uid} style={styles.conversation}>
                <Text style={styles.conversationText}>Recruiter: {usernames[uid] || uid}</Text>
                <Button title="Message" onPress={() => handleMessageNavigation(uid)} />
              </View>
            ))
          ) : (
            <Text style={styles.noRecruitersText}>No recruiters found for your committed colleges.</Text>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  conversationsContainer: {
    flex: 1,
  },
  conversation: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
  },
  conversationText: {
    fontSize: 16,
  },
  noConversationsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  noRecruitersText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RecConvs;
