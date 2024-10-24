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
import { ActivityIndicator, View , NativeModules} from 'react-native';
// const {CollegeModule} = NativeModules;

export const CollegesContext = createContext();

const firestore = getFirestore(db);
const collegeRef = collection(firestore, 'CompleteColleges'); // Initialize Firestore


export const CollegesProvider = ({ children }) => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);


  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       // Fetch colleges using a promise-based approach
  //       const fetchedColleges = await CollegeModule.fetchColleges();
  //       setColleges(fetchedColleges); // Update state with the fetched data
  //       setLoading(false); // Data is now ready
  //     } catch (error) {
  //       console.error('Error fetching colleges: ', error);
  //     }
  //   };
  
  //   // Set the Firestore instance configuration
  //   CollegeModule.setConfig(firestore);
  //   loadData(); // Fetch colleges in the background when the app starts
  // }, []);
  
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
