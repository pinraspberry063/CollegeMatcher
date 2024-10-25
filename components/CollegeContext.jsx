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
import { useQuery } from '@tanstack/react-query';
// const {CollegeModule} = NativeModules;

export const CollegesContext = createContext();

const firestore = getFirestore(db);
const collegeRef = collection(firestore, 'CompleteColleges'); // Initialize Firestore

const fetchAllColleges = async () => {
  const snapshot = await getDocs(collection(firestore, 'CompleteColleges'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

};
export const CollegesProvider = ({ children, colleges }) => {
  // const [colleges, setColleges] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // // Prefetch the colleges when the app starts
  // useEffect(() => {
  //   const fetchColleges = async () => {
  //     const collegesData = await queryClient.fetchQuery({
  //       queryKey: ['colleges'],
  //       queryFn: fetchAllColleges, // Your function to fetch colleges
  //     });
  //     setColleges(collegesData); // Save the fetched data in state
  //   };
    
  //   fetchColleges();
  // }, []);
  // useEffect(()=>{

  //   if (collegesData) {
  //     setColleges(collegesData);
  //   }
  //   setIsLoading(queryLoading);
  // }, [collegesData, queryLoading]);

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
  

  return (
    
      <CollegesContext.Provider value={useMemo(() => ({ colleges }), [colleges])}>
        {/* {isLoading ? (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={100} /> 
        </View>
      ) : (
        children
      )} */}
      {children}
      </CollegesContext.Provider>
  );
};
