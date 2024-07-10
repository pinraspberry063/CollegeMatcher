import { StyleSheet, Text, View, FlatList, TouchableOpacity, VariantsBox , TextInput, Button} from 'react-native'
import React, {useState} from 'react'
import DropdownComponent, {data} from '../components/DropdownComp'

const Quiz = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style = {styles.dropdownContainer}>
                <DropdownComponent/>
                
            </View>
            <View style={styles.buttonContainer}>
                <Button style={styles.button}
                    onPress={() => navigation.pop()}
                    title= "Submit"
                />

            </View>
        </View>
    )
}

export default Quiz

const styles = StyleSheet.create({
    container: {
        flex:1, 
    
    },
    dropdownContainer:{
        alignContent: 'center', 
        paddingTop: 100
    },
    buttonContainer:{
        alignContent: 'center',
        paddingTop: 600
    },
    textInput: {
        fontSize: 30,
        alignSelf: 'center', 
        borderBlockColor: '#eee'
    },
    button: {
        width: '50%'
      }
})