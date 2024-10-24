import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Animated,
  ImageBackground,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import themeContext from '../theme/themeContext';
import { UserContext } from '../components/UserContext';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const Login = ({ navigation }) => {

  const { setUser } = useContext(UserContext);

  // === Unified Input Fields State ===
  const [identifier, setIdentifier] = useState(''); // Username, Email, or Phone Number
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // MFA states
  const [showMfaPrompt, setShowMfaPrompt] = useState(false);
  const [mfaVerificationCode, setMfaVerificationCode] = useState('');
  const [mfaConfirmation, setMfaConfirmation] = useState(null);

  const firestore = getFirestore(db);

  // Add animation
  const slideAnim = useRef(new Animated.Value(-1000)).current; //start off screen
  const astronautAnim = useRef(new Animated.ValueXY({ x: -200, y: 800 })).current;

  useEffect(() => {
      Animated.timing(slideAnim, {
          toValue: 0, // Moves to its normal position
          duration: 1000, // Duration of the animation
          useNativeDriver: true, // Optimize performance
      }).start();

    // Astronaut
      Animated.timing(astronautAnim, {
          toValue: { x: 0, y: 700 },
          duration: 1000,
          useNativeDriver: true,
          }).start();
    }, []);
  // End animation

  // === Helper Functions to Validate Input ===
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };


  const getEmailFromUsername = async (username) => {
    try {
      console.log('Fetching email for username:', username);

      // Trim the username to remove accidental leading/trailing spaces
      const trimmedUsername = username.trim();

      const q = query(collection(firestore, 'Users'), where('Username', '==', trimmedUsername));
      const querySnapshot = await getDocs(q);

      console.log('Number of documents found:', querySnapshot.size);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log('User data retrieved:', userData);

        // Ensure the Email field exists
        if (userData.Email) {
          return userData.Email;
        } else {
          console.error('Email field is missing in the user document.');
          return null;
        }
      } else {
        console.warn('No user found with the provided username.');
      }

      return null;
    } catch (error) {
      console.error('Error fetching email from username:', error);
      return null;
    }
  };

  // === Handle Login ===
  const handleLogin = async () => {
    if (!identifier) {
      Alert.alert('Input Error', 'Please enter your login details');
      return;
    }

    try {
      let userCredential;
      if (isValidEmail(identifier)) {
        // Login with Email
        userCredential = await auth().signInWithEmailAndPassword(identifier, password);
      } else if (isValidPhoneNumber(identifier)) {
        // Navigate to PhoneVerification screen
        navigation.navigate('PhoneVerification', { phoneNumber: identifier });
        return;
      } else {
        // Assume it's a username
        const email = await getEmailFromUsername(identifier);
        if (email) {
          userCredential = await auth().signInWithEmailAndPassword(email, password);
        } else {
          Alert.alert('Login Error', 'Invalid username or email.');
          return;
        }
      }
      const { user } = userCredential;
         setUser(user);
      if (user) {
        const uid = user.uid;
        // Check if MFA is enabled for the user
        const userDoc = await getDoc(doc(firestore, 'Users', uid));
        if (userDoc.exists() && userDoc.data().mfaEnabled) {
          // Send MFA verification code
          const phoneNumber = userDoc.data().phoneNumber;
          const confirmationResult = await auth().verifyPhoneNumber(phoneNumber);
          setMfaConfirmation(confirmationResult);
          setShowMfaPrompt(true);
          Alert.alert('MFA Required', 'A verification code has been sent to your phone.');
        } else {
          // No MFA, proceed normally
          await checkIsRecruiter(uid);
        }
      } else {
        Alert.alert('Login Error', 'Failed to retrieve user information.');
      }
      Alert.alert('Login Successful');
      //navigation.navigate('Main');
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  // === Handle Forgot Password ===
  const handleForgotPassword = () => {
    if (!identifier) {
      Alert.alert('Input Error', 'Please enter your email address to reset your password.');
      return;
    }

    if (!isValidEmail(identifier)) {
      Alert.alert('Format Error', 'Please enter a valid email address.');
      return;
    }

    auth().sendPasswordResetEmail(identifier)
      .then(() => {
        Alert.alert('Password Reset', 'A password reset email has been sent to your email address.');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  // === Handle MFA Verification ===
  const handleMfaVerification = async () => {
    if (!mfaVerificationCode) {
      Alert.alert('Input Error', 'Please enter the verification code.');
      return;
    }

    try {
      const credential = auth.PhoneAuthProvider.credential(
        mfaConfirmation.verificationId,
        mfaVerificationCode
      );

      // Reauthenticate the user with the phone credential
      await auth().currentUser.reauthenticateWithCredential(credential);

      // Hide MFA prompt and navigate
      setShowMfaPrompt(false);
      navigation.navigate('Main');
    } catch (error) {
      console.error('MFA Verification Error:', error);
      Alert.alert('Verification Failed', 'Invalid verification code.');
    }
  };

  const handlePhoneLogin = () => {
      navigation.navigate('PhoneVerification');
    };

    useEffect(() => {
      GoogleSignin.configure({
        webClientId: '927238517919-c3vu6r24d30repq25jl1t6j7eoiqkb9a.apps.googleusercontent.com',
      });
    }, []);

  const handleGoogleLogin = async () => {
    try {
      // Ensure the user is signed out before initiating sign-in
      await GoogleSignin.signOut();
      // Initiate the Google sign-in process
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with Google credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;

      // Reference to Firestore
      const firestore = getFirestore(db);

      // Check if user document exists in Firestore
      const userDocRef = doc(firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // User document doesn't exist; navigate to UsernamePrompt
        navigation.navigate('UsernamePrompt', {
          user,
          isMfaEnabled: false,
          isRecruiter: false,
          nextScreen: determineNextScreen(),
        });
      } else {
        // User document exists; proceed with MFA check

        const userData = userDoc.data();

        if (userData.mfaEnabled) {
          // If MFA is enabled, navigate to MFAScreen
          navigation.navigate('MFAScreen', {
            nextScreen: determineNextScreen(),
            phoneNumber: userData.phoneNumber,
          });
        } else {
          // If MFA is not enabled, proceed to main application
          setUser(user); // Ensure setUser is defined in your context
          navigation.navigate('Main');
        }
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Google Login Failed', error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // Initiate Facebook Login
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      // Get the Facebook access token
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      // Create a Firebase credential with the Facebook access token
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      // Sign in with the credential
      const userCredential = await auth().signInWithCredential(facebookCredential);
      const user = userCredential.user;

      // Reference to Firestore
      const firestore = getFirestore(db);

      // Check if user document exists in Firestore
      const userDocRef = doc(firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // User document doesn't exist; navigate to UsernamePrompt
        navigation.navigate('UsernamePrompt', {
          user,
          isMfaEnabled: false, // Adjust based on your logic or retrieve dynamically
          isRecruiter: false,  // Adjust based on your logic or retrieve dynamically
          nextScreen: determineNextScreen(), // Ensure this function exists and returns the appropriate screen
        });
      } else {
        // User document exists; proceed with MFA check

        const userData = userDoc.data();

        if (userData.mfaEnabled) {
          // If MFA is enabled, navigate to MFAScreen
          navigation.navigate('MFAScreen', {
            nextScreen: determineNextScreen(),
            phoneNumber: userData.phoneNumber,
          });
        } else {
          // If MFA is not enabled, proceed to main application
          setUser(user); // Ensure setUser is defined in your context
          navigation.navigate('Main');
        }
      }
    } catch (error) {
      console.error('Facebook Sign-In Error:', error);
      Alert.alert('Facebook Login Failed', error.message);
    }
  };

 const handleEmailLinkLogin = async () => {
   if (!email) {
     Alert.alert('Input Error', 'Please enter your email address.');
     return;
   }

   try {
     // Build the dynamic link for email sign-in
     const link = await dynamicLinks().buildLink({
       link: `https://collegematcher-46019.firebaseapp.com/__/auth/action?email=${email}`,
       domainUriPrefix: 'https://collegematcher46019.page.link',
       android: {
         packageName: 'com.cm_app',
       },
     });

     console.log('Generated dynamic link:', link);

     const actionCodeSettings = {
       url: link,
       handleCodeInApp: true,
       android: {
         packageName: 'com.cm_app',
         installApp: false,
         minimumVersion: '12',
       },
       dynamicLinkDomain: 'collegematcher46019.page.link',
     };

     console.log('Action code settings:', actionCodeSettings);

     // Send the sign-in email link
     await auth().sendSignInLinkToEmail(email, actionCodeSettings);
     await AsyncStorage.setItem('emailForSignIn', email);

     Alert.alert(
       'Email Sent',
       'A sign-in link has been sent to your email address. Please check your email and click the link to sign in.'
     );
   } catch (error) {
     console.error('Email Link Sign-In Error:', error);
     Alert.alert('Email Link Login Failed', error.message);
   }
 };

 // Handling the incoming email link (This should be placed in useEffect or appropriate lifecycle method)
 useEffect(() => {
   const handleDynamicLink = async (link) => {
     if (auth().isSignInWithEmailLink(link.url)) {
       let email = await AsyncStorage.getItem('emailForSignIn');
       if (!email) {
         // Prompt the user to enter their email
         Alert.prompt('Email Required', 'Please enter your email to complete sign-in.', async (userEmail) => {
           email = userEmail;
         });
       }

       try {
         // Complete the sign-in process
         const userCredential = await auth().signInWithEmailLink(email, link.url);
         const user = userCredential.user;

         // Reference to Firestore
         const firestore = getFirestore(db);

         // Check if user document exists in Firestore
         const userDocRef = doc(firestore, 'Users', user.uid);
         const userDoc = await getDoc(userDocRef);

         if (!userDoc.exists()) {
           // User document doesn't exist; navigate to UsernamePrompt
           navigation.navigate('UsernamePrompt', {
             user,
             isMfaEnabled: false, // Adjust based on your logic or retrieve dynamically
             isRecruiter: false,  // Adjust based on your logic or retrieve dynamically
             nextScreen: determineNextScreen(),
           });
         } else {
           // User document exists; proceed with MFA check

           const userData = userDoc.data();

           if (userData.mfaEnabled) {
             // If MFA is enabled, navigate to MFAScreen
             navigation.navigate('MFAScreen', {
               nextScreen: determineNextScreen(),
               phoneNumber: userData.phoneNumber,
             });
           } else {
             // If MFA is not enabled, proceed to main application
             setUser(user); // Ensure setUser is defined in your context
             navigation.navigate('Main');
           }
         }

         // Remove the email from storage
         await AsyncStorage.removeItem('emailForSignIn');
       } catch (error) {
         console.error('Error completing email link sign-in:', error);
         Alert.alert('Sign-In Failed', error.message);
       }
     }
   };

   // Subscribe to dynamic links
   const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

   // Check if the app was opened with a link
   dynamicLinks()
     .getInitialLink()
     .then((link) => {
       if (link) {
         handleDynamicLink(link);
       }
     });

   return () => {
     unsubscribe();
   };
 }, []);

// Handling the incoming email link (This should be placed in useEffect or appropriate lifecycle method)
useEffect(() => {
  const handleDynamicLink = async (link) => {
    if (auth().isSignInWithEmailLink(link.url)) {
      let email = await AsyncStorage.getItem('emailForSignIn');
      if (!email) {
        // Prompt the user to enter their email
        Alert.prompt('Email Required', 'Please enter your email to complete sign-in.', async (userEmail) => {
          email = userEmail;
        });
      }

      try {
        // Complete the sign-in process
        const userCredential = await auth().signInWithEmailLink(email, link.url);
        const user = userCredential.user;

        // Reference to Firestore
        const firestore = getFirestore(db);

        // Check if user document exists in Firestore
        const userDocRef = doc(firestore, 'Users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // User document doesn't exist; navigate to UsernamePrompt
          navigation.navigate('UsernamePrompt', {
            user,
            isMfaEnabled: false, // Adjust based on your logic or retrieve dynamically
            isRecruiter: false,  // Adjust based on your logic or retrieve dynamically
            nextScreen: determineNextScreen(), // Ensure this function exists and returns the appropriate screen
          });
        } else {
          // User document exists; proceed with MFA check

          const userData = userDoc.data();

          if (userData.mfaEnabled) {
            // If MFA is enabled, navigate to MFAScreen
            navigation.navigate('MFAScreen', {
              nextScreen: determineNextScreen(),
              phoneNumber: userData.phoneNumber,
            });
          } else {
            // If MFA is not enabled, proceed to main application
            setUser(user); // Ensure setUser is defined in your context
            navigation.navigate('Main');
          }
        }

        // Remove the email from storage
        await AsyncStorage.removeItem('emailForSignIn');
      } catch (error) {
        console.error('Error completing email link sign-in:', error);
        Alert.alert('Sign-In Failed', error.message);
      }
    }
  };

  // Subscribe to dynamic links
  const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

  // Check if the app was opened with a link
  dynamicLinks()
    .getInitialLink()
    .then((link) => {
      if (link) {
        handleDynamicLink(link);
      }
    });

  return () => {
    unsubscribe();
  };
}, []);

const checkIsRecruiter = async (uid) => {
  try {
    const firestore = getFirestore(db);
    const usersRef = collection(firestore, 'Users');
    const userQuery = query(usersRef, where('User_UID', '==', uid));

    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();
      if (data.IsBanned === true) {
        await auth().signOut();
        Alert.alert('Account Banned', 'Your account has been banned. Please contact support for more information.');
        // Don't navigate anywhere for banned users
        return false;
      }
      if (data.IsRecruiter) {
        navigation.navigate('Main', {
          screen: 'Message',
          params: { screen: 'RecConvs' }
        });
      } else {
        navigation.navigate('Main');
      }
      return true;
    }
    return false; // User not found
  } catch (error) {
    console.error('Error checking recruiter status:', error);
    return false;
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust if necessary
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
          {/* === Title === */}
          <Text style={styles.title}>Login</Text>

          {/* === Identifier Input === */}
          <TextInput
            style={[styles.input, { borderColor: 'black', color: 'black' }]}
            placeholder="Username, Email, or Phone Number"
            placeholderTextColor='black'
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="email-address" // Optional: change dynamically based on input
            autoCapitalize="none"
          />

          {/* === Password Input with Toggle === */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input]}
              placeholder="Password"
              placeholderTextColor='black'
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.toggleButton}
            >
              <Text >{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          {/* === Forgot Password === */}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={{ color: '#1E90FF', marginBottom: 20, textAlign: 'right' }}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* === Login Button === */}
          <Button title="Login" onPress={handleLogin} />

          {/* === Divider === */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* === Social Logins === */}
          <>
            {/* === Google Sign-In === */}
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
              onPress={handleGoogleLogin}
            >
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* === Facebook Sign-In === */}
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#4267B2' }]}
              onPress={handleFacebookLogin}
            >
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>

            {/* === Email Link Login === */}
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#34A853' }]}
              onPress={handleEmailLinkLogin}
            >
              <Text style={styles.socialButtonText}>Continue with Email Link</Text>
            </TouchableOpacity>
          </>

          {/* === Account Creation Button === */}
          <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
            <Text style={{ color: '#1E90FF', marginTop: 20, textAlign: 'center' }}>Create Account</Text>
          </TouchableOpacity>

          {/* === MFA Prompt === */}
          {showMfaPrompt && (
            <View style={styles.mfaContainer}>
              <Text style={styles.mfaTitle}>Enter MFA Verification Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                value={mfaVerificationCode}
                onChangeText={setMfaVerificationCode}
                keyboardType="number-pad"
              />
              <Button title="Verify Code" onPress={handleMfaVerification} />
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff', // Optional: set a background color
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9', // Optional: softer background for inputs
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleButton: {
    padding: 10,
  },
  mfaContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  mfaTitle: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  socialButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#555',
  },
  background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      },
  astronaut: {
      position: 'absolute',
      width: 150,
      height: 150,
      bottom: 50,
      left: '45%',
      },
});

export default Login;