import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Navigator from './routes/homeStack';
import { registerRootComponent } from 'expo';

const App = () => {
  return (
    
    <Navigator />
  )
}

export default registerRootComponent(App)

const styles = StyleSheet.create({})