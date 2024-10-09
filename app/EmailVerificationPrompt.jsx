import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const EmailVerificationPrompt = ({ navigation, route }) => {
  const { isMfaEnabled, isRecruiter } = route.params || {};

  const checkEmailVerified = async () => {
    await auth().currentUser.reload();
    const user = auth().currentUser;
    if (user.emailVerified) {
      // Proceed based on user preferences
      proceedAfterVerification();
    } else {
      Alert.alert('Email Not Verified', 'Please verify your email before proceeding.');
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
      Alert.alert('Error', error.message);
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


