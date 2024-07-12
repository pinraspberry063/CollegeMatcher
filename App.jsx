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
  //   <Navigator> 
  //     <Tab.Navigator
  //       screenOptions={({ route }) => ({
  //         tabBarIcon: ({ focused, color, size }) => {
  //           let iconName;

  //           if (route.name === 'Home') {
  //             iconName = focused
  //               ? 'ios-information-circle'
  //               : 'ios-information-circle-outline';
  //           } else if (route.name === 'Settings') {
  //             iconName = focused ? 'ios-list' : 'ios-list-outline';
  //           }

  //           // You can return any component that you like here!
  //           return <Ionicons name={iconName} size={size} color={color} />;
  //         },
  //         tabBarActiveTintColor: 'tomato',
  //         tabBarInactiveTintColor: 'gray',
  //       })}
  //     >
  //       <Tab.Screen name="Home" component={Home} />
  //     </Tab.Navigator>
  //   </Navigator>
  // )
  )
}

export default registerRootComponent(App);

const styles = StyleSheet.create({})