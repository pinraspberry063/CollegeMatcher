import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import DropdownComponent from '../components/DropdownComp';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';

const Quiz = ({ navigation }) => {
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
        { label: 'Town: Fringe', value: 'Town: Fringe' },
        { label: 'Town: Distant', value: 'Town: Distant' },
        { label: 'N/A', value: 'N/A' },
    ];

    const [gpa, setGpa] = useState('');
    const [satScore, setSatScore] = useState('');
    const [actScore, setActScore] = useState('');
    const [distanceFromCollege, setDistanceFromCollege] = useState('');
    const [major, setMajor] = useState('');
    const [tuitionCost, setTuitionCost] = useState('');
    const [religiousAffiliation, setReligiousAffiliation] = useState('');
    const [sportCollege, setSportCollege] = useState('');
    const [stateChoice, setStateChoice] = useState('');
    const [collegeDiversity, setCollegeDiversity] = useState('');
    const [size, setSize] = useState('');
    const [schoolClassification, setSchoolClassification] = useState('');
    const [urbanizationLevel, setUrbanizationLevel] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const collectionRef = collection(db, 'Quiz');
    useEffect(() => {
        const saveCurrentPageData = async () => {
            const docRef = await addDoc(collectionRef, {
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
            })

            //await setDoc(docRef, currentData, { merge: true });
        }

        if (currentPage > 1) {
            saveCurrentPageData();
        }
    }, [currentPage]);

    const handleSubmit = async () => {
        try {
            const querySnapshot = await getDocs(collectionRef);
            const docCount = querySnapshot.size;
            const newDocId = `user${docCount + 1}`;

            await addDoc(collectionRef, {
                gpa,
                distance_from_college: distanceFromCollege,
                major,
                tuition_cost: tuitionCost,
                sat: satScore,
                act: actScore,
                religious_affiliation: religiousAffiliation,
                sport_college: sportCollege,
                state_choice: stateChoice,
                college_diversity: collegeDiversity,
                size,
                school_classification: schoolClassification,
                urbanization_level: urbanizationLevel,
                userId: newDocId
            });
            alert("Quiz submitted successfully!");
            navigation.pop();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const renderPageOne = () => (
        <View>
            <Text style={styles.text}>What is your GPA?</Text>
            <TextInput
                style={styles.textInput}
                value={gpa}
                onChangeText={setGpa}
                placeholder='Ex: 3.6...'
            />

            <Text style={styles.text}>How far from home do you want your college to be?</Text>
            <DropdownComponent data={distanceData} value={distanceFromCollege} onChange={setDistanceFromCollege} />

            <Text style={styles.text}>What do you plan to study?</Text>
            <DropdownComponent data={majorData} value={major} onChange={setMajor} />

            <Text style={styles.text}>How much are you willing to pay for tuition?</Text>
            <DropdownComponent data={tuitionData} value={tuitionCost} onChange={setTuitionCost} />

            <Text style={styles.text}>SAT score?</Text>
            <TextInput
                style={styles.textInput}
                value={satScore}
                onChangeText={setSatScore}
                placeholder='Ex: 1200...'
            />

            <Text style={styles.text}>ACT score?</Text>
            <TextInput
                style={styles.textInput}
                value={actScore}
                onChangeText={setActScore}
                placeholder='Ex: 25...'
            />
        </View>
    );

    const renderPageTwo = () => (
        <View>
            <Text style={styles.text}>Do you wish to attend a college of a specific religious affiliation?</Text>
            <DropdownComponent data={religiousAffiliationData} value={religiousAffiliation} onChange={setReligiousAffiliation} />

            <Text style={styles.text}>Are you looking for a school with sporting events?</Text>
            <DropdownComponent data={[
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
            ]} value={sportCollege} onChange={setSportCollege} />

            <Text style={styles.text}>Are you looking to attend college in a specific state?</Text>
            <DropdownComponent data={stateData} value={stateChoice} onChange={setStateChoice} />

            <Text style={styles.text}>Are you looking for a diverse college?</Text>
            <DropdownComponent data={[
                { label: 'Neutral', value: 'Neutral' },
                { label: 'Important', value: 'Important' },
                { label: 'Very Important', value: 'Very Important' },
            ]} value={collegeDiversity} onChange={setCollegeDiversity} />

            <Text style={styles.text}>What size college are you looking for?</Text>
            <DropdownComponent data={sizeData} value={size} onChange={setSize} />
        </View>
    );

    const renderPageThree = () => (
        <View>
            <Text style={styles.text}>Are you looking for a Public or Private college?</Text>
            <DropdownComponent data={[
                { label: 'Public', value: 'Public' },
                { label: 'Private', value: 'Private' },
            ]} value={schoolClassification} onChange={setSchoolClassification} />

            <Text style={styles.text}>Are you looking for a college in a specific type of area?</Text>
            <DropdownComponent data={typeOfAreaData} value={urbanizationLevel} onChange={setUrbanizationLevel} />

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
                    {currentPage > 1 && (
                        <Button
                            style={styles.button}
                            onPress={() => setCurrentPage(currentPage - 1)}
                            title="Back"
                        />
                    )}
                    {currentPage < 3 && (
                        <Button
                            style={styles.button}
                            onPress={() => setCurrentPage(currentPage + 1)}
                            title="Next"
                        />
                    )}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default Quiz;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
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
        margin: 10,
    },
    button: {
        marginTop: 20,
    },
});