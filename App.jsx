import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { registerRootComponent } from 'expo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners'
import { UserProvider } from './components/UserContext';
import themeContext from './theme/themeContext'
import theme from './theme/theme'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Quiz from './app/Quiz'
import Settings from './app/Settings'
import Home from './app/index'
import Account from './app/AccSettings'
import Picker from './app/ProfileImageComp'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Launch from './app/Launch';
import Preferences from './app/Preferences';
import ColForum from './app/ColForum';
import Message from './app/Message';
import RecConvs from './app/RecConvs';
import MakkAI from './app/MakkAI';
import Login from './app/Login';
import AccountCreation from './app/AccountCreation';
import Results from './app/Results';

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    background: "#fff"
  }
}

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen name="Home" component={Home} />
    <HomeStack.Screen name="Settings" component={Settings} />
    <HomeStack.Screen name="Account" component={Account} />
    <HomeStack.Screen name="Picker" component={Picker} />
    <HomeStack.Screen name="Preferences" component={Preferences} />
    <HomeStack.Screen name="MakkAI" component={MakkAI} />
  </HomeStack.Navigator>
)

const MessageStack = createNativeStackNavigator();
const MessageStackScreen = () => (
  <MessageStack.Navigator screenOptions={screenOptions}>
    <MessageStack.Screen name="RecConvs" component={RecConvs} />
    <MessageStack.Screen name="Message" component={Message} />
  </MessageStack.Navigator>
)

const QuizStack = createNativeStackNavigator();
const QuizStackScreen = () => (
  <QuizStack.Navigator screenOptions={screenOptions}>
    <QuizStack.Screen name="Quiz" component={Quiz} />
    <QuizStack.Screen name="Results" component={Results} />

  </QuizStack.Navigator>
)

const ForumStack = createNativeStackNavigator();
const ForumStackScreen = () => (
  <ForumStack.Navigator screenOptions={screenOptions}>
    <ForumStack.Screen name="Forum" component={ColForum} />
  </ForumStack.Navigator>
)
const AIStack = createNativeStackNavigator();
const AIStackScreen = () => (
  <AIStack.Navigator screenOptions={screenOptions}>
    <AIStack.Screen name="MakkAI" component={MakkAI} />
  </AIStack.Navigator>
)

const icons = {
  Home: 'home',
  Quiz: 'magnify',
  Forum: 'forum',
  Messages: 'message',
  AI: 'ai'
}

const Tab = createBottomTabNavigator();
const TabScreen = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        return (
          <MaterialCommunityIcons
            name={icons[route.name]}
            color={color}
            size={size}
          />
        );
      },
      tabBarShowLabel: false,
      headerShown: false,
      tabBarStyle: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 60,
        background: "#fff"
      }
    })}
  >
    <Tab.Screen name="Home" component={HomeStackScreen} />
    <Tab.Screen name="Quiz" component={QuizStackScreen} />
    <Tab.Screen name="Forum" component={ForumStackScreen} />
    <Tab.Screen name="Messages" component={MessageStackScreen} />
    <Tab.Screen name="AI" component={AIStackScreen} />
  </Tab.Navigator>
)

const RootStack = createNativeStackNavigator();
const LaunchStack = createNativeStackNavigator();
const LaunchStackScreen = () => (
  <LaunchStack.Navigator screenOptions={screenOptions}>
    <LaunchStack.Screen name="Launch" component={Launch} />
    <LaunchStack.Screen name="Login" component={Login} />
    <LaunchStack.Screen name="CreateAccount" component={AccountCreation} />
  </LaunchStack.Navigator>
)

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
    <UserProvider>
      <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
        <NavigationContainer theme={darkMode === true ? DarkTheme : DefaultTheme}>
          <RootStack.Navigator screenOptions={screenOptions}>
            <RootStack.Screen name="Launch" component={LaunchStackScreen}/>
            <RootStack.Screen name="Main" component={TabScreen}/>
          </RootStack.Navigator>
        </NavigationContainer>
      </themeContext.Provider>
    </UserProvider>
  )
}

export default registerRootComponent(App);

const styles = StyleSheet.create({})