import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {db} from '../../config/firebaseConfig';
import auth from '@react-native-firebase/auth';

const firestore = getFirestore(db);

export const handleReport = async reportData => {
  try {
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
    };

    await addDoc(reportRef, report);
    console.log('Report submitted successfully');
    return true;
  } catch (error) {
    console.error('Error submitting report: ', error);
    return false;
  }
};
