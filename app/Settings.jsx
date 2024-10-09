import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Switch,
} from 'react-native';
import themeContext from '../theme/themeContext';
import auth from '@react-native-firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Settings = ({ navigation }) => {
  const theme = useContext(themeContext);

  // State variables for MFA
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch MFA status when the component mounts
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

  // Handle MFA toggle
  const handleToggleMfa = (value) => {
    setIsMfaEnabled(value);
    if (value) {
      // Enabling MFA, navigate to MFAScreen for setup
      navigation.navigate('MFAScreen');
    } else {
      // Disabling MFA
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
                setIsMfaEnabled(true); // Revert the toggle switch
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  const handleLogout = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await auth().signOut();
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Launch' }],
      });
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.color} />
      </TouchableOpacity>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Text style={[styles.item, { color: theme.color }]}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Preferences')}>
          <Text style={[styles.item, { color: theme.color }]}>Preferences</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('FavColleges')}>
          <Text style={[styles.item, { color: theme.color }]}>Committed Colleges</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Saved MAKK Chats')}>
          <Text style={[styles.item, { color: theme.color }]}>Saved MAKK Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Privacy')}>
          <Text style={[styles.item, { color: theme.color }]}>Privacy</Text>
        </TouchableOpacity>

        {/* MFA Toggle Switch */}
        <View style={styles.switchContainer}>
          <Text style={[styles.item, { color: theme.color }]}>Enable MFA</Text>
          <Switch
            value={isMfaEnabled}
            onValueChange={handleToggleMfa}
            trackColor={{ false: '#767577', true: theme.buttonColor }}
            thumbColor={isMfaEnabled ? theme.buttonColor : '#f4f3f4'}
            disabled={loading}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('CompareColleges')}>
          <Text style={[styles.item, { color: theme.color }]}>Compare Colleges</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.item, { color: 'red' }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    fontSize: 18,
    paddingVertical: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default Settings;
