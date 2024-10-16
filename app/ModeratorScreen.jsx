import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, collectionGroup } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const firestore = getFirestore(db);

const ModeratorScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const reportsRef = collection(firestore, 'Reports');
      const q = query(reportsRef, where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const reportsList = await Promise.all(querySnapshot.docs.map(async doc => {
        const reportData = doc.data();
        const userRef = collection(firestore, 'Users');
        let userQuery = query(userRef, where('Username', '==', reportData.reportedUser));
        let userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          userQuery = query(userRef, where('User_UID', '==', reportData.reportedUser));
          userSnapshot = await getDocs(userQuery);
        }

        const isBanned = !userSnapshot.empty && userSnapshot.docs[0].data().IsBanned;
        return { id: doc.id, ...reportData, isBanned };
      }));

      // Sort reports by createdAt timestamp (most recent first)
      reportsList.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

      setReports(reportsList);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to fetch reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchReports(); // If search term is empty, fetch all reports
      return;
    }

    setIsLoading(true);
    try {
      const reportsRef = collection(firestore, 'Reports');
      const q = query(reportsRef,
        where('status', '==', 'pending'),
        where('reportedUser', '==', searchTerm.trim())
      );
      const querySnapshot = await getDocs(q);
      const reportsList = await Promise.all(querySnapshot.docs.map(async doc => {
        const reportData = doc.data();
        const userRef = collection(firestore, 'Users');
        let userQuery = query(userRef, where('User_UID', '==', reportData.reportedUser));
        let userSnapshot = await getDocs(userQuery);

        const isBanned = !userSnapshot.empty && userSnapshot.docs[0].data().IsBanned;
        return { id: doc.id, ...reportData, isBanned };
      }));

      // Sort reports by createdAt timestamp (most recent first)
      reportsList.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

      setReports(reportsList);
    } catch (error) {
      console.error('Error searching reports:', error);
      Alert.alert('Error', 'Failed to search reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (reportId, reportedUser) => {
    try {
      console.log(`Attempting to ban user: ${reportedUser}`);
      // First, find the user document using the Username
      const usersRef = collection(firestore, 'Users');
      let q = query(usersRef, where('Username', '==', reportedUser));
      let querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If not found by Username, try with User_UID
        q = query(usersRef, where('User_UID', '==', reportedUser));
        querySnapshot = await getDocs(q);
      }

      if (querySnapshot.empty) {
        console.log(`User not found: ${reportedUser}`);
        throw new Error('User not found');
      }

      const userDoc = querySnapshot.docs[0];
      console.log(`User document found for: ${reportedUser}`);

      // Update user's IsBanned field in Firestore
      await updateDoc(userDoc.ref, { IsBanned: true });
      console.log(`User banned: ${reportedUser}`);

      // Update report status
      const reportRef = doc(firestore, 'Reports', reportId);
      await updateDoc(reportRef, { status: 'resolved' });
      console.log(`Report ${reportId} status updated to resolved`);

      // Refresh reports list
      fetchReports();

      Alert.alert('User Banned', 'The user has been banned successfully.');
    } catch (error) {
      console.error('Error banning user: ', error);
      if (error.code === 'permission-denied') {
        Alert.alert('Permission Denied', 'You do not have the necessary permissions to ban users.');
      } else {
        Alert.alert('Error', `Failed to ban user: ${error.message}`);
      }
    }
  };

  const handleUnbanUser = async (reportId, reportedUser) => {
    try {
      console.log(`Attempting to unban user: ${reportedUser}`);
      const usersRef = collection(firestore, 'Users');
      let q = query(usersRef, where('Username', '==', reportedUser));
      let querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If not found by Username, try with User_UID
        q = query(usersRef, where('User_UID', '==', reportedUser));
        querySnapshot = await getDocs(q);
      }

      if (querySnapshot.empty) {
        console.log(`User not found: ${reportedUser}`);
        throw new Error('User not found');
      }

      const userDoc = querySnapshot.docs[0];
      console.log(`User document found for: ${reportedUser}`);

      // Update user's IsBanned field in Firestore
      await updateDoc(userDoc.ref, { IsBanned: false });
      console.log(`User unbanned: ${reportedUser}`);

      // Update report status
      const reportRef = doc(firestore, 'Reports', reportId);
      await updateDoc(reportRef, { status: 'resolved' });
      console.log(`Report ${reportId} status updated to resolved`);

      // Refresh reports list
      fetchReports();

      Alert.alert('User Unbanned', 'The user has been unbanned successfully.');
    } catch (error) {
      console.error('Error unbanning user: ', error);
      if (error.code === 'permission-denied') {
        Alert.alert('Permission Denied', 'You do not have the necessary permissions to unban users.');
      } else if (error.code === 'network-request-failed') {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', `Failed to unban user: ${error.message}`);
      }
    }
  };

  const fetchUserActivity = async (reportedUser) => {
    try {
      // Find the user document to get the username
      const usersRef = collection(firestore, 'Users');
      let userQuery = query(usersRef, where('User_UID', '==', reportedUser));
      let querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        userQuery = query(usersRef, where('Username', '==', reportedUser));
        querySnapshot = await getDocs(userQuery);
      }

      if (querySnapshot.empty) {
        console.log('User not found with given identifier:', reportedUser);
        throw new Error('User not found');
      }

      const userDoc = querySnapshot.docs[0];
      const username = userDoc.data().Username;
      const userUID = userDoc.data().User_UID;
      console.log('Found user:', username, 'UID:', userUID);

      const userActivity = { threads: [], posts: [] };

      // Fetch all threads created by the user using Collection Group Query
      const threadsQuery = query(
        collectionGroup(firestore, 'threads'),
        where('createdBy', '==', username)
      );
      const threadsSnapshot = await getDocs(threadsQuery);

      console.log(`Total user threads found: ${threadsSnapshot.size}`);

      threadsSnapshot.forEach((threadDoc) => {
        const threadPath = threadDoc.ref.path; // e.g., Forums/College A/subgroups/Subgroup 1/threads/Thread 1
        const pathSegments = threadPath.split('/');

        // Extract collegeName and subgroupName from the path
        // Ensure the path has the expected structure
        if (pathSegments.length >= 6) {
          const collegeName = pathSegments[1];
          const subgroupName = pathSegments[3];

          userActivity.threads.push({
            id: threadDoc.id,
            collegeName,
            subgroupName,
            ...threadDoc.data(),
          });
        } else {
          console.warn(`Unexpected thread path structure: ${threadPath}`);
        }
      });

      // Fetch all posts created by the user using Collection Group Query
      const postsQuery = query(
        collectionGroup(firestore, 'posts'),
        where('createdBy', '==', username)
      );
      const postsSnapshot = await getDocs(postsQuery);

      console.log(`Total user posts found: ${postsSnapshot.size}`);

      postsSnapshot.forEach((postDoc) => {
        const postPath = postDoc.ref.path; // e.g., Forums/College A/subgroups/Subgroup 1/threads/Thread 1/posts/Post 1
        const pathSegments = postPath.split('/');

        if (pathSegments.length >= 8) {
          const collegeName = pathSegments[1];
          const subgroupName = pathSegments[3];
          const threadId = pathSegments[5];

          userActivity.posts.push({
            id: postDoc.id,
            threadId,
            collegeName,
            subgroupName,
            ...postDoc.data(),
          });
        } else {
          console.warn(`Unexpected post path structure: ${postPath}`);
        }
      });

      console.log('User Activity:', JSON.stringify(userActivity, null, 2));
      return userActivity;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      if (error.code === 'network-request-failed') {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', `Failed to fetch user activity: ${error.message}`);
      }
      return null;
    }
  };

  const handleViewUserActivity = async (reportedUser) => {
    setIsLoading(true);
    try {
      const userActivity = await fetchUserActivity(reportedUser);
      if (userActivity) {
        navigation.navigate('UserActivityScreen', { userActivity, reportedUser });
      }
      // No else needed as fetchUserActivity already handles the alert
    } catch (error) {
      // Additional catch in case fetchUserActivity throws
      console.error('Error in handleViewUserActivity:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.reportItem}>
      <Text>Reported User: {item.reportedUser}</Text>
      <Text>Reported By: {item.reportedBy}</Text>
      <Text>Created At: {item.createdAt.toDate().toLocaleString()}</Text>
      <Button
        title={item.isBanned ? "Unban User" : "Ban User"}
        onPress={() => item.isBanned ? handleUnbanUser(item.id, item.reportedUser) : handleBanUser(item.id, item.reportedUser)}
      />
      <Button
        title="View User Activity"
        onPress={() => handleViewUserActivity(item.reportedUser)}
        disabled={isLoading} // Prevent multiple taps
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Reports</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by reported user UID"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={item => item.id}
        />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  reportItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default ModeratorScreen;
