// This will be where the Profile Page is created.

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove, doc, query, where, getFirestore, Timestamp } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);

const ProfilePage = ({ navigation }) => {

    const { user } = useContext(UserContext);
    const theme = useContext(themeContext);



    return (
        <SafeAreaView>
            <ScrollView>
                <Text styles={styles.buttonText}>
                    "User Profile Page"
                </Text>
                <Text styles={styles.buttonText}>
                    This is where the Username will go.
                </Text>
                <Text styles={styles.smallerText}>
                    Account Creation:
                </Text>
                <Text styles={styles.smallerText}>
                    Name:
                </Text>
                <Text styles={styles.smallerText}>
                    Contact info:
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
    padding: 16,
  },
  buttonContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  smallerText: {
      fontSize: 14,
      color: '#0000000'
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
