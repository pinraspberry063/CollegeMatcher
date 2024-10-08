import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
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
      Alert.alert('Error', 'Failed to ban user. Please try again.');
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
      Alert.alert('Error', 'Failed to unban user. Please try again.');
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
      <Text>Reason: {item.reason}</Text>
      <Button
        title={item.isBanned ? "Unban User" : "Ban User"}
        onPress={() => item.isBanned ? handleUnbanUser(item.id, item.reportedUser) : handleBanUser(item.id, item.reportedUser)}
      />
      <Button title="View User Activity" onPress={() => handleViewUserActivity(item.reportedUser)} />
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