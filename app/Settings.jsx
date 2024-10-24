import React, { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import themeContext from '../theme/themeContext';
import auth from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const Settings = ({ navigation }) => {
  const theme = useContext(themeContext);
  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    const checkModeratorStatus = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const firestore = getFirestore(db);
        const userDoc = await getDoc(doc(firestore, 'Users', currentUser.uid));
        if (userDoc.exists()) {
          setIsModerator(userDoc.data().IsModerator || false);
        }
      }
    };
    checkModeratorStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
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
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Text style={[styles.item, { color: 'black' }]}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Preferences')}>
          <Text style={[styles.item, { color: 'black' }]}>Preferences</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('FavColleges')}>
          <Text style={[styles.item, { color: 'black' }]}>Committed Colleges</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ProfilePage')}>
          <Text style={[styles.item, { color: 'black' }]}>Profile Page</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Saved MAKK Chats')}>
          <Text style={[styles.item, { color: 'black' }]}>Saved MAKK Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Privacy')}>
          <Text style={[styles.item, { color: 'black' }]}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('CompareColleges')}>
          <Text style={[styles.item, { color: 'black' }]}>Compare Colleges</Text>
        </TouchableOpacity>

        {isModerator && (
          <TouchableOpacity onPress={() => navigation.navigate('ModeratorScreen')}>
            <Text style={[styles.item, { color: 'black' }]}>Moderation Panel</Text>
          </TouchableOpacity>
        )}

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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Settings;