import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import auth from '@react-native-firebase/auth';

const firestore = getFirestore(db);

export const handleReport = async (reportData) => {
  try {
    const reportRef = collection(firestore, 'Reports');
    const currentUser = auth().currentUser;

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const report = {
      ...reportData,
      reportedBy: currentUser.uid,
      createdAt: Timestamp.now(),
      status: 'pending'
    };

    await addDoc(reportRef, report);
    console.log('Report submitted successfully');
    return true;
  } catch (error) {
    console.error('Error submitting report: ', error);
    return false;
  }
};