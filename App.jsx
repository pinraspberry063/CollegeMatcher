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
      <NavStack theme={darkMode === true ? DarkTheme : DefaultTheme}/>
    </themeContext.Provider>
  )
}

export default registerRootComponent(App);

const styles = StyleSheet.create({})