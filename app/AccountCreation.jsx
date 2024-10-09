import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Switch } from 'react-native';
import auth from '@react-native-firebase/auth';
import themeContext from '../theme/themeContext';
import { UserContext } from '../components/UserContext';
import { doc, setDoc, writeBatch, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const firestore = getFirestore(db);

const AccountCreation = ({ navigation }) => {
  const theme = useContext(themeContext);
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !username || !confirmPassword) {
      Alert.alert('Input Error', 'Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Normalize Username (e.g., convert to lowercase)
      const normalizedUsername = username.trim().toLowerCase();

      // Reference to the desired username document
      const usernameRef = doc(firestore, 'Usernames', normalizedUsername);

      // Check if the username already exists
      const usernameDoc = await getDoc(usernameRef);
      if (usernameDoc.exists()) {
        Alert.alert('Username Unavailable', 'The username you selected is already taken. Please choose a different one.');
        setLoading(false);
        return;
      }

      // Initialize batch for reserving username
      const batch = writeBatch(firestore);
      batch.set(usernameRef, { uid: 'temp' }, { merge: false });

      // Commit the batch to reserve the username
      await batch.commit();

      // Create user authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      setUser(user); // Set the logged-in user in context

      // Initialize a new batch to create the user document and update username
      const userBatch = writeBatch(firestore);

      // Set user data in Users collection
      const userDocRef = doc(firestore, 'Users', user.uid);
      userBatch.set(userDocRef, {
        User_UID: user.uid,
        IsRecruiter: isRecruiter,
        SuperRecruiter: false,
        RecruiterInstitution: 'NA',
        Username: normalizedUsername,
        Email: email,
        mfaEnabled: isMfaEnabled,
        phoneNumber: '',
        IsModerator: false,
      });

      // Update the 'Usernames' document with the actual UID
      userBatch.update(usernameRef, { uid: user.uid });

      // Commit the user batch
      await userBatch.commit();

      // Send email verification
      await user.sendEmailVerification();
      Alert.alert('Account Created', 'Please verify your email before proceeding.');

      // Navigate to Email Verification Prompt
      navigation.navigate('EmailVerificationPrompt', {
        isMfaEnabled,
        isRecruiter,
        nextScreen: isMfaEnabled ? 'MFAScreen' : determineNextScreen(),
      });
    } catch (error) {
      console.error('Account Creation Error:', error);

      // Handle Firestore Permission Denied Error
      if (error.code === 'permission-denied') {
        Alert.alert('Username Unavailable', 'The username you selected is already taken. Please choose a different one.');
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Email In Use', 'The email address is already in use by another account.');
      } else {
        Alert.alert('Account Creation Failed', error.message);
      }

      // Optional Cleanup: Delete the Auth account if Firestore operations fail after authentication
      if (error.code !== 'permission-denied' && auth().currentUser) {
        await auth().currentUser.delete();
      }
    } finally {
      setLoading(false);
    }
  };

  const determineNextScreen = () => {
    if (isMfaEnabled) {
      return isRecruiter ? 'RecruiterVerification' : 'Main';
    } else if (isRecruiter) {
      return 'RecruiterVerification';
    } else {
      return 'Main';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.color }]}>Create Account</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.color, color: theme.color }]}
        placeholder="Email"
        placeholderTextColor={theme.color}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.color, color: theme.color }]}
        placeholder="Password"
        placeholderTextColor={theme.color}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.color, color: theme.color }]}
        placeholder="Confirm Password"
        placeholderTextColor={theme.color}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.color, color: theme.color }]}
        placeholder="Username"
        placeholderTextColor={theme.color}
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: theme.color }]}>
          Enable Multi-Factor Authentication (MFA)
        </Text>
        <Switch
          value={isMfaEnabled}
          onValueChange={setIsMfaEnabled}
          trackColor={{ false: '#767577', true: theme.buttonColor }}
          thumbColor={isMfaEnabled ? theme.buttonColor : '#f4f3f4'}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: theme.color }]}>I am a recruiter</Text>
        <Switch
          value={isRecruiter}
          onValueChange={setIsRecruiter}
          trackColor={{ false: '#767577', true: theme.buttonColor }}
          thumbColor={isRecruiter ? theme.buttonColor : '#f4f3f4'}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Sign Up" onPress={handleSignUp} />
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
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
  },
});

export default AccountCreation;