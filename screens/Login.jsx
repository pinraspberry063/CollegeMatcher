import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import themeContext from '../theme/themeContext'

const MAX_ATTEMPTS = 5;

const Login = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password.');
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
       setIsLocked(true); // Lock the user out
       //Alert.alert('Account Locked', 'You have reached the maximum number of login attempts. Please contact support.');
       return;
     }

    setLoading(true);
    auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setLoading(false);
        setAttempts(0); // Reset attempts on successful login
        Alert.alert('Login Successful');
        navigation.navigate('Home');
      })
      .catch((error) => {
        setLoading(false);
        setAttempts(attempts + 1);
        Alert.alert('Login Failed', error.message);
      });
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Input Error', 'Please enter your email address to reset your password.');
      return;
    }

    auth().sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Password Reset', 'A password reset email has been sent to your email address.');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: theme.color}]}>Login</Text>
      <TextInput
        style={[styles.input, {borderColor: theme.color, color: theme.color}]}
        placeholder="Email"
        placeholderTextColor={theme.color}
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput, {borderColor: theme.color, color: theme.color}]}
          placeholder="Password"
          placeholderTextColor={theme.color}
          secureTextEntry={!showPassword}
          value={password}
          
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.toggleButton}
        >
          <Text style={{color: theme.color}}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Login" onPress={handleLogin} disabled={isLocked} />
          <Button title="Forgot Password" onPress={handleForgotPassword} />
        </>
      )}
      {isLocked && (
        <Text style={styles.lockedText}>Your account is locked due to too many failed login attempts.</Text>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  toggleButton: {
    marginLeft: 8,
    padding: 10,
  },
  lockedText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Login;
