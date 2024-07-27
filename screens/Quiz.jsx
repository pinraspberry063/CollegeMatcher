import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import DropdownComponent from '../components/DropdownComp'
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext'
import {db} from '../config/firebaseConfig';
import { collection, addDoc, getDocs, doc, setDoc , getFirestore} from 'firebase/firestore';
import matchColleges from '../src/utils/matchingAlgorithm';
// import matchColleges from '../utils/matchingAlgorithm';

const firestore = getFirestore(db);
const Quiz = ({ navigation }) => {
    const theme = useContext(themeContext);
    const stateData = [
        { label: 'Alabama', value: 'Alabama' },
        { label: 'Alaska', value: 'Alaska' },
        { label: 'Arizona', value: 'Arizona' },
        { label: 'Arkansas', value: 'Arkansas' },
        { label: 'California', value: 'California' },
        { label: 'Colorado', value: 'Colorado' },
        { label: 'Connecticut', value: 'Connecticut' },
        { label: 'Delaware', value: 'Delaware' },
        { label: 'Florida', value: 'Florida' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Hawaii', value: 'Hawaii' },
        { label: 'Idaho', value: 'Idaho' },
        { label: 'Illinois', value: 'Illinois' },
        { label: 'Indiana', value: 'Indiana' },
        { label: 'Iowa', value: 'Iowa' },
        { label: 'Kansas', value: 'Kansas' },
        { label: 'Kentucky', value: 'Kentucky' },
        { label: 'Louisiana', value: 'Louisiana' },
        { label: 'Maine', value: 'Maine' },
        { label: 'Maryland', value: 'Maryland' },
        { label: 'Massachusetts', value: 'Massachusetts' },
        { label: 'Michigan', value: 'Michigan' },
        { label: 'Minnesota', value: 'Minnesota' },
        { label: 'Mississippi', value: 'Mississippi' },
        { label: 'Missouri', value: 'Missouri' },
        { label: 'Montana', value: 'Montana' },
        { label: 'Nebraska', value: 'Nebraska' },
        { label: 'Nevada', value: 'Nevada' },
        { label: 'New Hampshire', value: 'New Hampshire' },
        { label: 'New Jersey', value: 'New Jersey' },
        { label: 'New Mexico', value: 'New Mexico' },
        { label: 'New York', value: 'New York' },
        { label: 'North Carolina', value: 'North Carolina' },
        { label: 'North Dakota', value: 'North Dakota' },
        { label: 'Ohio', value: 'Ohio' },
        { label: 'Oklahoma', value: 'Oklahoma' },
        { label: 'Oregon', value: 'Oregon' },
        { label: 'Pennsylvania', value: 'Pennsylvania' },
        { label: 'Rhode Island', value: 'Rhode Island' },
        { label: 'South Carolina', value: 'South Carolina' },
        { label: 'South Dakota', value: 'South Dakota' },
        { label: 'Tennessee', value: 'Tennessee' },
        { label: 'Texas', value: 'Texas' },
        { label: 'Utah', value: 'Utah' },
        { label: 'Vermont', value: 'Vermont' },
        { label: 'Virginia', value: 'Virginia' },
        { label: 'Washington', value: 'Washington' },
        { label: 'West Virginia', value: 'West Virginia' },
        { label: 'Wisconsin', value: 'Wisconsin' },
        { label: 'Wyoming', value: 'Wyoming' },
        { label: 'Puerto Rico', value: 'Puerto Rico' },
    ];

    const majorData = [
        { label: 'Aerospace Engineering', value: 'Aerospace Engineering' },
        { label: 'Accounting', value: 'Accounting' },
        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Architecture', value: 'Architecture' },
        { label: 'Biology', value: 'Biology' },
        { label: 'Biomedical Engineering', value: 'Biomedical Engineering' },
        { label: 'Biomedical Science', value: 'Biomedical Science' },
        { label: 'Business Administration', value: 'Business Administration' },
        { label: 'Business Management', value: 'Business Management' },
        { label: 'Civil Engineering', value: 'Civil Engineering' },
        { label: 'Chemical Engineering', value: 'Chemical Engineering' },
        { label: 'Chemistry', value: 'Chemistry' },
        { label: 'Communications', value: 'Communication' },
        { label: 'Communication Technology', value: 'Communication Technology' },
        { label: 'Computer Information Systems', value: 'Computer Information Systems' },
        { label: 'Computer Engineering', value: 'Computer Engineering' },
        { label: 'Computer Science', value: 'Computer Science' },
        { label: 'Construction Management', value: 'Construction Management' },
        { label: 'Construction Trades', value: 'Construction Trades' },
        { label: 'Criminal Justice', value: 'Criminal Justice' },
        { label: 'Culinary', value: 'Culinary' },
        { label: 'Ecology', value: 'Ecology' },
        { label: 'Economics', value: 'Economics' },
        { label: 'Education', value: 'Education' },
        { label: 'Engineering Technologies', value: 'Engineering Technology' },
        { label: 'Electrical Engineering', value: 'Electrical Engineering' },
        { label: 'English', value: 'English' },
        { label: 'Entrepreneurship', value: 'Entrepreneurship' },
        { label: 'Environmental Engineering', value: 'Environmental Engineering' },
        { label: 'Environmental Protections', value: 'Environmental Protections' },
        { label: 'Environmental Sciences', value: 'Environmental Sciences' },
        { label: 'Ethnic Studies', value: 'Ethnic Studies' },
        { label: 'Fashion', value: 'Fashion' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Fitness Studies', value: 'Fitness Studies' },
        { label: 'Foreign Language', value: 'Foreign Language' },
        { label: 'Forestry', value: 'Forestry' },
        { label: 'General Studies', value: 'General Studies' },
        { label: 'History', value: 'History' },
        { label: 'Human Resources', value: 'Human Resources' },
        { label: 'Human Sciences', value: 'Human Sciences' },
        { label: 'Industrial Engineering', value: 'Industrial Engineering' },
        { label: 'Interdisciplinary Studies', value: 'Interdisciplinary Studies' },
        { label: 'Journalism', value: 'Journalism' },
        { label: 'Legal Studies', value: 'Legal Studies' },
        { label: 'Liberal Arts', value: 'Liberal Arts' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Mathematics', value: 'Mathematics' },
        { label: 'Mechanic and Repair Technologies', value: 'Mechanic and Repair Technologies' },
        { label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
        { label: 'Multidisciplinary Studies', value: 'Multidisciplinary Studies' },
        { label: 'Musical Studies', value: 'Musical Studies' },
        { label: 'Natural Resource Management', value: 'Natural Resource Management' },
        { label: 'Performing Arts', value: 'Performing Arts' },
        { label: 'Philosophy', value: 'Philosophy' },
        { label: 'Psychology', value: 'Psychology' },
        { label: 'Physical Sciences', value: 'Physical Sciences' },
        { label: 'Political Science', value: 'Political Science' },
        { label: 'Precision Production', value: 'Precision Production' },
        { label: 'Protective Services', value: 'Protective Services' },
        { label: 'Public Administration', value: 'Public Administration' },
        { label: 'Religious Studies', value: 'Religious Studies' },
        { label: 'Religious Vocations', value: 'Religious Vocations' },
        { label: 'Social Services', value: 'Social Services' },
        { label: 'Social Sciences', value: 'Social Sciences' },
        { label: 'Sociology', value: 'Sociology' },
        { label: 'Statistics', value: 'Statistics' },
        { label: 'Supply Chain', value: 'Supply Chain' },
        { label: 'Theology', value: 'Theology' },
        { label: 'Visual Arts', value: 'Visual Arts' },
    ];

    const distanceData = [
        { label: '0-50 miles', value: '0-50 miles' },
        { label: '50-200 miles', value: '50-200 miles' },
        { label: '200-500 miles', value: '200-500 miles' },
        { label: '500+ miles', value: '500+ miles' },
    ];

    const tuitionData = [
        { label: '$0 - $10,000', value: '$0 - $10,000' },
        { label: '$10,000 - $20,000', value: '$10,000 - $20,000' },
        { label: '$20,000 - $30,000', value: '$20,000 - $30,000' },
        { label: '$30,000 - $40,000', value: '$30,000 - $40,000' },
        { label: '$40,000+', value: '$40,000+' },
    ];

    const religiousAffiliationData = [
        { label: 'N/A', value: 'N/A' },
        { label: 'American Methodist Episcopal', value: 'American Methodist Episcopal' },
        { label: 'African Methodist Episcopal Zion', value: 'African Methodist Episcopal Zion' },
        { label: 'American Baptist', value: 'American Baptist' },
        { label: 'American Evangelical Lutheran', value: 'American Evangelical Lutheran' },
        { label: 'Assemblies of God Church', value: 'Assemblies of God Church' },
        { label: 'Baptist', value: 'Baptist' },
        { label: 'Brethren Church', value: 'Brethren Church' },
        { label: 'Christ and Missionary Alliance', value: 'Christ and Missionary Alliance' },
        { label: 'Christian', value: 'Christian' },
        { label: 'Christian Methodist', value: 'Christian Methodist' },
        { label: 'Christian Reformed', value: 'Christian Reformed' },
        { label: 'Church of God', value: 'Church of God' },
        { label: 'Church of Nazarene', value: 'Church of Nazarene' },
        { label: 'Church of Christ', value: 'Church of Christ' },
        { label: 'Cumberland Presbyterian', value: 'Cumberland Presbyterian' },
        { label: 'Episcopal Reformed', value: 'Episcopal Reformed' },
        { label: 'Evangelical', value: 'Evangelical' },
        { label: 'Evangelical Covenant', value: 'Evangelical Covenant' },
        { label: 'Evangelical Free Church of American', value: 'Evangelical Free Church of American' },
        { label: 'Evangelical Lutheran', value: 'Evangelical Lutheran' },
        { label: 'Free Methodist', value: 'Free Methodist' },
        { label: 'Free Will Baptist', value: 'Free Will Baptist' },
        { label: 'General Baptist', value: 'General Baptist' },
        { label: 'Greek Orthodox', value: 'Greek Orthodox' },
        { label: 'Interdenominational', value: 'Interdenominational' },
        { label: 'Jewish', value: 'Jewish' },
        { label: 'Mennonite Brethren', value: 'Mennonite Brethren' },
        { label: 'Mennonite', value: 'Mennonite' },
        { label: 'Missionary', value: 'Missionary' },
        { label: 'Moravian', value: 'Moravian' },
        { label: 'Multiple Protestant Denomination', value: 'Multiple Protestant Denomination' },
        { label: 'Non-Denominational', value: 'Non-Denominational' },
        { label: 'North American Baptist', value: 'North American Baptist' },
        { label: 'Original Free Will Baptist', value: 'Original Free Will Baptist' },
        { label: 'Other Protestant', value: 'Other Protestant' },
        { label: 'Pentecostal Holiness', value: 'Pentecostal Holiness' },
        { label: 'Plymouth Brethren', value: 'Plymouth Brethren' },
        { label: 'Presbyterian', value: 'Presbyterian' },
        { label: 'Protestant Episcopal', value: 'Protestant Episcopal' },
        { label: 'Reformed Church in America', value: 'Reformed Church in America' },
        { label: 'Reformed Presbyterian', value: 'Reformed Presbyterian' },
        { label: 'Roman Catholic', value: 'Roman Catholic' },
        { label: 'Seventh Day Adventist', value: 'Seventh Day Adventist' },
        { label: 'Southern Baptist', value: 'Southern Baptist' },
        { label: 'Church of Jesus Christ of Latter-Day Saints', value: 'Church of Jesus Christ of Latter-Day Saints' },
        { label: 'Undenominational', value: 'Undenominational' },
        { label: 'Unitarian Universalist', value: 'Unitarian Universalist' },
        { label: 'United Brethren', value: 'United Brethren' },
        { label: 'United Methodist', value: 'United Methodist' },
        { label: 'Wesleyan', value: 'Wesleyan' },
        { label: 'Wisconsin Evangelical Lutheran', value: 'Wisconsin Evangelical Lutheran' },
    ];

    const sizeData = [
        { label: 'Small', value: 'Small' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Large', value: 'Large' },
        { label: 'N/A', value: 'N/A' },
    ];

    const typeOfAreaData = [
        { label: 'City: Small', value: 'City: Small' },
        { label: 'City: Midsize', value: 'City: Midsize' },
        { label: 'City: Large', value: 'City: Large' },
        { label: 'Suburb: Small', value: 'Suburb: Small' },
        { label: 'Suburb: Midsize', value: 'Suburb: Midsize' },
        { label: 'Suburb: Large', value: 'Suburb: Large' },
        { label: 'Rural: Fringe', value: 'Rural: Fringe' },
        { label: 'Rural: Distant', value: 'Rural: Distant' },
        { label: 'Rural: Remote', value: 'Rural: Remote' },
        { label: 'Town: Fringe', value: 'Town: Fringe' },
        { label: 'Town: Distant', value: 'Town: Distant' },
        { label: 'Town: Remote', value: 'Town: Remote' },
        { label: 'N/A', value: 'N/A' },
    ];

    const [gpa, setGpa] = useState('');
    const [satScore, setSatScore] = useState('');
    const [actScore, setActScore] = useState('');
    const [stateChoice, setstate] = useState('');
    const [major, setmajor] = useState('');
    const [distanceFromCollege, setdistance] = useState('');
    const [tuitionCost, settuition] = useState('');
    const [religiousAffiliation, setreligiousAffil] = useState('');
    const [size, setsize] = useState('');
    const [urbanizationLevel, settypeOfArea] = useState('');
    const [sportCollege, setsportEvents] = useState('');
    const [collegeDiversity, setdiverse] = useState('');
    const [schoolClassification, setType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const collectionref = collection(firestore, 'Quiz');

    const answers = {
        gpa: gpa,
        sat: satScore,
        act: actScore,
        distance_from_college: distanceFromCollege,
        major: major,
        tuition_cost: tuitionCost,
        religious_affiliation: religiousAffiliation,
        sport_college: sportCollege,
        state_choice: stateChoice,
        college_diversity: collegeDiversity,
        size: size,
        school_classification: schoolClassification,
        urbanization_level: urbanizationLevel,
        // userId: newDocId
    }

    const handleSubmit = async () => {
        try {
            // const querySnapshot = await getDocs(collectionref);
            // const docCount = querySnapshot.size;
            // const newDocId = `user${docCount + 1}`;

            await addDoc(collectionref, answers);
            alert("Quiz submitted successfully!");
            
        } catch (error) {
            console.error("Error adding document: ", error);
            
        }
        const results = matchColleges(answers);
        const top5 = results[0];
        const ID = results[1];
        navigation.push("Results", { top5: top5, ID: ID});
    };
    

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
            <DropdownComponent data={distanceData} value={distanceFromCollege} onChange={setdistance}/>

            <Text style={[styles.text, {color: theme.color}]}>What do you plan to study?</Text>
            <DropdownComponent data={majorData} value={major} onChange={setmajor} />

            <Text style={[styles.text, {color: theme.color}]}>How much are you willing to pay for tuition?</Text>
            <DropdownComponent data={tuitionData} value={tuitionCost} onChange={settuition} />

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
            <DropdownComponent data={religiousAffiliationData} value={religiousAffiliation} onChange={setreligiousAffil}/>

            <Text style={[styles.text, {color: theme.color}]}>Are you looking for a school with sporting events?</Text>
            <DropdownComponent data={[
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
                
            ]} 
            value={sportCollege}
            onChange={setsportEvents}
            />

            <Text style={[styles.text, {color: theme.color}]}>Are you looking to attend college in a specific state?</Text>
            <DropdownComponent data={stateData} value={stateChoice} onChange={setstate} />

            <Text style={[styles.text, {color: theme.color}]}>Are you looking for a diverse college?</Text>
            <DropdownComponent data={[
                { label: 'Neutral', value: 'Neutral' },
                { label: 'Important', value: 'Important' },
                { label: 'Very Important', value: 'Very Important' },
            ]}
            value={collegeDiversity}
            onChange={setdiverse}
            />

            <Text style={[styles.text, {color: theme.color}]}>What size college are you looking for?</Text>
            <DropdownComponent data={sizeData} value={size} onChange={setsize}/>
        </View>
    );

    const renderPageThree = () => (
        <View>
            <Text style={[styles.text, {color: theme.color}]}>Are you looking for a Public or Private college?</Text>
            <DropdownComponent data={[
                { label: 'Public', value: 'Public' },
                { label: 'Private', value: 'Private' },
            ]} 
            value={schoolClassification}
            onChange={setType}
            />

            <Text style={[styles.text, {color: theme.color}]}>Are you looking for a college in a specific type of area?</Text>
            <DropdownComponent data={typeOfAreaData} value={urbanizationLevel} onChange={settypeOfArea}/>

            <View style={styles.buttonContainer}>
                <Button
                    onPress={handleSubmit}
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
