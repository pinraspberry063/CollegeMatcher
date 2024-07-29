import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners'
import { UserProvider } from './components/UserContext';
import themeContext from './theme/themeContext'
import theme from './theme/theme'
import Quiz from './app/Quiz'
import Settings from './app/Settings'
import Home, { AccountCreation, Login } from './app/index'
import Account from './app/AccSettings'
import Picker from './app/ProfileImageComp'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Launch from './app/Launch';
import Preferences from './app/Preferences';
import ColForum from './app/ColForum';
import Message from './app/Message';
import RecConvs from './app/RecConvs';

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
  </QuizStack.Navigator>
)

const ForumStack = createNativeStackNavigator();
const ForumStackScreen = () => (
  <ForumStack.Navigator screenOptions={screenOptions}>
    <ForumStack.Screen name="Forum" component={ColForum} />
  </ForumStack.Navigator>
)

const icons = {
  Home: 'home',
  Quiz: 'magnify',
  Forum: 'forum',
  Messages: 'message'
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
