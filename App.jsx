import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import NavStack from './routes/homeStack';
import { DarkTheme, DefaultTheme , NavigationContainer} from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {EventRegister} from 'react-native-event-listeners'
import themeContext from './theme/themeContext'
import theme from './theme/theme'
import  Quiz from './app/Quiz'
import Settings from './app/Settings'
import Index from './app'
import Account from './app/AccSettings'

const Tab = createBottomTabNavigator();
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

    
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
      {/* <NavigationContainer theme={darkMode === true ? DarkTheme : DefaultTheme}>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Home" component={Index} />
          <Tab.Screen name="Quiz" component={Quiz} />
          <Tab.Screen name="Account" component={Account} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>

      </ NavigationContainer> */}
      <NavStack/>
    </themeContext.Provider>

  )
}

export default registerRootComponent(App);

const styles = StyleSheet.create({})