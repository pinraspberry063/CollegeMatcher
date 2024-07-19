import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native'
import React, { useState, useContext } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext'
import DropdownComponent from '../components/DropdownComp';

const Quiz = ({ navigation }) => {
    const theme = useContext(themeContext);
    const stateData = [
        { label: 'Alabama', value: '1' },
        { label: 'Alaska', value: '2' },
        { label: 'Arizona', value: '3' },
        { label: 'Arkansas', value: '4' },
        { label: 'California', value: '5' },
        { label: 'Colorado', value: '6' },
        { label: 'Connecticut', value: '7' },
        { label: 'Delaware', value: '8' },
        { label: 'Florida', value: '9' },
        { label: 'Georgia', value: '10' },
        { label: 'Hawaii', value: '11' },
        { label: 'Idaho', value: '12' },
        { label: 'Illinois', value: '13' },
        { label: 'Indiana', value: '14' },
        { label: 'Iowa', value: '15' },
        { label: 'Kansas', value: '16' },
        { label: 'Kentucky', value: '17' },
        { label: 'Louisiana', value: '18' },
        { label: 'Maine', value: '19' },
        { label: 'Maryland', value: '20' },
        { label: 'Massachusetts', value: '21' },
        { label: 'Michigan', value: '22' },
        { label: 'Minnesota', value: '23' },
        { label: 'Mississippi', value: '24' },
        { label: 'Missouri', value: '25' },
        { label: 'Montana', value: '26' },
        { label: 'Nebraska', value: '27' },
        { label: 'Nevada', value: '28' },
        { label: 'New Hampshire', value: '29' },
        { label: 'New Jersey', value: '30' },
        { label: 'New Mexico', value: '31' },
        { label: 'New York', value: '32' },
        { label: 'North Carolina', value: '33' },
        { label: 'North Dakota', value: '34' },
        { label: 'Ohio', value: '35' },
        { label: 'Oklahoma', value: '36' },
        { label: 'Oregon', value: '37' },
        { label: 'Pennsylvania', value: '38' },
        { label: 'Rhode Island', value: '39' },
        { label: 'South Carolina', value: '40' },
        { label: 'South Dakota', value: '41' },
        { label: 'Tennessee', value: '42' },
        { label: 'Texas', value: '43' },
        { label: 'Utah', value: '44' },
        { label: 'Vermont', value: '45' },
        { label: 'Virginia', value: '46' },
        { label: 'Washington', value: '47' },
        { label: 'West Virginia', value: '48' },
        { label: 'Wisconsin', value: '49' },
        { label: 'Wyoming', value: '50' },
        { label: 'Puerto Rico', value: '51' },
    ];

    const majorData = [
        { label: 'Aerospace Engineering', value: '1' },
        { label: 'Accounting', value: '2' },
        { label: 'Agriculture', value: '3' },
        { label: 'Architecture', value: '4' },
        { label: 'Biology', value: '5' },
        { label: 'Biomedical Engineering', value: '6' },
        { label: 'Biomedical Science', value: '7' },
        { label: 'Business Administration', value: '8' },
        { label: 'Business Management', value: '9' },
        { label: 'Civil Engineering', value: '10' },
        { label: 'Chemical Engineering', value: '11' },
        { label: 'Chemistry', value: '12' },
        { label: 'Communications', value: '13' },
        { label: 'Communication Technology', value: '14' },
        { label: 'Computer Information Systems', value: '15' },
        { label: 'Computer Engineering', value: '16' },
        { label: 'Computer Science', value: '17' },
        { label: 'Construction Management', value: '18' },
        { label: 'Construction Trades', value: '19' },
        { label: 'Criminal Justice', value: '20' },
        { label: 'Culinary', value: '21' },
        { label: 'Ecology', value: '22' },
        { label: 'Economics', value: '23' },
        { label: 'Education', value: '24' },
        { label: 'Engineering Technologies', value: '25' },
        { label: 'Electrical Engineering', value: '26' },
        { label: 'English', value: '27' },
        { label: 'Entrepreneurship', value: '28' },
        { label: 'Environmental Engineering', value: '29' },
        { label: 'Environmental Protections', value: '30' },
        { label: 'Environmental Sciences', value: '31' },
        { label: 'Ethnic Studies', value: '32' },
        { label: 'Fashion', value: '33' },
        { label: 'Finance', value: '34' },
        { label: 'Fitness Studies', value: '35' },
        { label: 'Foreign Language', value: '36' },
        { label: 'Forestry', value: '37' },
        { label: 'General Studies', value: '38' },
        { label: 'History', value: '39' },
        { label: 'Human Resources', value: '40' },
        { label: 'Human Sciences', value: '41' },
        { label: 'Industrial Engineering', value: '42' },
        { label: 'Interdisciplinary Studies', value: '43' },
        { label: 'Journalism', value: '44' },
        { label: 'Legal Studies', value: '45' },
        { label: 'Liberal Arts', value: '46' },
        { label: 'Marketing', value: '47' },
        { label: 'Mathematics', value: '48' },
        { label: 'Mechanic and Repair Technologies', value: '49' },
        { label: 'Mechanical Engineering', value: '50' },
        { label: 'Multidisciplinary Studies', value: '51' },
        { label: 'Musical Studies', value: '52' },
        { label: 'Natural Resource Management', value: '53' },
        { label: 'Performing Arts', value: '54' },
        { label: 'Philosophy', value: '55' },
        { label: 'Psychology', value: '56' },
        { label: 'Physical Sciences', value: '57' },
        { label: 'Political Science', value: '58' },
        { label: 'Precision Production', value: '59' },
        { label: 'Protective Services', value: '60' },
        { label: 'Public Administration', value: '61' },
        { label: 'Religious Studies', value: '62' },
        { label: 'Religious Vocations', value: '63' },
        { label: 'Social Services', value: '64' },
        { label: 'Social Sciences', value: '65' },
        { label: 'Sociology', value: '66' },
        { label: 'Statistics', value: '67' },
        { label: 'Supply Chain', value: '68' },
        { label: 'Theology', value: '69' },
        { label: 'Visual Arts', value: '70' },
    ];

    const distanceData = [
        { label: '0-50 miles', value: '1' },
        { label: '50-200 miles', value: '2' },
        { label: '200-500 miles', value: '3' },
        { label: '500+ miles', value: '4' },
    ];

    const tuitionData = [
        { label: '$0 - $10,000', value: '1' },
        { label: '$10,000 - $20,000', value: '2' },
        { label: '$20,000 - $30,000', value: '3' },
        { label: '$30,000 - $40,000', value: '4' },
        { label: '$40,000+', value: '5' },
    ];

    const religiousAffiliationData = [
        { label: 'N/A', value: '1' },
        { label: 'American Methodist Episcopal', value: '2' },
        { label: 'African Methodist Episcopal Zion', value: '3' },
        { label: 'American Baptist', value: '4' },
        { label: 'American Evangelical Lutheran', value: '5' },
        { label: 'Assemblies of God Church', value: '6' },
        { label: 'Baptist', value: '7' },
        { label: 'Brethren Church', value: '8' },
        { label: 'Christ and Missionary Alliance', value: '9' },
        { label: 'Christian', value: '10' },
        { label: 'Christian Methodist', value: '11' },
        { label: 'Christian Reformed', value: '12' },
        { label: 'Church of God', value: '13' },
        { label: 'Church of Nazarene', value: '14' },
        { label: 'Church of Christ', value: '15' },
        { label: 'Cumberland Presbyterian', value: '16' },
        { label: 'Episcopal Reformed', value: '17' },
        { label: 'Evangelical', value: '18' },
        { label: 'Evangelical Covenant', value: '19' },
        { label: 'Evangelical Free Church of American', value: '20' },
        { label: 'Evangelical Lutheran', value: '21' },
        { label: 'Free Methodist', value: '22' },
        { label: 'Free Will Baptist', value: '23' },
        { label: 'General Baptist', value: '24' },
        { label: 'Greek Orthodox', value: '25' },
        { label: 'Interdenominational', value: '26' },
        { label: 'Jewish', value: '27' },
        { label: 'Mennonite Brethren', value: '28' },
        { label: 'Mennonite', value: '29' },
        { label: 'Missionary', value: '30' },
        { label: 'Moravian', value: '31' },
        { label: 'Multiple Protestant Denomination', value: '32' },
        { label: 'Non-Denominational', value: '33' },
        { label: 'North American Baptist', value: '34' },
        { label: 'Original Free Will Baptist', value: '35' },
        { label: 'Other Protestant', value: '36' },
        { label: 'Pentecostal Holiness', value: '37' },
        { label: 'Plymouth Brethren', value: '38' },
        { label: 'Presbyterian', value: '39' },
        { label: 'Protestant Episcopal', value: '40' },
        { label: 'Reformed Church in America', value: '41' },
        { label: 'Reformed Presbyterian', value: '42' },
        { label: 'Roman Catholic', value: '43' },
        { label: 'Seventh Day Adventist', value: '44' },
        { label: 'Southern Baptist', value: '45' },
        { label: 'Church of Jesus Christ of Latter-Day Saints', value: '46' },
        { label: 'Undenominational', value: '47' },
        { label: 'Unitarian Universalist', value: '48' },
        { label: 'United Brethren', value: '49' },
        { label: 'United Methodist', value: '50' },
        { label: 'Wesleyan', value: '51' },
        { label: 'Wisconsin Evangelical Lutheran', value: '52' },
    ];

    const sizeData = [
        { label: 'Small', value: '1' },
        { label: 'Medium', value: '2' },
        { label: 'Large', value: '3' },
        { label: 'N/A', value: '4' },
    ];

    const typeOfAreaData = [
        { label: 'City: Small', value: '1' },
        { label: 'City: Midsize', value: '2' },
        { label: 'City: Large', value: '3' },
        { label: 'Suburb: Small', value: '4' },
        { label: 'Suburb: Midsize', value: '5' },
        { label: 'Suburb: Large', value: '6' },
        { label: 'Rural: Fringe', value: '7' },
        { label: 'Rural: Distant', value: '8' },
        { label: 'Town: Fringe', value: '9' },
        { label: 'Town: Distant', value: '10' },
        { label: 'N/A', value: '11' },
    ];

    const [gpa, setGpa] = useState('');
    const [satScore, setSatScore] = useState('');
    const [actScore, setActScore] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const renderPageOne = () => (
        <View>
            <Text style={[styles.text, {color: theme.color}]}>What is your GPA?</Text>
            <TextInput
                style={[styles.textInput, {borderColor: theme.color}]}
                value={gpa}
                onChangeText={setGpa}
                placeholder='Ex: 3.6...'
            />

            <Text style={[styles.text, {color: theme.color}]}>How far from home do you want your college to be?</Text>
            <DropdownComponent data={distanceData} />

            <Text style={[styles.text, {color: theme.color}]}>What do you plan to study?</Text>
            <DropdownComponent data={majorData} />

            <Text style={[styles.text, {color: theme.color}]}>How much are you willing to pay for tuition?</Text>
            <DropdownComponent data={tuitionData} />

            <Text style={[styles.text, {color: theme.color}]}>SAT score?</Text>
            <TextInput
                style={[styles.textInput, {borderColor: theme.color}]}
                value={satScore}
                onChangeText={setSatScore}
                placeholder='Ex: 1200...'
            />

            <Text style={[styles.text, {color: theme.color}]}>ACT score?</Text>
            <TextInput
                style={[styles.textInput, {borderColor: theme.color}]}
                value={actScore}
                onChangeText={setActScore}
                placeholder='Ex: 25...'
            />
        </View>
    );

    const renderPageTwo = () => (
        <View>
            <Text style={[styles.text, {color: theme.color}]}>Do you wish to attend a college of a specific religious affiliation?</Text>
            <DropdownComponent data={religiousAffiliationData} />

            <Text style={[styles.text, {color: theme.color}]}>Are you looking for a school with sporting events?</Text>
            <DropdownComponent data={[
                { label: 'Yes', value: '1' },
                { label: 'No', value: '2' },
            ]} />

            <Text style={[styles.text, {color: theme.color}]}>Are you looking to attend college in a specific state?</Text>
            <DropdownComponent data={stateData} />

            <Text style={[styles.text, {color: theme.color}]}>Are you looking for a diverse college?</Text>
            <DropdownComponent data={[
                { label: 'Neutral', value: '1' },
                { label: 'Important', value: '2' },
                { label: 'Very Important', value: '3' },
            ]} />

            <Text style={[styles.text, {color: theme.color}]}>What size college are you looking for?</Text>
            <DropdownComponent data={sizeData} />
        </View>
    );

    const renderPageThree = () => (
        <View>
            <Text style={[styles.text, {color: theme.color}]}>Are you looking for a Public or Private college?</Text>
            <DropdownComponent data={[
                { label: 'Public', value: '1' },
                { label: 'Private', value: '2' },
            ]} />

            <Text style={[styles.text, {color: theme.color}]}>Are you looking for a college in a specific type of area?</Text>
            <DropdownComponent data={typeOfAreaData} />

            <View style={styles.buttonContainer}>
                <Button
                    onPress={() => 
                        {
                            navigation.navigate('Home');
                            setCurrentPage(1);
                        }}
                    title="Submit"
                />
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <SafeAreaView>
                {currentPage === 1 && renderPageOne()}
                {currentPage === 2 && renderPageTwo()}
                {currentPage === 3 && renderPageThree()}
                <View style={styles.buttonContainer}>
                    
                    {currentPage < 3 && (
                        <Button
                            style={styles.button}
                            onPress={() => setCurrentPage(currentPage + 1)}
                            title="Next"
                        />
                    )}
                    {currentPage > 1 && (
                        <Button
                            style={styles.button}
                            onPress={() => setCurrentPage(currentPage - 1)}
                            title="Back"
                        />
                    )}
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

export default Quiz

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16
    },
    textInput: {
        height: 40,
        borderWidth: 1,
        fontSize: 18,
        padding: 10,
        marginVertical: 10,
    },
    text: {
        fontSize: 18,
        paddingVertical: 10,
    },
    buttonContainer: {
        paddingTop: 30,
        margin:10
    },
    button: {
        marginTop:20
    }
});
