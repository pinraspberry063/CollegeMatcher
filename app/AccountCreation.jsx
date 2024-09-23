import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Switch } from 'react-native';
import auth from '@react-native-firebase/auth';
import themeContext from '../theme/themeContext';
import { UserContext } from '../components/UserContext';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const firestore = getFirestore(db);

const AccountCreation = ({ navigation }) => {
  const theme = useContext(themeContext);
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false); // State for the Switch
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert('Input Error', 'Please enter both email and password as well as your first and last name.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      setUser(user); // Set the logged in user in context

      console.log('User created:', user.uid);

      // Add user to Firestore with email included
      await setDoc(doc(firestore, 'Users', user.uid), {
        User_UID: user.uid,
        IsRecruiter: isRecruiter,
        SuperRecruiter: false,
        RecruiterInstitution: 'NA',
        Username: username,
        IsModerator: false,
        IsBanned: false,
        Email: email,
        mfaEnabled: isMfaEnabled,
        phoneNumber: '',
      });

      console.log('User document created in Firestore');

      Alert.alert('Account Created Successfully');

      // Navigation logic
      console.log('isRecruiter:', isRecruiter);
      console.log('isMfaEnabled:', isMfaEnabled);

      if (isRecruiter) {
        console.log('Navigating to RecruiterVerification');
        navigation.navigate('RecruiterVerification');
      } else if (isMfaEnabled) {
        console.log('Navigating to MFAScreen');
        navigation.navigate('MFAScreen');
      } else {
        console.log('Navigating to Main screen');
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Account Creation Error:', error);
      Alert.alert('Account Creation Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

   return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.color }]}>Create Account</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.color, color: theme.color }]}
          placeholder="Email"
          placeholderTextColor={theme.color}
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
          placeholder="First and Last name"
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
      borderColor: 'gray',
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
