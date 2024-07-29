import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import NavStack from './routes/homeStack';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Index'
const Tab = createBottomTabNavigator();
import {EventRegister} from 'react-native-event-listeners'
import themeContext from './theme/themeContext'
import theme from './theme/theme'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const listener = EventRegister.addEventListener('Change Theme', (data) => {
      setDarkMode(data)
    })
    return () => {
      EventRegister.removeAllListeners(listener)
    }
  }, [darkMode])

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // Check for the initial dynamic link if the app was opened with one
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link) {
          handleDynamicLink(link);
        }
      });
    return () => unsubscribe();
  }, []);

const handleDynamicLink = async (link) => {
  if (link.url) {
    console.log('Received dynamic link:', link.url);
    if (auth().isSignInWithEmailLink(link.url)) {
      try {
        const email = await AsyncStorage.getItem('emailForSignIn');
        console.log('Retrieved email for sign-in:', email);
        if (email) {
          const result = await auth().signInWithEmailLink(email, link.url);
          console.log('Sign-in result:', result);
          await AsyncStorage.removeItem('emailForSignIn');
          console.log('User signed in successfully:', result.user.email);
          navigation.navigate('Home');
        } else {
          console.log('No email found for sign-in');
        }
      } catch (error) {
        console.error('Error signing in with email link:', error);
      }
    }
  }
};

  return (
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
      <NavStack theme={darkMode === true ? DarkTheme : DefaultTheme}/>
    </themeContext.Provider>
  )
}

export default registerRootComponent(App);

const styles = StyleSheet.create({})