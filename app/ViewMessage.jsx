import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);

const ViewMessage = ( { navigation } ) => {
  const { user } = useContext(UserContext);  // Get the current user from UserContext
  const [colleges, setColleges] = useState([]);
  const [collegeName, setCollegeName] = useState('');
  const [userName, setUsername] = useState('');
  const [otherName, setOtherName] = useState('');
  const [activeMessages, setActiveMessages] = useState([]);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isRoomate, setIsRoomate] = useState(false);
  const theme = useContext(themeContext);

        const fetchUsername = async (uid) => {
               try {
                 const usersRef = collection(firestore, 'Users');
                 const q = query(usersRef, where('User_UID', '==', uid));
                 const querySnapshot = await getDocs(q);
                 if (!querySnapshot.empty) {
                   const userDoc = querySnapshot.docs[0];
                   const userData = userDoc.data();
                   setUsername(userData.Username);
                   setActiveMessages(userData.activeMessages);
                 } else {
                   console.error('No user found with the given UID.');
                 }
               } catch (error) {
                 console.error('Error Fetching Username and CollegeName:', error);
               }
             };
         fetchUsername(auth().currentUser.uid);
         console.log(activeMessages);

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
          setActiveMessages(data.activeMessaages || []);
        } else {
          Alert.alert('Error', 'User data not found.');
        }
      } catch (error) {
        console.error('Error fetching committed colleges:', error);
        Alert.alert('Error', 'Something went wrong while fetching committed colleges.');
      }
    };

    fetchCommittedColleges();
  }, [user]);

  const handleNavigation = async (collegeName) => {
    // Navigate to the ForumSelect screen for the selected college
    navigation.navigate('ForumSelect', { collegeName });
  };

  const handleFollowedForumsNavigation = () => {
    navigation.navigate('FollowedForums');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {activeMessages.length > 0 ? (
          activeMessages.map((activeMessages) => (
            <View key={activeMessages} style={styles.card}>
              <Button
                title={activeMessages}
                onPress={() => handleNavigation(college)}
                color={theme.buttonColor}
              />
            </View>
          ))
        ) : (
          <Text style={styles.noCollegesText}>No committed colleges found.</Text>
        )}
        <View style={styles.followedForumsButtonContainer}>
          <Button
            title="View Followed Forums"
            onPress={handleFollowedForumsNavigation}
            color={theme.buttonColor}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 16,
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

});

export default ViewMessage;