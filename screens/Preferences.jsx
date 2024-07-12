import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native'
import React from 'react'

const Preferences = () => {
  return (
    <View styles={styles.container}>
      <TouchableOpacity>
        <Text style={styles.item}>Dark Mode</Text>
        <Switch/>
        </TouchableOpacity>
    </View>
  )
}

export default Preferences

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    item: {
      fontSize: 30,
      padding: 20,
  
    },
  });