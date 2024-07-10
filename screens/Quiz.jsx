import { StyleSheet, Text, View, FlatList, TouchableOpacity, VariantsBox , TextInput, Button} from 'react-native'
import React, {useState} from 'react'
import DropdownComponent, {data} from '../components/DropdownComp'
import { SafeAreaView } from 'react-native-safe-area-context';

const Quiz = ({navigation}) => {

    const [gpa, setGpa] = useState('');
    return (
        <View style={styles.container}>
            <SafeAreaView>
                <Text style={styles.text}>What is your GPA?</Text>
                <TextInput 
                style={styles.textInput} 
                title="Enter GPA on 4.0 Scale" 
                value={gpa} 
                onChangeText={setGpa}
                placeholder='Ex: 3.6...'
                />
                
            </SafeAreaView>
            
            <View style = {styles.dropdownContainer}>
                <Text style={styles.text}>In what state so you wish to attend College?</Text>
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
        //paddingTop: 100,
        alignContent: 'center',
        justifyContent: 'top'
        
    
    },
    dropdownContainer:{
        alignContent: 'center', 
        padding:10
        
    },
    buttonContainer:{
        alignContent: 'center',
        paddingTop: 75
        
    },
    textInput: {
        height: 40,
        width: 400,
        borderWidth:1,
        fontSize: 20,
        alignSelf: 'center',
        padding: 5,
    },
    text: {
        height: 40,
        width: 400,
        fontSize: 20,
        paddingTop: 10,
        alignSelf: 'center',


    },
    button: {
        width: '50%',
        height: 15
      }
})