import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const firestore = getFirestore(db);

const ModeratorScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const reportsRef = collection(firestore, 'Reports');
    const q = query(reportsRef, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    const reportsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReports(reportsList);
  };

  const handleBanUser = async (reportId, reportedUser) => {
    try {
      // First, find the user document using the User_UID
      const usersRef = collection(firestore, 'Users');
      const q = query(usersRef, where('User_UID', '==', reportedUser));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = querySnapshot.docs[0];

      // Update user's status in Firestore
      await updateDoc(userDoc.ref, { status: 'banned' });

      // Update report status
      const reportRef = doc(firestore, 'Reports', reportId);
      await updateDoc(reportRef, { status: 'resolved' });

      // Refresh reports list
      fetchReports();

      Alert.alert('User Banned', 'The user has been banned successfully.');
    } catch (error) {
      console.error('Error banning user: ', error);
      Alert.alert('Error', 'Failed to ban user. Please try again.');
    }
  };

const fetchUserActivity = async (reportedUser) => {
  try {
    const usersRef = collection(firestore, 'Users');
    let userQuery = query(usersRef, where('Username', '==', reportedUser));
    let querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      userQuery = query(usersRef, where('User_UID', '==', reportedUser));
      querySnapshot = await getDocs(userQuery);
    }

    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const userDoc = querySnapshot.docs[0];
    const username = userDoc.data().Username;
    const userUID = userDoc.data().User_UID;
    console.log('Found user:', username, 'UID:', userUID);

    const userActivity = { threads: [], posts: [] };

    const collegeName = 'Louisiana Tech University';
    const subgroupsToCheck = ['Recruiter Check', 'Test General'];

    for (const subgroupName of subgroupsToCheck) {
      console.log('Checking subgroup:', subgroupName);

      const threadsRef = collection(firestore, 'Forums', collegeName, 'subgroups', subgroupName, 'threads');
      const threadsSnapshot = await getDocs(threadsRef);

      console.log('Threads found:', threadsSnapshot.size);

      // Fetch threads created by the user
      const userThreadsQuery = query(threadsRef, where('createdBy', '==', username));
      const userThreadsSnapshot = await getDocs(userThreadsQuery);

      userThreadsSnapshot.forEach(threadDoc => {
        userActivity.threads.push({
          id: threadDoc.id,
          collegeName,
          subgroupName,
          ...threadDoc.data()
        });
      });

      // Fetch posts for each thread in the subgroup
      for (const threadDoc of threadsSnapshot.docs) {
        const postsRef = collection(threadsRef, threadDoc.id, 'posts');
        const postsQuery = query(postsRef, where('createdBy', '==', username));
        const postsSnapshot = await getDocs(postsQuery);

        console.log('Posts found in thread', threadDoc.id, ':', postsSnapshot.size);

        postsSnapshot.forEach(postDoc => {
          userActivity.posts.push({
            id: postDoc.id,
            threadId: threadDoc.id,
            collegeName,
            subgroupName,
            ...postDoc.data()
          });
        });
      }
    }

    console.log('User Activity:', userActivity);
    return userActivity;
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return null;
  }
};

  const handleViewUserActivity = async (reportedUser) => {
    const userActivity = await fetchUserActivity(reportedUser);
    if (userActivity) {
      navigation.navigate('UserActivityScreen', { userActivity, reportedUser });
    } else {
      Alert.alert('Error', 'Failed to fetch user activity. Please try again.');
    }
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.reportItem}>
      <Text>Reported User: {item.reportedUser}</Text>
      <Text>Reported By: {item.reportedBy}</Text>
      <Text>Created At: {item.createdAt.toDate().toLocaleString()}</Text>
      <Button title="Ban User" onPress={() => handleBanUser(item.id, item.reportedUser)} />
      <Button title="View User Activity" onPress={() => handleViewUserActivity(item.reportedUser)} />
    </View>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Reports</Text>
      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  reportItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default ModeratorScreen;