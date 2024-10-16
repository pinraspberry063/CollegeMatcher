// This will be where the Profile Page is created.

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove, doc, query, where, getFirestore, Timestamp } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);

const ProfilePage = ({ navigation }) => {

    const { user } = useContext(UserContext);
    const theme = useContext(themeContext);
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
                <Text style={styles.buttonText}>
                    User Profile Page
                </Text>
                <Text style={styles.buttonText}>
                    Username: {userName}
                </Text>
                <Text style={styles.smallerText}>
                    Account Creation:
                </Text>
                <Text style={styles.smallerText}>
                    Name:
                </Text>
                <Text style={styles.smallerText}>
                    Contact info: {Email}
                </Text>
                <Text style={styles.smallerText}>
                    Status:
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    fontSize: 24,
    color: '#FFFFFFF',
  },
  buttonContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFFF',
  },
  smallerText: {
      fontSize: 20,
      color: '#FFFFFFF'
  },
  buttonSubText: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recruiterHighlight: {
    color: '#ff9900', // Highlight color for recruiters
    fontWeight: 'bold',
  },
});

export default ProfilePage;
