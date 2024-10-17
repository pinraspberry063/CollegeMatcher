import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const EmailVerificationPrompt = ({ navigation, route }) => {
  const { isMfaEnabled, isRecruiter } = route.params || {};

  const checkEmailVerified = async () => {
    try {
      await auth().currentUser.reload();
      const user = auth().currentUser;
      if (user.emailVerified) {
        // Proceed based on user preferences
        proceedAfterVerification();
      } else {
        Alert.alert('Email Not Verified', 'Please verify your email before proceeding.');
      }
    } catch (error) {
      console.error('Error checking email verification status:', error);
      Alert.alert('Error', 'Failed to verify email status. Please try again.');
    }
  };

  const proceedAfterVerification = () => {
    if (route.params.nextScreen === 'MFAScreen') {
      navigation.navigate('MFAScreen', {
        nextScreen: isRecruiter ? 'RecruiterVerification' : 'Main',
        ...route.params
      });
    } else {
      navigation.navigate(route.params.nextScreen);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      await auth().currentUser.sendEmailVerification();
      Alert.alert('Verification Email Sent', 'Please check your email.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      if (error.code === 'auth/too-many-requests') {
        Alert.alert('Too Many Requests', 'You have requested verification emails too frequently. Please try again later.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid Email', 'The email address is invalid. Please check and try again.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('User Not Found', 'No user found with this email.');
      } else {
        Alert.alert('Error', 'Failed to send verification email. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.message}>
        We've sent a verification link to your email address. Please verify your email to continue.
      </Text>
      <Button title="Continue" onPress={checkEmailVerified} />
      <Button title="Resend Verification Email" onPress={resendVerificationEmail} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default EmailVerificationPrompt;
