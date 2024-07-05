import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Navigator from './routes/homeStack';
import { registerRootComponent } from 'expo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Index'
const Tab = createBottomTabNavigator();

const App = (route) => {
  return (
    <Navigator />
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

export default registerRootComponent(App)

const styles = StyleSheet.create({})