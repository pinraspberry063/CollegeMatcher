import React, { createContext, useState, useEffect, useMemo} from 'react';
import {db} from '../config/firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { ActivityIndicator, View } from 'react-native';


export const CollegesContext = createContext();

const firestore = getFirestore(db);
const collegeRef = collection(firestore, 'CompleteColleges'); // Initialize Firestore


export const CollegesProvider = ({ children }) => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const snapshot = await getDocs(collegeRef);
        const collegesList = snapshot.docs.map(doc => doc.data());
        setColleges(collegesList);
        setLoading(false); // Data is now ready
      } catch (error) {
        console.error('Error fetching colleges: ', error);
      }
    };

    fetchColleges(); // Fetch colleges in the background when the app starts
  }, []);

  return (
    <CollegesContext.Provider value={useMemo(() => ({ colleges, loading }), [colleges, loading])}>
       {loading ? (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={100} /> 
      </View>
    ) : (
      children
    )}
    </CollegesContext.Provider>
  );
};
