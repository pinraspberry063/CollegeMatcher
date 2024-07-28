import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { TwitterAuthProvider } from '@react-native-firebase/auth';
import themeContext from '../theme/themeContext';

const MAX_ATTEMPTS = 5;

const Login = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '927238517919-18hao19445rig737pl1hdbico3qttmhv.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    FacebookSDK.initializeAsync();
  }, []);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password.');
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      setIsLocked(true);
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
      setAttempts(0);
      Alert.alert('Login Successful');
      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      setAttempts(attempts + 1);
      Alert.alert('Login Failed', error.message);
    }
  };

  const handlePhoneLogin = async () => {
    if (!phoneNumber) {
      Alert.alert('Input Error', 'Please enter a phone number.');
      return;
    }

    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setLoading(false);
      navigation.navigate('PhoneVerification', { confirmation });
    } catch (error) {
      setLoading(false);
      Alert.alert('Phone Login Failed', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log('User signed in successfully:', userCredential.user.displayName);
      Alert.alert('Google Login Successful');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Google Login Failed', error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      await auth().signInWithCredential(facebookCredential);
      Alert.alert('Facebook Login Successful');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Facebook Login Failed', error.message);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      const { authToken, authTokenSecret } = await TwitterAuthProvider.getCredential();
      const twitterCredential = auth.TwitterAuthProvider.credential(authToken, authTokenSecret);
      await auth().signInWithCredential(twitterCredential);
      Alert.alert('Twitter Login Successful');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Twitter Login Failed', error.message);
    }
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
      <TextInput
        style={[styles.input, {borderColor: theme.color, color: theme.color}]}
        placeholder="Phone Number"
        placeholderTextColor={theme.color}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Login with Email" onPress={handleEmailLogin} disabled={isLocked} />
          <Button title="Login with Phone" onPress={handlePhoneLogin} />
          <Button title="Login with Google" onPress={handleGoogleLogin} />
          <Button title="Login with Facebook" onPress={handleFacebookLogin} />
          <Button title="Login with Twitter" onPress={handleTwitterLogin} />
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
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
  },
  toggleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  lockedText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login;