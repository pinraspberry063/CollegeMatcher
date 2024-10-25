// Display the different colleges for selection.

import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Alert, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);

const ColForumSelector = ({ navigation }) => {
  const { user } = useContext(UserContext);  // Get the current user from UserContext
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchCommittedColleges = async () => {
      if (!user || !user.uid) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      try {
        // Query the "Users" collection for the document where "User_UID" matches the current user's UID
        const usersQuery = query(collection(firestore, 'Users'), where('User_UID', '==', user.uid));
        const querySnapshot = await getDocs(usersQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];  // Get the first matching document
          const data = userDoc.data();

          // Set the colleges from the user's Committed_Colleges field
          setColleges(data.Committed_Colleges || []);
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
    <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
    <SafeAreaView style={styles.container}>
      <ScrollView>
         <View style={styles.followedForumsContainer}>
           <Text style={styles.followedForumsText}>View Your Followed Forums </Text>
           <TouchableOpacity onPress={handleFollowedForumsNavigation}>
             <Image source={require('../assets/faves.png')} style={styles.followedForumsImage} />
           </TouchableOpacity>
         </View>

        {colleges.length > 0 ? (
          colleges.map((college) => (
            <View key={college} style={styles.buttonContainer}>
              <Button
                title={college}
                onPress={() => handleNavigation(college)}
                color="#4d5457"
              />
            </View>
          ))
        ) : (
          <Text style={styles.noCollegesText}>No committed colleges found.</Text>
        )}
        {/*<View style={styles.followedForumsButtonContainer}>
          <Button
            title="View Followed Forums"
            onPress={handleFollowedForumsNavigation}
            color="#841584"
          />
        </View>*/}
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    marginBottom: 16,
    borderRadius: 10,
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
  background: {
      flex: 1,
      resizeMode: 'cover'
    },
followedForumsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#841584',
  padding: 15,
  borderRadius: 8,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: 'black',
},
followedForumsText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#fff',  // Text color
  flex: 1,  // Take up space to push the image to the right
},
followedForumsImage: {
  width: 55,  // Image width
  height: 55,  // Image height
},

});

export default ColForumSelector;
