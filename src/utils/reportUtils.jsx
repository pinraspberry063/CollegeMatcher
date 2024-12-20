import { getFirestore, collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const firestore = getFirestore(db);

export const handleReport = async (reportData) => {
  try {
    console.log('Received report data:', reportData);
    // Input Validation
    if (!reportData.reportedUser || !reportData.reason) {
      console.log('Missing fields - reportedUser:', !reportData.reportedUser, 'reason:', !reportData.reason); // Add this
      throw new Error('Incomplete report data');
    }

    const reportRef = collection(firestore, 'Reports');
    const currentUser = auth().currentUser;

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Fetch the reported user's User_UID
    const usersRef = collection(firestore, 'Users');
    const q = query(usersRef, where('Username', '==', reportData.reportedUser));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Reported user not found');
    }

    const reportedUserDoc = querySnapshot.docs[0];
    const reportedUserUID = reportedUserDoc.data().User_UID;

    const report = {
      ...reportData,
      reportedUser: reportedUserUID,
      reportedBy: currentUser.uid,
      createdAt: Timestamp.now(),
      status: 'pending',
      reason: reportData.reason
    };

    await addDoc(reportRef, report);
    console.log('Report submitted successfully');
    return true;
  } catch (error) {
    console.error('Error submitting report: ', error);
    if (error.message === 'Incomplete report data') {
      Alert.alert('Input Error', 'Please provide all required information for the report.');
    } else if (error.message === 'Reported user not found') {
      Alert.alert('Error', 'The user you are trying to report does not exist.');
    } else {
      return false;
    }
    return false;
  }
};
