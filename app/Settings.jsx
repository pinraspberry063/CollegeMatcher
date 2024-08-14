import React, {useState, useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import themeContext from '../theme/themeContext'
import FavoritedColleges from './FavoritedColleges';
import auth from '@react-native-firebase/auth';

const Settings = ({navigation}) => {
  const theme = useContext(themeContext);

  const handleLogout = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await auth().signOut()
      }
        // I can get rid of navigation in this function when/if ?user condition is uncommented in App.jsx
      // Always navigate to the launch screen, regardless of whether the user was signed in or not
      navigation.reset({
        index: 0,
        routes: [{ name: 'Launch' }]
      })
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Text style={[styles.item, {color: theme.color}]}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Preferences')}>
          <Text style={[styles.item, {color: theme.color}]}>Preferences</Text>
        </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('FavColleges')}>

            <Text style={[styles.item, {color: theme.color}]}>Favorited Colleges</Text>
          </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log("Privacy")}>
          <Text style={[styles.item, {color: theme.color}]}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log("Saved MAKK Chats")}>
          <Text style={[styles.item, {color: theme.color}]}>Saved MAKK Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.item, {color: 'red'}]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    fontSize: 30,
    padding: 20,

  },
});

export default Settings
