import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native'
import React, {useState, useContext} from 'react'
import {EventRegister} from 'react-native-event-listeners'
import themeContext from '../theme/themeContext'


const Preferences = () => {
  const theme = useContext(themeContext);
  const [darkMode, setDarkMode] = useState(false);
  return (
    <View styles={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <TouchableOpacity styles={[styles.container, {backgroundColor: theme.background}]}>
        <Text style={[styles.item, {color: theme.color}]}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={(value) => {
            setDarkMode(value);
            EventRegister.emit('Change Theme', value)

          }}
        />
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