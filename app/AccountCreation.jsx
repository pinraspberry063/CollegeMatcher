import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import themeContext from '../theme/themeContext'
import { db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, doc, setDoc , getFirestore, query, where} from 'firebase/firestore';
import { Dropdown } from 'react-native-element-dropdown';

const firestore = getFirestore(db);

const AccountCreation = ({ navigation}) => {
  const theme = useContext(themeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(email);
  const [accountType, setAccountType] = useState('student');
  const [recruiter, setRecruiter] = useState(false);


  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    const isRecruiter = (accountType=='recruiter');
    setRecruiter(isRecruiter);
  }
  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password.');
      return;
    }

    const userData = {
      IsRecruiter: (accountType=='recruiter')? true: false,
      User_UID: auth().currentUser.uid,
      Username: username
    }
    const addUserToDatabase = () => {
      const usersRef = collection(firestore, 'Users');
          usersRef.addDoc(userData)
    }

    setLoading(true);
    auth().createUserWithEmailAndPassword(email, password)
        .then(()=> {
          setLoading(false);
          Alert.alert('Account Created');
          addUserToDatabase
          navigation.navigate('Main');
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert('Account Creation Failed', error.message);
        })
        

  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: theme.color }]}>Create Account</Text>
      <TextInput
        style={[styles.input, {borderColor: theme.color,color: theme.color }]}
        placeholder="Username"
        placeholderTextColor={theme.color}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, {borderColor: theme.color,color: theme.color }]}
        placeholder="Email"
        placeholderTextColor={theme.color}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, {borderColor: theme.color, color: theme.color}]}
        placeholder="Password"
        placeholderTextColor={theme.color}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Dropdown
        placeholder="account type"
        labelField="label"
        valueField="value"
        value={accountType}
        onChange={handleAccountTypeChange}
        data={[
          {label: 'Student', value: 'student'},
          {label: 'Recruiter', value: 'recruiter'},
          {label: 'Alumni', value: 'alumni'}
        ]}
      />
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
});

export default AccountCreation;
