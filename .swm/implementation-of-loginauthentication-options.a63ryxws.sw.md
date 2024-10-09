---
title: Implementation of login/authentication options
---
# Introduction

This document will walk you through the implementation of the login/authentication options feature.

The feature provides multiple authentication methods including email/password, phone number, Google, Facebook, and email link <SwmToken path="/app/Login.jsx" pos="133:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken>. It also includes user status checks and error handling.

We will cover:

1. Initial setup and state management.
2. Email/password login flow.
3. Phone number login flow.
4. Google login flow.
5. Facebook login flow.
6. Email link <SwmToken path="/app/Login.jsx" pos="133:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken> flow.
7. User status check.
8. Password reset functionality.

# Initial setup and state management

<SwmSnippet path="/app/Login.jsx" line="24">

---

We start by setting up the initial state and context for the login component. This includes user context, theme context, and various state variables for handling user input and login status.

```
const Login = ({ navigation }) => {
  const theme = useContext(themeContext);
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('options'); // 'options', 'email', or 'phone'
  const [showMfaPrompt, setShowMfaPrompt] = useState(false);
  const [mfaVerificationCode, setMfaVerificationCode] = useState('');
  const [mfaConfirmation, setMfaConfirmation] = useState(null);
```

---

</SwmSnippet>

# Email/password login flow

<SwmSnippet path="/app/Login.jsx" line="48">

---

The <SwmToken path="/app/Login.jsx" pos="48:3:3" line-data="  const handleEmailLogin = async () =&gt; {">`handleEmailLogin`</SwmToken> function manages the email/password login process. It checks for input errors, handles login attempts, and locks the user out after a certain number of failed attempts.

```
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password.');
      return;
    }

```

---

</SwmSnippet>

<SwmSnippet path="/app/Login.jsx" line="65">

---

The function sets the loading state, attempts to sign in with email and password, and checks if the user is allowed (not banned). If successful, it sets the user in context.

```
        setShowMfaPrompt(true);
        Alert.alert('MFA Required', 'A verification code has been sent to your phone.');
      } else {
        // No MFA, proceed normally
        await checkIsRecruiter(uid);
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };
```

---

</SwmSnippet>

# Phone number login flow

<SwmSnippet path="app/Login.jsx" line="101">

---

The <SwmToken path="/app/Login.jsx" pos="56:3:3" line-data="  const handlePhoneLogin = async () =&gt; {">`handlePhoneLogin`</SwmToken> function manages the phone number login process. It checks for input errors and sets the loading state. It then attempts to sign in with the phone number and navigates to the phone verification screen if successful.

```
  const handlePhoneLogin = () => {
      navigation.navigate('PhoneVerification');
    };

    useEffect(() => {
      GoogleSignin.configure({
        webClientId: '927238517919-c3vu6r24d30repq25jl1t6j7eoiqkb9a.apps.googleusercontent.com',
      });
    }, []);
```

---

</SwmSnippet>

# Google login flow

<SwmSnippet path="/app/Login.jsx" line="105">

---

The <SwmToken path="/app/Login.jsx" pos="111:3:3" line-data="  const handleGoogleLogin = async () =&gt; {">`handleGoogleLogin`</SwmToken> function manages the Google login process. It configures Google <SwmToken path="/app/Login.jsx" pos="133:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken>, ensures the user is prompted to pick an account, and handles the login process. It also checks if the user is allowed and sets the user in context if successful.

```
    useEffect(() => {
      GoogleSignin.configure({
        webClientId: '927238517919-c3vu6r24d30repq25jl1t6j7eoiqkb9a.apps.googleusercontent.com',
      });
    }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.signOut(); // Ensures user is prompted to pick account
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;

      // Check if user document exists
      const userDocRef = doc(firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Prompt for username
        navigation.navigate('UsernamePrompt', { user });
      } else {
        // User document exists, proceed to main app
        setUser(user);
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Google Login Failed', error.message);
    }
  };
```

---

</SwmSnippet>

# Facebook login flow

<SwmSnippet path="/app/Login.jsx" line="138">

---

The <SwmToken path="/app/Login.jsx" pos="138:3:3" line-data="  const handleFacebookLogin = async () =&gt; {">`handleFacebookLogin`</SwmToken> function manages the Facebook login process. It handles the login permissions, obtains the access token, and signs in with Facebook credentials. It checks if the user is allowed and sets the user in context if successful.

```
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
      const userCredential = await auth().signInWithCredential(facebookCredential);
      const user = userCredential.user;

      // Check if user document exists
      const userDocRef = doc(firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Prompt for username
        navigation.navigate('UsernamePrompt', { user });
      } else {
        // User document exists, proceed to main app
        setUser(user);
        navigation.navigate('Main');
      }
    } catch (error) {
      Alert.alert('Facebook Login Failed', error.message);
    }
  };
```

---

</SwmSnippet>

# Email link <SwmToken path="/app/Login.jsx" pos="133:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken> flow

<SwmSnippet path="/app/Login.jsx" line="169">

---

The <SwmToken path="/app/Login.jsx" pos="169:3:3" line-data=" const handleEmailLinkSignIn = async () =&gt; {">`handleEmailLinkSignIn`</SwmToken> function manages the email link <SwmToken path="/app/Login.jsx" pos="133:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken> process. It checks for input errors, generates a dynamic link, and sends a <SwmToken path="/app/Login.jsx" pos="133:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken> link to the user's email. It also stores the email for <SwmToken path="/app/Login.jsx" pos="133:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken> and handles errors.

```
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
```

---

</SwmSnippet>

<SwmSnippet path="/app/Login.jsx" line="183">

---

&nbsp;

```

     console.log('Generated dynamic link:', link);

     const actionCodeSettings = {
       url: link,
       handleCodeInApp: true,
       android: {
         packageName: 'com.cm_app',
         installApp: false,
         minimumVersion: '12'
       },
       dynamicLinkDomain: 'collegematcher46019.page.link'
     };
```

---

</SwmSnippet>

<SwmSnippet path="/app/Login.jsx" line="197">

---

&nbsp;

```
     console.log('Action code settings:', actionCodeSettings);

     await auth().sendSignInLinkToEmail(email, actionCodeSettings);
     await AsyncStorage.setItem('emailForSignIn', email);
     Alert.alert('Email Sent', 'A sign-in link has been sent to your email address. Please check your email and click the link to sign in.');
   } catch (error) {
     console.error('Email link sign-in error:', error);
     console.error('Error code:', error.code);
     console.error('Error message:', error.message);
     Alert.alert('Error', 'Failed to send email: ${error.message}');
   }
 };
```

---

</SwmSnippet>

# User status check

<SwmSnippet path="/app/Login.jsx" line="210">

---

The <SwmToken path="/app/Login.jsx" pos="210:2:2" line-data="const checkIsRecruiter = async (uid) =&gt; { // change func name after demo">`checkIsRecruiter`</SwmToken> function checks if the user is a recruiter or banned. It queries the Firestore database for the user's status and navigates accordingly. If the user is banned, it signs them out and shows an alert.

```
const checkIsRecruiter = async (uid) => { // change func name after demo
  const firestore = getFirestore(db);
  const usersRef = collection(firestore, 'Users');
  const userQuery = query(usersRef, where('User_UID', '==', uid));

  const querySnapshot = await getDocs(userQuery);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const data = userDoc.data();
    if (data.status === 'banned') {
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
};
```

---

</SwmSnippet>

# Password reset functionality

<SwmSnippet path="/app/Login.jsx" line="237">

---

The <SwmToken path="/app/Login.jsx" pos="238:3:3" line-data="  const handleForgotPassword = () =&gt; {">`handleForgotPassword`</SwmToken> function manages the password reset process. It checks for input errors and sends a password reset email. It handles success and error cases with appropriate alerts.

```

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
```

---

</SwmSnippet>

This concludes the walkthrough of the login/authentication options feature. Each function is designed to handle specific authentication methods and ensure proper user status checks and error handling.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
