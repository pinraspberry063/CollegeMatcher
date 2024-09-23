import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { getFirestore } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);

const UsernamePrompt = ({ navigation, route }) => {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const { user } = route.params;

  const handleSetUsername = async () => {
    if (!username) {
      Alert.alert('Input Error', 'Please enter a username.');
      return;
    }

    try {
      // Create user document in Firestore
      await setDoc(doc(firestore, 'Users', user.uid), {
        User_UID: user.uid,
        Username: username,
        Email: user.email,
        IsRecruiter: false,
        SuperRecruiter: false,
        RecruiterInstitution: 'NA',
        mfaEnabled: false,
        phoneNumber: '',
      });

      // Update user context
      setUser(user);

      Alert.alert('Success', 'Username set successfully.');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error setting username:', error);
      Alert.alert('Error', 'Failed to set username.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Continue" onPress={handleSetUsername} />
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

export default UsernamePrompt;