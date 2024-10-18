import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Dimensions } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';  // Import Firestore functions
import { UserContext } from '../components/UserContext';  // Import the UserContext to get the UID
import { db } from '../config/firebaseConfig';  // Import your Firebase configuration

const firestore = getFirestore(db);  // Initialize Firestore
const { width, height } = Dimensions.get('window'); // Get device dimensions

const RecruiterVerification = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');  // New state for the school name
  const [linkedIn, setLinkedIn] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);  // Access the current user from context

  const handleVerification = async () => {
    if (!email || !name || !schoolName || !linkedIn) {
      Alert.alert('Input Error', 'Please fill out all required fields.');
      return;
    }

    if (!user || !user.uid) {
      Alert.alert('Error', 'User is not logged in.');
      return;
    }

    setLoading(true);

    try {
      // Add a new document to the "VerificationRequired" collection
      await addDoc(collection(firestore, 'VerificationRequired'), {
        DOA: serverTimestamp(),  // Timestamp of when the request is made
        RecruiterFirstAndLastName: name,  // Recruiter's full name
        RecruiterInst: email,  // Recruiter's institutional email
        RecruiterSchoolName: schoolName,  // Name of the school the recruiter works for
        RecruiterLinkN: linkedIn,  // Recruiter's LinkedIn profile link
        RecruiterUID: user.uid,  // Use the UID from context
      });

      setLoading(false);
      Alert.alert('Verification Submitted', 'Your verification request has been submitted.');
      navigation.navigate('Main');  // Navigate to the main screen after submission
    } catch (error) {
      setLoading(false);
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recruiter Verification</Text>

      <TextInput
        style={[styles.input, {color:'#fff'}]}
        placeholder="Your Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, {color:'#fff'}]}
        placeholder="Institutional Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, {color:'#fff'}]}
        placeholder="School Name"
        value={schoolName}
        onChangeText={setSchoolName}  // New input for the school name
      />

      <TextInput
        style={[styles.input, {color:'#fff'}]}
        placeholder="LinkedIn Profile URL"
        value={linkedIn}
        onChangeText={setLinkedIn}
      />

      {loading ? (
        <Button title="Submitting..." disabled />
      ) : (
        <Button title="Submit for Verification" onPress={handleVerification} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
});

export default RecruiterVerification;
