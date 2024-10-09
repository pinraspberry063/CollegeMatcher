import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';

const firestore = getFirestore(db);
const collegeRef = collection(firestore, 'CompleteColleges');



const college_data = async() => {
    const colleges = await getDocs(collegeRef);

    return colleges

}


export default college_data

