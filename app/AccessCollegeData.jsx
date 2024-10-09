import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const firestore = getFirestore(db);

export const fetchColleges = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'CompleteColleges'));
    const collegesData = querySnapshot.docs.map(doc => doc.data());
    return collegesData;
};
