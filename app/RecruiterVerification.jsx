import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import emailjs from 'emailjs-com';  // Import EmailJS

const RecruiterVerification = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerification = () => {
    if (!email || !name || !linkedIn) {
      Alert.alert('Input Error', 'Please fill out all required fields.');
      return;
    }

    setLoading(true);

    // EmailJS Email Send Config
    const emailParams = {
      user_name: name,
      user_email: email,
      user_linkedin: linkedIn,
    };

    // Replace with your EmailJS details
    emailjs
      .sendForm('service_5fgq98p', 'template_pa2qntn', emailParams, 'z4h4xRAXRmxDzY2ko')
      .then((response) => {
        setLoading(false);
        Alert.alert('Verification Submitted', 'Your verification request has been submitted.');
        navigation.navigate('Main'); // Redirect after submission
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recruiter Verification</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Institutional Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="LinkedIn Profile URL"
        value={linkedIn}
        onChangeText={setLinkedIn}
      />

      {loading ? (
        <Button title="Submitting..." disabled />
      ) : (
        <Button title="Submit for Verification" onPress={handleVerification} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default RecruiterVerification;
