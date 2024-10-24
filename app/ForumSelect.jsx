// College selected. Display the different subgroups within the college's forum.

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove, doc, query, where, getFirestore, Timestamp } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);
const { width, height } = Dimensions.get('window'); // Get device dimensions

const ForumSelect = ({ route, navigation }) => {
  const { collegeName } = route.params;
  const [subgroups, setSubgroups] = useState([]);
  const [newSubgroupName, setNewSubgroupName] = useState('');
  const { user } = useContext(UserContext);
  const theme = useContext(themeContext);
  const [username, setUsername] = useState('');
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [followedSubgroups, setFollowedSubgroups] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUsernameAndRecruiterStatus(user.uid);
      fetchFollowedSubgroups(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const fetchSubgroups = async () => {
      try {
        const subgroupsRef = collection(firestore, 'Forums', collegeName, 'subgroups');
        const subgroupsSnapshot = await getDocs(subgroupsRef);
        const subgroupsList = subgroupsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubgroups(subgroupsList);
      } catch (error) {
        console.error('Error fetching subgroups:', error);
      }
    };

    fetchSubgroups();
  }, [collegeName]);

  const fetchUsernameAndRecruiterStatus = async (uid) => {
    try {
      const usersRef = collection(firestore, 'Users');
      const q = query(usersRef, where('User_UID', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setUsername(userData.Username);
        setIsRecruiter(userData.IsRecruiter || false); // Check if the user is a recruiter
      } else {
        console.error('No user found with the given UID.');
      }
    } catch (error) {
      console.error('Error fetching username and recruiter status:', error);
    }
  };

  const fetchFollowedSubgroups = async (uid) => {
    try {
      const usersRef = collection(firestore, 'Users');
      const q = query(usersRef, where('User_UID', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setFollowedSubgroups(userDoc.data().followed_subGroups || []);
      }
    } catch (error) {
      console.error('Error fetching followed subgroups:', error);
    }
  };

  const toggleFollowSubgroup = async (collegeName, subgroupId) => {
    try {
      const usersRef = collection(firestore, 'Users');
      const q = query(usersRef, where('User_UID', '==', user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        const followString = `${collegeName}:${subgroupId}`; // Format as CollegeName:documentID
        const isFollowing = followedSubgroups.includes(followString);

        if (isFollowing) {
          await updateDoc(userDocRef, {
            followed_subGroups: arrayRemove(followString)
          });
          setFollowedSubgroups(followedSubgroups.filter(item => item !== followString));
        } else {
          await updateDoc(userDocRef, {
            followed_subGroups: arrayUnion(followString)
          });
          setFollowedSubgroups([...followedSubgroups, followString]);
        }
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error toggling follow subgroup:', error);
    }
  };

  const handleAddSubgroup = async () => {
      if (newSubgroupName.trim() && username) {
        try {
          const subgroupsRef = collection(firestore, 'Forums', collegeName, 'subgroups');

          // Check if a document with the same forumName already exists
          const existingSubgroupQuery = query(subgroupsRef, where('forumName', '==', newSubgroupName.trim()));
          const existingSubgroupSnapshot = await getDocs(existingSubgroupQuery);

          if (!existingSubgroupSnapshot.empty) {
            console.log('Subgroup with this name already exists.');
            return; // Prevent creating a duplicate
          }

          const newSubgroup = {
            forumName: newSubgroupName.trim(),
            createdBy: username,
            createdAt: Timestamp.now(),
            isRecruiter
          };
          const docRef = await addDoc(subgroupsRef, newSubgroup);
          setSubgroups([...subgroups, { id: docRef.id, ...newSubgroup }]);
          setNewSubgroupName('');
        } catch (error) {
          console.error('Error adding new subgroup:', error);
        }
      }
  };

  const handleNavigation = async (forumName) => {
    try {
      const subgroupsRef = collection(firestore, 'Forums', collegeName, 'subgroups');
      const subgroupQuery = query(subgroupsRef, where('forumName', '==', forumName));
      const subgroupSnapshot = await getDocs(subgroupQuery);

      if (subgroupSnapshot.empty) {
        console.log('Subgroup does not exist.');
        return; // Prevent navigation if the subgroup doesn't exist
      }

      navigation.navigate('Forum', { collegeName, forumName });
    } catch (error) {
      console.error('Error navigating to the forum:', error);
    }
  };

    const handleRoomateMatcherNavigation = () => {
      navigation.navigate('RoomateMatcher');
    };

  return (
    <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {subgroups.map(subgroup => (
          <View key={subgroup.id} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{subgroup.forumName}</Text>
            <Text style={[
              styles.buttonSubText,
              subgroup.isRecruiter && styles.recruiterHighlight // Highlight if the creator is a recruiter
            ]}>
              Created by: {subgroup.createdBy}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleNavigation(subgroup.forumName)}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.followButton, { backgroundColor: '#841584' }]}  // Set background color to #841584
                onPress={() => toggleFollowSubgroup(collegeName, subgroup.id)}  // Pass the college name and subgroup ID
              >
                <Image
                  source={
                    followedSubgroups.includes(`${collegeName}:${subgroup.id}`)
                      ? require('../assets/FilledBookmark.png')  // Show filled bookmark when unfollowing
                      : require('../assets/Bookmark.png')        // Show normal bookmark when following
                  }
                  style={styles.icon}  // Style the icon
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={styles.newSubgroupContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Subgroup Name"
            value={newSubgroupName}
            onChangeText={setNewSubgroupName}
          />
          <Button title="Add Subgroup" onPress={handleAddSubgroup} style={styles.button} color="#841584" />
        </View>
                <View style={styles.followedForumsButtonContainer}>
                    <Button
                      title="Find a Roommate"
                       onPress={handleRoomateMatcherNavigation}
                       color="#841584"
                    />
                </View>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04, // Dynamic padding based on screen width
    backgroundColor: '#000',
  },
  button: {
      borderRadius: 10,
      color: '#841584',
      },
  buttonContainer: {
    marginBottom: height * 0.02, // Dynamic margin bottom
    padding: height * 0.02, // Dynamic padding inside button container
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#000033',
  },
  buttonText: {
    fontSize: height * 0.025, // Dynamic font size
    fontWeight: 'bold',
    marginBottom: height * 0.01, // Dynamic margin bottom
    color: '#fff',
  },
  buttonSubText: {
    fontSize: height * 0.02, // Dynamic font size
    marginBottom: height * 0.01, // Dynamic margin bottom
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 3,
    backgroundColor: '#4CAF50',
    padding: height * 0.015, // Dynamic padding
    borderRadius: 8,
    alignItems: 'center',
    marginRight: width * 0.02, // Dynamic margin
  },
  followButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    padding: height * 0.015, // Dynamic padding
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newSubgroupContainer: {
    marginTop: height * 0.02, // Dynamic margin top
    padding: height * 0.02, // Dynamic padding
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    backgroundColor: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: height * 0.015, // Dynamic padding
    marginBottom: height * 0.02, // Dynamic margin
    borderRadius: 4,
    color: '#fff',
    backgroundColor: '#666',
  },
  recruiterHighlight: {
    fontWeight: 'bold',
    color: '#ff9900', // Highlight color for recruiters
  },
  background: {
    flex: 1,
    resizeMode: 'cover'
  },
  icon: {
    width: 24,
    height: 24,
  }
});

export default ForumSelect;
