import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const PhoneVerification = ({ route, navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { verificationId } = route.params;

  const handleVerification = async () => {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await auth().signInWithCredential(credential);
      Alert.alert('Verification Successful');
      // The App.jsx will automatically navigate to the main screen when the user is authenticated
    } catch (error) {
      Alert.alert('Verification Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
      />
      <Button title="Verify" onPress={handleVerification} />
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
});

export default PhoneVerification;