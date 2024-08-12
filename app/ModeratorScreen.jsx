import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const firestore = getFirestore(db);

const ModeratorScreen = () => {
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

  const handleBanUser = async (reportId, userId) => {
    try {
      // Update user's status in Firestore
      const userRef = doc(firestore, 'Users', userId);
      await updateDoc(userRef, { status: 'banned' });

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

  const renderReportItem = ({ item }) => (
    <View style={styles.reportItem}>
      <Text>Reported User: {item.reportedUser}</Text>
      <Text>Reported By: {item.reportedBy}</Text>
      <Text>Created At: {item.createdAt.toDate().toLocaleString()}</Text>
      <Button title="Ban User" onPress={() => handleBanUser(item.id, item.reportedUser)} />
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