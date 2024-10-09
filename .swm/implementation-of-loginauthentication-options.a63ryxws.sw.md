---
title: Implementation of login/authentication options
---
# Introduction

This document will walk you through the implementation of the login/authentication options feature.

The feature provides multiple authentication methods including email/password, phone number, Google, Facebook, and email link <SwmToken path="/app/Login.jsx" pos="105:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken>. It also includes user status checks and error handling.

We will cover:

1. Initial setup and state management.
2. Email/password login flow.
3. Phone number login flow.
4. Google login flow.
5. Facebook login flow.
6. Email link <SwmToken path="/app/Login.jsx" pos="105:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken> flow.
7. User status check.
8. Password reset functionality.

# Initial setup and state management

<SwmSnippet path="/app/Login.jsx" line="15">

---

We start by setting up the initial state and context for the login component. This includes user context, theme context, and various state variables for handling user input and login status.

```
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
```

---

</SwmSnippet>

# Email/password login flow

<SwmSnippet path="/app/Login.jsx" line="25">

---

The <SwmToken path="/app/Login.jsx" pos="26:3:3" line-data="  const handleEmailLogin = async () =&gt; {">`handleEmailLogin`</SwmToken> function manages the email/password login process. It checks for input errors, handles login attempts, and locks the user out after a certain number of failed attempts.

```

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password.');
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      setIsLocked(true); // Lock the user out
      return;
    }
```

---

</SwmSnippet>

<SwmSnippet path="/app/Login.jsx" line="36">

---

The function sets the loading state, attempts to sign in with email and password, and checks if the user is allowed (not banned). If successful, it sets the user in context.

```

    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
      setAttempts(0);
      const isAllowed = await checkIsRecruiter(userCredential.user.uid);
      if (isAllowed) {
        setUser(userCredential.user); // Set the logged in user in context only if not banned
      } else {
        // If not allowed (banned), don't set the user or navigate
        setUser(null);
      }
    } catch (error) {
      setLoading(false);
      setAttempts(attempts + 1);
      Alert.alert('Login Failed', error.message);
    }
  };
```

---

</SwmSnippet>

# Phone number login flow

<SwmSnippet path="/app/Login.jsx" line="55">

---

The <SwmToken path="/app/Login.jsx" pos="56:3:3" line-data="  const handlePhoneLogin = async () =&gt; {">`handlePhoneLogin`</SwmToken> function manages the phone number login process. It checks for input errors and sets the loading state. It then attempts to sign in with the phone number and navigates to the phone verification screen if successful.

```

  const handlePhoneLogin = async () => {
    if (!phoneNumber) {
      Alert.alert('Input Error', 'Please enter a phone number.');
      return;
    }

    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setLoading(false);
      const isAllowed = await checkIsRecruiter(userCredential.user.uid);
            if (isAllowed) {
              setUser(userCredential.user);
            } else {
              setUser(null);
            }
      navigation.navigate('Launch', {
        screen: 'PhoneVerification',
        params: { verificationId: confirmation.verificationId }
      });
    } catch (error) {
      setLoading(false);
      Alert.alert('Phone Login Failed', error.message);
    }
  };
```

---

</SwmSnippet>

# Google login flow

<SwmSnippet path="/app/Login.jsx" line="81">

---

The <SwmToken path="/app/Login.jsx" pos="88:3:3" line-data="  const handleGoogleLogin = async () =&gt; {">`handleGoogleLogin`</SwmToken> function manages the Google login process. It configures Google <SwmToken path="/app/Login.jsx" pos="105:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken>, ensures the user is prompted to pick an account, and handles the login process. It also checks if the user is allowed and sets the user in context if successful.

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
      const isAllowed = await checkIsRecruiter(userCredential.user.uid);
                  if (isAllowed) {
                    setUser(userCredential.user);
                  } else {
                    setUser(null);
                  }
      console.log('User signed in successfully:', userCredential.user.displayName);
      Alert.alert('Google Login Successful');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Google Login Failed', error.message);
    }
  };
```

---

</SwmSnippet>

# Facebook login flow

<SwmSnippet path="/app/Login.jsx" line="109">

---

The <SwmToken path="/app/Login.jsx" pos="110:3:3" line-data="  const handleFacebookLogin = async () =&gt; {">`handleFacebookLogin`</SwmToken> function manages the Facebook login process. It handles the login permissions, obtains the access token, and signs in with Facebook credentials. It checks if the user is allowed and sets the user in context if successful.

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
      await auth().signInWithCredential(facebookCredential);
      const isAllowed = await checkIsRecruiter(userCredential.user.uid);
                  if (isAllowed) {
                    setUser(userCredential.user);
                  } else {
                    setUser(null);
                  }
      Alert.alert('Facebook Login Successful');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Facebook Login Failed', error.message);
    }
  };
```

---

</SwmSnippet>

# Email link <SwmToken path="/app/Login.jsx" pos="105:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken> flow

<SwmSnippet path="/app/Login.jsx" line="134">

---

The <SwmToken path="/app/Login.jsx" pos="135:3:3" line-data=" const handleEmailLinkSignIn = async () =&gt; {">`handleEmailLinkSignIn`</SwmToken> function manages the email link <SwmToken path="/app/Login.jsx" pos="105:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken> process. It checks for input errors, generates a dynamic link, and sends a <SwmToken path="/app/Login.jsx" pos="105:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken> link to the user's email. It also stores the email for <SwmToken path="/app/Login.jsx" pos="105:8:10" line-data="      console.error(&#39;Google Sign-In Error:&#39;, error);">`Sign-In`</SwmToken> and handles errors.

```

 const handleEmailLinkSignIn = async () => {
   if (!email) {
     Alert.alert('Input Error', 'Please enter your email address.');
     return;
   }

   setLoading(true);
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

<SwmSnippet path="/app/Login.jsx" line="150">

---

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

<SwmSnippet path="/app/Login.jsx" line="163">

---

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
   } finally {
     setLoading(false);
   }
 };
```

---

</SwmSnippet>

# User status check

<SwmSnippet path="/app/Login.jsx" line="178">

---

The <SwmToken path="/app/Login.jsx" pos="179:2:2" line-data="const checkIsRecruiter = async (uid) =&gt; { // change func name after demo">`checkIsRecruiter`</SwmToken> function checks if the user is a recruiter or banned. It queries the Firestore database for the user's status and navigates accordingly. If the user is banned, it signs them out and shows an alert.

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
        screen: 'Messages',
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

<SwmSnippet path="/app/Login.jsx" line="206">

---

The <SwmToken path="/app/Login.jsx" pos="207:3:3" line-data="  const handleForgotPassword = () =&gt; {">`handleForgotPassword`</SwmToken> function manages the password reset process. It checks for input errors and sends a password reset email. It handles success and error cases with appropriate alerts.

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
