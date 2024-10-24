import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { doc, setDoc, writeBatch, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { UserContext } from '../components/UserContext';
import themeContext from '../theme/themeContext';
import auth from '@react-native-firebase/auth';

const firestore = getFirestore(db);

const UsernamePrompt = ({ navigation, route }) => {
  const theme = useContext(themeContext);
  const { user } = route.params; // Authenticated user
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUsernameSubmit = async () => {
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedUsername) {
      Alert.alert('Input Error', 'Please enter a username.');
      return;
    }

    setLoading(true);
    try {
      // Reference to the desired username document
      const usernameRef = doc(firestore, 'Usernames', trimmedUsername);
      // Reference to the user document
      const userDocRef = doc(firestore, 'Users', user.uid);

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

      // Create a new batch to set user data and update username with actual UID
      const userBatch = writeBatch(firestore);
      userBatch.set(userDocRef, {
        Username: trimmedUsername,
        // Add other necessary fields or merge with existing data
      }, { merge: true });
      userBatch.update(usernameRef, { uid: user.uid });

      // Commit the user batch
      await userBatch.commit();

      // Send email verification if not already sent
      if (!user.emailVerified) {
        await user.sendEmailVerification();
        Alert.alert('Verification Required', 'Please verify your email before proceeding.');
        navigation.navigate('EmailVerificationPrompt');
        return;
      }

      Alert.alert('Username Set', 'Your username has been successfully set.');

      // Navigate to main app
      setUser(user);
      navigation.navigate('Main');
    } catch (error) {
      if (error.code === 'permission-denied' || error.message === 'UsernameUnavailable') {
        Alert.alert('Username Unavailable', 'The username you selected is already taken. Please choose a different one.');
      } else {
        console.error('Username Submission Error:', error);
        Alert.alert('Error', 'Failed to set username. Please try again.');
      }
      // Optional: Delete the Auth account if Firestore operations fail post-authentication
      // await auth().currentUser?.delete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.color }]}>Choose a Username</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.color, color: theme.color }]}
        placeholder="Username"
        placeholderTextColor={theme.color}
        value={username}
        onChangeText={setUsername}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit" onPress={handleUsernameSubmit} />
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

export default UsernamePrompt;