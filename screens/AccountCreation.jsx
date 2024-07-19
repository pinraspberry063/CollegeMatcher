import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { db } from '../config/firebase.js';
import themeContext from '../theme/themeContext'

const AccountCreation = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    db.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setLoading(false);
        Alert.alert('Account Created');
        navigation.push('Home');
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Account Creation Failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: theme.color }]}>Create Account</Text>
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
