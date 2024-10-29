import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import auth from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const Preferences = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMfaStatus = async () => {
      try {
        const uid = auth().currentUser.uid;
        const firestore = getFirestore(db);
        const userDocRef = doc(firestore, 'Users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setIsMfaEnabled(data.mfaEnabled || false);
        }
      } catch (error) {
        console.error('Error fetching MFA status:', error);
      }
    };
    fetchMfaStatus();
  }, []);

  const handleToggleMfa = (value) => {
    setIsMfaEnabled(value);
    if (value) {
      navigation.navigate('MFAScreen');
    } else {
      Alert.alert(
        'Disable MFA',
        'Are you sure you want to disable Multi-Factor Authentication?',
        [
          { text: 'Cancel', onPress: () => setIsMfaEnabled(true) },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                setLoading(true);
                const uid = auth().currentUser.uid;
                const firestore = getFirestore(db);
                await updateDoc(doc(firestore, 'Users', uid), {
                  mfaEnabled: false,
                  phoneNumber: '',
                });
                Alert.alert('MFA Disabled', 'Multi-Factor Authentication has been disabled.');
              } catch (error) {
                console.error('Error disabling MFA:', error);
                Alert.alert('Error', 'Failed to disable MFA.');
                setIsMfaEnabled(true);
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  return (
    <View styles={styles.container}>
      <TouchableOpacity styles={styles.container}>
        <Text style={styles.preferenceText}>Multi Factor Authentication</Text>
        <Switch
        value={isMfaEnabled}
        onValueChange={setIsMfaEnabled}
        trackColor={{ false: '#767577', true: 'black' }}
        thumbColor={isMfaEnabled ? 'black' : '#f4f3f4'}
          />
    
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  preferenceText: {
    fontSize: 25,
    marginTop: 10,
  },
});

export default Preferences;
