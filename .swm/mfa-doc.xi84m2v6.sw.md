---
title: MFA Doc
---
<SwmSnippet path="/app/MFAScreen.jsx" line="25">

---

Here’s a refined version of the documentation, focusing specifically on the **MFA (Multi-Factor Authentication)** aspects:

\### **MFAScreen.jsx**

1\. **handleSendVerificationCode**&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;**MFA Focus**: This function is a critical part of enabling MFA via phone verification. It sends an SMS verification code to the user’s phone, which is the second factor of authentication in the MFA process.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;**MFA Flow**:

&nbsp;&nbsp;&nbsp;- **Phone Number Validation**: Ensures the user provides a valid phone number, which is required to receive the MFA verification code.

&nbsp;&nbsp;&nbsp;- **Sending the Code**: Uses Firebase’s `auth().signInWithPhoneNumber()` to send a verification code to the user’s phone. This step initiates the MFA process by confirming that the phone number is valid and reachable.

&nbsp;&nbsp;&nbsp;- **User Notification**: After successfully sending the code, it alerts the user to enter the verification code, informing them that MFA is now in progress.

&nbsp;&nbsp;&nbsp;- **Error Handling**: In case of issues with sending the code (e.g., invalid number, network errors), it catches the error and displays an alert, preventing the MFA process from continuing until the issue is resolved.

&nbsp;&nbsp;&nbsp;**Key MFA Points**:

&nbsp;&nbsp;&nbsp;- Initiates the phone-based MFA process by sending the verification code.

&nbsp;&nbsp;&nbsp;- Validates the user’s phone number, ensuring MFA is only enabled with a valid number.

&nbsp;&nbsp;&nbsp;- Provides feedback to guide the user through this MFA setup step.

2\. **handleVerifyCode**&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;**MFA Focus**: This function completes the MFA process by verifying the user’s entered code and linking the phone number as a second factor for authentication.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;**MFA Flow**:

&nbsp;&nbsp;&nbsp;- **Code Validation**: Ensures the user has entered the verification code they received via SMS, which is required to confirm their identity as part of MFA.

&nbsp;&nbsp;&nbsp;- **Verification & Linking**:&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Verifies the code using Firebase’s `auth.PhoneAuthProvider.credential()`.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- If the user’s phone number is already linked to their account, it re-authenticates them using this phone-based MFA.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- If the phone number is not yet linked, the function links it to the user’s Firebase account, enabling phone-based MFA.

&nbsp;&nbsp;&nbsp;- **Firestore Update**: Once the phone number is verified and linked, it updates the user’s MFA status (\`mfaEnabled: true\`) and stores the phone number in Firestore. This step ensures that future logins will require MFA.

&nbsp;&nbsp;&nbsp;- **User Notification**: Informs the user that MFA has been successfully enabled and navigates them back to the main app screen.

&nbsp;&nbsp;&nbsp;**Key MFA Points**:

&nbsp;&nbsp;&nbsp;- Verifies the second authentication factor (phone number) to complete the MFA process.

&nbsp;&nbsp;&nbsp;- Links the verified phone number to the user’s Firebase account for future MFA use.

&nbsp;&nbsp;&nbsp;- Updates Firestore to reflect the user’s MFA-enabled status.

\### **Login.jsx**

1\. **handleEmailLogin**&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;**MFA Focus**: This function integrates MFA into the email/password login process by checking if MFA is enabled for the user and triggering the MFA verification flow if necessary.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;**MFA Flow**:

&nbsp;&nbsp;&nbsp;- **MFA Check**: After the user logs in with their email and password, the function checks Firestore to see if MFA is enabled for the user.

&nbsp;&nbsp;&nbsp;- **MFA Code Sending**: If MFA is enabled, the function retrieves the user’s phone number from Firestore and uses Firebase’s `auth().verifyPhoneNumber()` to send an SMS verification code to the user. This initiates the MFA step during login.

&nbsp;&nbsp;&nbsp;- **User Notification**: Alerts the user that MFA is required and that a verification code has been sent to their phone, guiding them to complete the MFA process.

&nbsp;&nbsp;&nbsp;**Key MFA Points**:

&nbsp;&nbsp;&nbsp;- Detects whether the user has MFA enabled and initiates the MFA verification process.

&nbsp;&nbsp;&nbsp;- Sends an MFA verification code as part of the login flow if MFA is required.

&nbsp;&nbsp;&nbsp;- Ensures MFA is enforced for users who have it enabled.

2\. **handleMfaVerification**&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;**MFA Focus**: This function finalizes the login process by verifying the MFA code that the user enters during login.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;**MFA Flow**:

&nbsp;&nbsp;&nbsp;- **Code Validation**: Requires the user to input the MFA verification code they received via SMS, which is the second factor in the login process.

&nbsp;&nbsp;&nbsp;- **Re-authentication**: Verifies the MFA code using Firebase’s `auth.PhoneAuthProvider.credential()` and re-authenticates the user. This ensures that both the email/password and MFA code are correct before granting access to the app.

&nbsp;&nbsp;&nbsp;**Key MFA Points**:

&nbsp;&nbsp;&nbsp;- Verifies the second factor of authentication (SMS verification code) during login.

&nbsp;&nbsp;&nbsp;- Re-authenticates the user using the verified MFA credential to ensure secure access.

\### **General MFA Notes**:

\- **Firebase Integration**: The MFA implementation leverages Firebase's phone authentication for sending and verifying SMS codes as a second authentication factor.

\- **User Experience**: Alerts and notifications guide the user through the entire MFA flow, from receiving the code to completing verification.

\- **Security**: By linking the phone number as a second factor, the app adds an extra layer of security for users who enable MFA.

This documentation emphasizes how the MFA process is initiated, verified, and linked to the user's account across both screens, giving a clear view of how MFA enhances security in the app.

```javascript
  const handleSendVerificationCode = async () => {
    // Input validation for phone number
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number with country code.');
      return;
    }
    try {
      setLoading(true);
      const confirmationResult = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmationResult);
      setVerificationSent(true);
      Alert.alert('Verification Code Sent', 'Please enter the code sent to your phone.');
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Input Error', 'Please enter the verification code.');
      return;
    }
    try {
      setLoading(true);
      const credential = auth.PhoneAuthProvider.credential(
        confirmation.verificationId,
        verificationCode
      );

      const currentUser = auth().currentUser;
      const providers = currentUser.providerData.map(provider => provider.providerId);

      if (providers.includes(auth.PhoneAuthProvider.PROVIDER_ID)) {
        // Phone provider is already linked
        // Reauthenticate the user with the phone credential
        await currentUser.reauthenticateWithCredential(credential);
      } else {
        // Link the phone credential to the user
        await currentUser.linkWithCredential(credential);
      }

      // Update user's MFA status in Firestore
      const uid = currentUser.uid;
      await updateDoc(doc(firestore, 'Users', uid), {
        mfaEnabled: true,
        phoneNumber: phoneNumber,
      });

      Alert.alert('Success', 'Multi-Factor Authentication has been enabled.');
      // Navigate to the main app screen
      navigation.navigate('Main');
    } catch (error) {
      console.error('Verification Error:', error);
      Alert.alert('Verification Failed', 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };
```

---

</SwmSnippet>

<SwmSnippet path="/app/Login.jsx" line="48">

---

&nbsp;

```javascript
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

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
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

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
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
