import React, { createContext, useState, useEffect } from 'react';
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
    <CollegesContext.Provider value={{ colleges, loading }}>
      {children}
    </CollegesContext.Provider>
  );
};
