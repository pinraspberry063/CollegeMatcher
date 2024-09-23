import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import themeContext from '../theme/themeContext';

const MFAScreen = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore(db);

  const handleSendVerificationCode = async () => {
    // Input validation for phone number
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number with country code.');
      return;
    }
    try {
      setLoading(true);
      const confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmationResult);
      setVerificationSent(true);
      Alert.alert('Verification Code Sent', 'Please enter the code sent to your phone.');
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Input Error', 'Please enter the verification code.');
      return;
    }
    try {
      setLoading(true);
      const credential = auth.PhoneAuthProvider.credential(
        confirmation.verificationId,
        verificationCode
      );

      const currentUser = auth().currentUser;
      const providers = currentUser.providerData.map(provider => provider.providerId);

      if (providers.includes(auth.PhoneAuthProvider.PROVIDER_ID)) {
        // Phone provider is already linked
        // Reauthenticate the user with the phone credential
        await currentUser.reauthenticateWithCredential(credential);
      } else {
        // Link the phone credential to the user
        await currentUser.linkWithCredential(credential);
      }

      // Update user's MFA status in Firestore
      const uid = currentUser.uid;
      await updateDoc(doc(firestore, 'Users', uid), {
        mfaEnabled: true,
        phoneNumber: phoneNumber,
      });

      Alert.alert('Success', 'Multi-Factor Authentication has been enabled.');
      // Navigate to the main app screen
      navigation.navigate('Main');
    } catch (error) {
      console.error('Verification Error:', error);
      Alert.alert('Verification Failed', 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.color }]}>
        Set Up Multi-Factor Authentication
      </Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {!verificationSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Button title="Send Verification Code" onPress={handleSendVerificationCode} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
          />
          <Button title="Verify Code" onPress={handleVerifyCode} />
          <Button title="Resend Code" onPress={handleSendVerificationCode} />
        </>
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
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
});

export default MFAScreen;