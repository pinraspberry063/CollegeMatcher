import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import auth from '@react-native-firebase/auth';
import themeContext from '../theme/themeContext';
import { UserContext } from '../components/UserContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { TwitterAuthProvider } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const MAX_ATTEMPTS = 5;

const Login = ({ navigation }) => {
  const theme = useContext(themeContext);
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '927238517919-c3vu6r24d30repq25jl1t6j7eoiqkb9a.apps.googleusercontent.com',
    });

    const handleDynamicLink = async (link) => {
      if (link && auth().isSignInWithEmailLink(link.url)) {
        let emailForSignIn = await AsyncStorage.getItem('emailForSignIn');
        if (!emailForSignIn) {
          Alert.alert(
            'Email Required',
            'Please enter the email address you used for sign-in',
            [
              {
                text: 'OK',
                onPress: async () => {
                  const userEmail = await new Promise((resolve) => {
                    Alert.prompt(
                      'Enter Email',
                      'Please enter your email address',
                      (email) => resolve(email)
                    );
                  });
                  if (userEmail) {
                    emailForSignIn = userEmail;
                  }
                },
              },
            ]
          );
        }
        if (emailForSignIn) {
          try {
            await auth().signInWithEmailLink(emailForSignIn, link.url);
            await AsyncStorage.removeItem('emailForSignIn');
            console.log('User signed in successfully');
            Alert.alert('Success', 'You have been signed in successfully!');
            navigation.navigate('Main');
          } catch (error) {
            console.error('Error signing in with email link:', error);
            Alert.alert('Error', 'Failed to sign in: ' + error.message);
          }
        }
      }
    };

    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link) {
          handleDynamicLink(link);
        }
      });

    return () => unsubscribe();
  }, [navigation]);

 const handleEmailLinkSignIn = async () => {
   if (!email) {
     Alert.alert('Input Error', 'Please enter your email address.');
     return;
   }

   setLoading(true);
   try {
     const link = await dynamicLinks().buildShortLink({
       link: `https://collegematcher46019.page.link/emailSignIn?email=${encodeURIComponent(email)}`,
       domainUriPrefix: 'https://collegematcher46019.page.link',
       android: {
         packageName: 'com.cm_app',
       },
       ios: {
         bundleId: 'com.cm_app',
       },
     }, dynamicLinks.ShortLinkType.SHORT);

     console.log('Generated short link:', link);

     const actionCodeSettings = {
       url: link,
       handleCodeInApp: true,
       iOS: {
         bundleId: 'com.cm_app'
       },
       android: {
         packageName: 'com.cm_app',
         installApp: false,
         minimumVersion: '12'
       },
       dynamicLinkDomain: 'collegematcher46019.page.link'
     };

     console.log('Action code settings:', actionCodeSettings);

     await auth().sendSignInLinkToEmail(email, actionCodeSettings);
     await AsyncStorage.setItem('emailForSignIn', email);
     Alert.alert('Email Sent', 'A sign-in link has been sent to your email address. Please check your email and click the link to sign in.');
     setLoading(false);
   } catch (error) {
     setLoading(false);
     console.error('Email link sign-in error:', error);
     console.error('Error code:', error.code);
     console.error('Error message:', error.message);
     Alert.alert('Error', `Failed to send email: ${error.message}`);
   }
 };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password.');
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      setIsLocked(true); // Lock the user out
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
      setAttempts(0);
      setUser(userCredential.user); // Set the logged in user in context
      checkIsRecruiter(userCredential.user.uid); // Check if the user is a recruiter
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
      await GoogleSignin.signOut(); // Ensures user is prompted to pick account
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log('User signed in successfully:', userCredential.user.displayName);
      Alert.alert('Google Login Successful');
      navigation.navigate('Main');
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
      navigation.navigate('Main');
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
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Twitter Login Failed', error.message);
    }
  };

  const checkIsRecruiter = async (uid) => {
    const firestore = getFirestore(db);
    const usersRef = collection(firestore, 'Users');
    const userQuery = query(usersRef, where('User_UID', '==', uid));

    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();
      if (data.IsRecruiter) {
        navigation.navigate('Main', {
          screen: 'Messages',
          params: { screen: 'RecConvs' }
        });
      } else {
        navigation.navigate('Main');
      }
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
      <Text style={[styles.title, { color: theme.color }]}>Login</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.color, color: theme.color }]}
        placeholder="Email"
        placeholderTextColor={theme.color}
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput, { borderColor: theme.color, color: theme.color }]}
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
          <Text style={{ color: theme.color }}>{showPassword ? 'Hide' : 'Show'}</Text>
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
          <Button title="Login with Email Link" onPress={handleEmailLinkSignIn} />
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
