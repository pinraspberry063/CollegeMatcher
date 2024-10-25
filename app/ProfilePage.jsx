// This will be where the Profile Page is created.

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);
const { width, height } = Dimensions.get('window');

const ProfilePage = ({ navigation }) => {

    const { user } = useContext(UserContext);
    const [userName, setUsername] = useState('');
    const [Email, setUserEmail] = useState('');
    const userNames = collection(firestore,'Users');

    const fetchUserdata = async (uid) => {
                   try {
                     const usersRef = collection(firestore, 'Users');
                     const q = query(usersRef, where('User_UID', '==', uid));
                     const querySnapshot = await getDocs(q);
                     if (!querySnapshot.empty) {
                       const userDoc = querySnapshot.docs[0];
                       const userData = userDoc.data();
                       setUsername(userData.Username);
                       setUserEmail(userData.Email)
                     } else {
                       console.error('No user found with the given UID.');
                     }
                   } catch (error) {
                     console.error('Error fetching username and recruiter status:', error);
                   }
                 };
             fetchUserdata(auth().currentUser.uid);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text styles={styles.buttonText}>
                    User Profile Page
                </Text>
                <Text styles={styles.buttonText}>
                    Username: {userName}
                </Text>
                <Text styles={styles.smallerText}>
                    Account Creation:
                </Text>
                <Text styles={styles.smallerText}>
                    Name:
                </Text>
                <Text styles={styles.smallerText}>
                    Contact info: {Email}
                </Text>
                <Text styles={styles.smallerText}>
                    Status:
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04, // Dynamic padding based on screen width
    backgroundColor: '#000',
  },
  buttonText: {
    fontSize: height * 0.04, // Dynamic font size for larger text
    fontWeight: 'bold',
    marginBottom: height * 0.02, // Dynamic margin bottom
    color: '#fff',
  },
  smallerText: {
    fontSize: height * 0.025, // Dynamic font size for smaller text
    marginBottom: height * 0.02, // Dynamic margin between text fields
    color: '#fff',
  },
  input: {
    height: height * 0.06, // Dynamic height for input fields
    borderColor: '#000',
    borderWidth: 1,
    paddingHorizontal: width * 0.03, // Dynamic padding inside text box
    backgroundColor: '#666', // Gray background for input boxes
    color: '#fff',
    borderRadius: 5,
  },
});

export default ProfilePage;
