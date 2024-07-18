import React from 'react';
// import type {PropsWithChildren} from 'react';
import {
  // SafeAreaView,
  // ScrollView,
  // StatusBar,
  StyleSheet,
  Text,
  // useColorScheme,
  View,
} from 'react-native';

import {Stack} from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './Settings';
import Home from './index';
import  Quiz from './Quiz';
import Account from './AccSettings';

const Tab = createNativeStackNavigator();
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
    background: "#fff",
  }
}

const RootLayout = () => {
  return (
    <NavigationContainer >
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Quiz" component={Quiz} />
          <Tab.Screen name="Account" component={Account} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>

      </ NavigationContainer>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
});

export default RootLayout;
