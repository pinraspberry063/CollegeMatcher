import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import themeContext from '../theme/themeContext';
import auth from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const Preferences = ({ navigation }) => {
  const theme = useContext(themeContext);
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

  const handleToggleDarkMode = (value) => {
    setDarkMode(value);
    EventRegister.emit('Change Theme', value);
  };

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
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.preferenceItem}>
        <Text style={[styles.preferenceText, { color: theme.color }]}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={handleToggleDarkMode}
          trackColor={{ false: '#767577', true: theme.buttonColor }}
          thumbColor={darkMode ? theme.buttonColor : '#f4f3f4'}
        />
      </View>
      <View style={styles.preferenceItem}>
        <Text style={[styles.preferenceText, { color: theme.color }]}>Enable MFA</Text>
        <Switch
          value={isMfaEnabled}
          onValueChange={handleToggleMfa}
          trackColor={{ false: '#767577', true: theme.buttonColor }}
          thumbColor={isMfaEnabled ? theme.buttonColor : '#f4f3f4'}
          disabled={loading}
        />
      </View>
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
    fontSize: 18,
  },
});

export default Preferences;
