import { StyleSheet, Text, View, FlatList, TouchableOpacity, VariantsBox , TextInput, Button} from 'react-native'
import React, {useState} from 'react'
import DropdownComponent, {data} from '../components/DropdownComp'
import { SafeAreaView } from 'react-native-safe-area-context';

const Quiz = ({navigation}) => {

    const stateData = [
        { label: 'TX', value: '1' },
        { label: 'LA', value: '2' },
        { label: 'CL', value: '3' },
        { label: 'TN', value: '4' },
        { label: 'NY', value: '5' },
        { label: 'MN', value: '6' },
        { label: 'KT', value: '7' },
        { label: 'MS', value: '8' },
      ];

    const majorData = [
        {label: 'Accounting', value: '1'},
        {label: 'Aerospace Engineering', value: '2'},
        {label: 'Agriculture', value: '3'},
        {label: 'Anatomy', value: '4'},
        {label: 'English', value: '5'},
        {label: 'Entrepreneurship', value: '6'},
        {label: 'Environmetal Science', value: '7'},
        {label: 'Fashion', value: '8'},
        {label: 'Law', value: '9'},
        {label: 'Music Industry', value: '10'},
        {label: 'Information Technology', value: '11'},


    ]

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
                <DropdownComponent name= "PrefState" data={stateData}/>
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