import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'


const Launch = ({navigation}) => {
  return (
    
    <View style={styles.buttonContainer2}>
            <Button
              title="Login"
              onPress={() => { navigation.navigate('Login') }}
              buttonStyle={styles.button2}
            />
            <Button
              title="Create Account"
              onPress={() => { navigation.navigate('CreateAccount') }}
              buttonStyle={styles.button2}
            />
    </View>
  )
}

export default Launch

const styles = StyleSheet.create({

    buttonContainer2: {
        flex:1, 
        alignItems: 'center',
        justifyContent: 'center'
    },
    button2: {
    marginVertical: 10,
    width: 200,
    },
})