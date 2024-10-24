// After a college is selected, this screen allows the user to follow subgroups of their interest so they are easy to navigate to.

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, doc, query, where, getFirestore, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);
const { width, height } = Dimensions.get('window');

const FollowedForums = ({ navigation }) => {
  const [followedSubgroups, setFollowedSubgroups] = useState([]);
  const [subgroupDetails, setSubgroupDetails] = useState([]);
  const { user } = useContext(UserContext);
  const theme = useContext(themeContext);

  useEffect(() => {
    if (user) {
      fetchFollowedSubgroups(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (followedSubgroups.length > 0) {
      fetchSubgroupDetails();
    }
  }, [followedSubgroups]);

  const fetchFollowedSubgroups = async (uid) => {
    try {
      const usersRef = collection(firestore, 'Users');
      const q = query(usersRef, where('User_UID', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const followedGroups = userDoc.data().followed_subGroups || [];
        setFollowedSubgroups(followedGroups);
      } else {
        console.error('No user found with the given UID.');
      }
    } catch (error) {
      console.error('Error fetching followed subgroups:', error);
    }
  };

  const fetchSubgroupDetails = async () => {
    try {
      const details = await Promise.all(
        followedSubgroups.map(async (collegeAndForum) => {
          const [collegeName, forumId] = collegeAndForum.split(':');
          const forumDocRef = doc(firestore, 'Forums', collegeName, 'subgroups', forumId);
          const forumDoc = await getDoc(forumDocRef);
          if (forumDoc.exists()) {
            return {
              collegeName,
              forumName: forumDoc.data().forumName,
              forumId,
            };
          }
          return null;
        })
      );
      setSubgroupDetails(details.filter(detail => detail !== null));
    } catch (error) {
      console.error('Error fetching subgroup details:', error);
    }
  };

  const toggleFollowSubgroup = async (collegeName, forumId) => {
    try {
      const usersRef = collection(firestore, 'Users');
      const q = query(usersRef, where('User_UID', '==', user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        const followString = `${collegeName}:${forumId}`;
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

  const handleNavigation = (collegeName, forumName) => {
    navigation.navigate('Forum', { collegeName, forumName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {subgroupDetails.map(({ collegeName, forumName, forumId }) => (
          <View key={forumId} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{forumName}</Text>
            <Text style={styles.collegeLabel}>College: {collegeName}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleNavigation(collegeName, forumName)}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.followButton}
                onPress={() => toggleFollowSubgroup(collegeName, forumId)}
              >
                <Text style={styles.buttonText}>
                  {followedSubgroups.includes(`${collegeName}:${forumId}`) ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04, // Dynamic padding based on screen width
    backgroundColor: '#000',
  },
  buttonContainer: {
    marginBottom: height * 0.02, // Dynamic margin bottom
    padding: height * 0.02, // Dynamic padding inside button container
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#444',
  },
  buttonText: {
    fontSize: height * 0.025, // Dynamic font size
    fontWeight: 'bold',
    marginBottom: height * 0.01, // Dynamic margin bottom
    color: '#fff',
  },
  collegeLabel: {
    fontSize: height * 0.02, // Dynamic font size
    color: '#fff',
    marginBottom: height * 0.01, // Dynamic margin bottom
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
    marginRight: width * 0.02, // Dynamic margin between buttons
  },
  followButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    padding: height * 0.015, // Dynamic padding
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default FollowedForums;
