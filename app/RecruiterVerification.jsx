import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Dimensions } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';
import { db } from '../config/firebaseConfig';

const firestore = getFirestore(db);
const { width, height } = Dimensions.get('window');

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
        RecruiterUID: user.uid,
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
        style={styles.input}
        placeholder="Your Full Name"
        placeholderTextColor="#fff"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Institutional Email"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="School Name"
        placeholderTextColor="#fff"
        value={schoolName}
        onChangeText={setSchoolName}
      />

      <TextInput
        style={styles.input}
        placeholder="LinkedIn Profile URL"
        placeholderTextColor="#fff"
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
    paddingHorizontal: width * 0.05, // Scaled horizontal padding
    paddingTop: height * 0.03, // Scaled top padding
    backgroundColor: '#000',
  },
  title: {
    fontSize: height * 0.035, // Scaled font size for title
    marginBottom: height * 0.03, // Scaled margin for title
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: height * 0.06, // Scaled input height
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: height * 0.02, // Scaled margin for input
    padding: height * 0.015, // Scaled padding for input
    color: '#fff',
    backgroundColor: '#444',
    borderRadius: 8, // Rounded corners
  },
});

export default RecruiterVerification;
