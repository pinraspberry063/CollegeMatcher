import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { UserContext } from '../components/UserContext';
import { doc, writeBatch, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const firestore = getFirestore(db);

const PhoneVerification = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const signInWithPhoneNumber = async () => {
    if (!phoneNumber) {
      Alert.alert('Input Error', 'Please enter your phone number.');
      return;
    }

    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert('Verification Sent', 'Please check your phone for the verification code.');
    } catch (error) {
      console.error('Phone Sign-In Error:', error);
      Alert.alert('Error', 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    if (!verificationCode) {
      Alert.alert('Input Error', 'Please enter the verification code.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await confirm.confirm(verificationCode);
      const user = userCredential.user;
      setUser(user); // Set the logged-in user in context

      // Check if user document exists
      const userDocRef = doc(firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Navigate to UsernamePrompt to set up the user document
        navigation.navigate('UsernamePrompt', { user });
      } else {
        // User document exists, navigate to main app
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Code Confirmation Error:', error);
      Alert.alert('Error', 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!confirm ? (
        <>
          <Text style={styles.title}>Phone Verification</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={'grey'}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Send Verification Code" onPress={signInWithPhoneNumber} />
          )}
        </>
      ) : (
        <>
          <Text style={styles.title}>Enter Verification Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            placeholderTextColor={'grey'}
            keyboardType="number-pad"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Confirm Code" onPress={confirmCode} />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
});

export default PhoneVerification;
