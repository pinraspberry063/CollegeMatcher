import React, {useContext, useState, useEffect} from 'react';
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
} from 'react-native';
import auth from '@react-native-firebase/auth';
import themeContext from '../theme/themeContext';
import {UserContext} from '../components/UserContext';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {db} from '../config/firebaseConfig';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const Login = ({navigation}) => {
  const theme = useContext(themeContext);
  const {setUser} = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('options'); // 'options', 'email', or 'phone'

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const isAllowed = await checkIsRecruiter(userCredential.user.uid);
      if (isAllowed) {
        setUser(userCredential.user); // Set the logged in user in context only if not banned
      } else {
        // If not allowed (banned), don't set the user or navigate
        setUser(null);
      }
      Alert.alert('Login Successful');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handlePhoneLogin = () => {
    navigation.navigate('PhoneVerification');
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '927238517919-c3vu6r24d30repq25jl1t6j7eoiqkb9a.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.signOut(); // Ensures user is prompted to pick account
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      const isAllowed = await checkIsRecruiter(userCredential.user.uid);
      if (isAllowed) {
        setUser(userCredential.user);
      } else {
        setUser(null);
      }
      console.log(
        'User signed in successfully:',
        userCredential.user.displayName,
      );
      Alert.alert('Google Login Successful');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Google Login Failed', error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      await auth().signInWithCredential(facebookCredential);
      Alert.alert('Facebook Login Successful');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Facebook Login Failed', error.message);
    }
  };

  const handleEmailLinkSignIn = async () => {
    if (!email) {
      Alert.alert('Input Error', 'Please enter your email address.');
      return;
    }

    try {
      const link = await dynamicLinks().buildLink({
        link: 'https://collegematcher-46019.firebaseapp.com/__/auth/action?email=${email}',
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

      await auth().sendSignInLinkToEmail(email, actionCodeSettings);
      await AsyncStorage.setItem('emailForSignIn', email);
      Alert.alert(
        'Email Sent',
        'A sign-in link has been sent to your email address. Please check your email and click the link to sign in.',
      );
    } catch (error) {
      console.error('Email link sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      Alert.alert('Error', 'Failed to send email: ${error.message}');
    }
  };

  const checkIsRecruiter = async uid => {
    // change func name after demo
    const firestore = getFirestore(db);
    const usersRef = collection(firestore, 'Users');
    const userQuery = query(usersRef, where('User_UID', '==', uid));

    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();
      if (data.status === 'banned') {
        await auth().signOut();
        Alert.alert(
          'Account Banned',
          'Your account has been banned. Please contact support for more information.',
        );
        // Don't navigate anywhere for banned users
        return false;
      }
      if (data.IsRecruiter) {
        navigation.navigate('Main', {
          screen: 'Messages',
          params: {screen: 'RecConvs'},
        });
      } else {
        navigation.navigate('Main');
      }
      return true;
    }
    return false; // User not found
  };
  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert(
        'Input Error',
        'Please enter your email address to reset your password.',
      );
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert(
          'Password Reset',
          'A password reset email has been sent to your email address.',
        );
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  const renderEmailLogin = () => (
    <>
      <TextInput
        style={[styles.input, {borderColor: theme.color, color: theme.color}]}
        placeholder="Email"
        placeholderTextColor={theme.color}
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            styles.passwordInput,
            {borderColor: theme.color, color: theme.color},
          ]}
          placeholder="Password"
          placeholderTextColor={theme.color}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.toggleButton}>
          <Text style={{color: theme.color}}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      <Button title="Login" onPress={handleEmailLogin} />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={{color: theme.color, marginTop: 10}}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderLoginOptions = () => (
    <>
      <Button
        title="Login with Email"
        onPress={() => setLoginMethod('email')}
      />
      <Button title="Login with Phone" onPress={handlePhoneLogin} />
      <Button title="Login with Google" onPress={handleGoogleLogin} />
      <Button title="Login with Facebook" onPress={handleFacebookLogin} />
      <Button title="Login with Email Link" onPress={handleEmailLinkSignIn} />
    </>
  );

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
              style={[styles.input, styles.passwordInput, { borderColor: 'black', color: 'black' }]}
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
              <Text style={{ color: theme.color }}>{showPassword ? 'Hide' : 'Show'}</Text>
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
                style={[styles.input, { borderColor: theme.color, color: theme.color }]}
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
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'black',
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
    color: 'black'
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
