import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import DropdownComponent from '../components/DropdownComp'
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext'
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, addDoc, getDocs, doc, setDoc ,query, where,  getFirestore} from 'firebase/firestore';
import matchColleges from '../src/utils/matchingAlgorithm';

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
        { label: 'Aerospace Engineering', value: 'Aerospace Engineering' , categories:['EngineeringDegrees'] },
        { label: 'Accounting', value: 'Accounting' , categories: ['BusinessManagmentMarketingDegrees']},
        { label: 'Agriculture', value: 'Agriculture', categories: ['AgriculturalDegrees'] },
        { label: 'Architecture', value: 'Architecture',  categories:['ArchitectureDegrees']},
        { label: 'Biology', value: 'Biology', categories:['Biological_and_BiomedicalSciencesDegrees'] },
        { label: 'Biomedical Engineering', value: 'Biomedical Engineering', categories:['Biological_and_BiomedicalSciencesDegrees']},
        { label: 'Biomedical Science', value: 'Biomedical Science', categories:['Biological_and_BiomedicalSciencesDegrees'] },
        { label: 'Business Administration', value: 'Business Administration',categories: ['BusinessManagmentMarketingDegrees'] },
        { label: 'Business Management', value: 'Business Management', categories: ['BusinessManagmentMarketingDegrees'] },
        { label: 'Civil Engineering', value: 'Civil Engineering', categories:['EngineeringDegrees'] },
        { label: 'Chemical Engineering', value: 'Chemical Engineering', categories:['EngineeringDegrees'] },
        { label: 'Chemistry', value: 'Chemistry', categories: ['PhysicalSciencesDegrees'] },
        { label: 'Communications', value: 'Communication', categories:['CommunicationTechnologiesDegrees' ] },
        { label: 'Communication Technology', value: 'Communication Technology', categories:['CommunicationTechnologiesDegrees'] },
        { label: 'Computer Information Systems', value: ['Computer Information Systems' ] },
        { label: 'Computer Engineering', value: 'Computer Engineering', categories:['Computer_and_ComputerInfoScienciesDegrees']},
        { label: 'Computer Science', value: 'Computer Science' , categories:['Computer_and_ComputerInfoScienciesDegrees']},
        { label: 'Construction Management', value: 'Construction Management' , categories:['ConstructionTradesDegrees']},
        { label: 'Construction Trades', value: 'Construction Trades' , categories:['ConstructionTradesDegrees']},
        { label: 'Criminal Justice', value: 'Criminal Justice' , categories:['LegalStudiesDegrees']},
        { label: 'Culinary', value: 'Culinary' , categories:['CulinaryDegrees']},
        { label: 'Ecology', value: 'Ecology' , categories: ['Biological_and_BiomedicalSciencesDegrees']},
        { label: 'Economics', value: 'Economics' , categories:['BusinessManagmentMarketingDegrees']},
        { label: 'Education', value: 'Education' , categories:['EducationsDegrees']},
        { label: 'Engineering Technologies', value: 'Engineering Technology', categories:['EngineeringDegrees'] },
        { label: 'Electrical Engineering', value: 'Electrical Engineering', categories:['EngineeringDegrees'] },
        { label: 'English', value: 'English' , categories:['EnglishDegrees']},
        { label: 'Entrepreneurship', value: 'Entrepreneurship' , categories:['BusinessManagmentMarketingDegrees']},
        { label: 'Environmental Engineering', value: 'Environmental Engineering', categories: ['EngineeringDegrees']},
        { label: 'Environmental Protections', value: 'Environmental Protections', categories: ['naturalResourceAndConservationDegrees'] },
        { label: 'Environmental Sciences', value: 'Environmental Sciences', categories:['naturalResourceAndConservationDegrees']},
        { label: 'Ethnic Studies', value: 'Ethnic Studies' , categories:['Ethinc_Cultural_GenderStudiesDegrees']},
        { label: 'Fashion', value: 'Fashion', categories: ['Visual_and_PerformingArtsDegrees', 'Communication_and_JournalismDegrees']},
        { label: 'Finance', value: 'Finance' , categories:['BusinessManagmentMarketingDegrees']},
        { label: 'Fitness Studies', value: 'Fitness Studies' , categories:['Parks_Recreation_Leisure_and_FitnessStudiesDegrees']},
        { label: 'Foreign Language', value: 'Foreign Language', categories:['ForeignLanguagesDegrees']},
        { label: 'Forestry', value: 'Forestry' , categories:['naturalResourceAndConservationDegrees']},
        { label: 'General Studies', value: 'General Studies' , categories:['LiberalArts_and_GeneralStudiesDegrees']},
        { label: 'History', value: 'History' , categories:['HistoryDegrees']},
        { label: 'Human Resources', value: 'Human Resources' , categories:['BusinessManagmentMarketingDegrees']},
        { label: 'Human Sciences', value: 'Human Sciences', categories:['HumanSciencesDegrees']},
        { label: 'Industrial Engineering', value: 'Industrial Engineering' , categories:['EngineeringDegrees']},
        { label: 'Interdisciplinary Studies', value: 'Interdisciplinary Studies' , categories:['Multi_InterdisciplinaryStudiesDegrees']},
        { label: 'Journalism', value: 'Journalism' , categories:['Communication_and_JournalismDegrees']},
        { label: 'Legal Studies', value: 'Legal Studies' , categories:['LegalStudiesDegrees']},
        { label: 'Liberal Arts', value: 'Liberal Arts' , categories:['LiberalArts_and_GeneralStudiesDegrees']},
        { label: 'Marketing', value: 'Marketing' , categories:['BusinessManagmentMarketingDegrees']},
        { label: 'Mathematics', value: 'Mathematics' , categories:['Math_and_StatsDegrees']},
        { label: 'Mechanic and Repair Technologies', value: 'Mechanic and Repair Technologies' , categories:['Mechanic_and_RepairTechnologiesDegrees']},
        { label: 'Mechanical Engineering', value: 'Mechanical Engineering', categories:['EngineeringDegrees'] },
        { label: 'Multidisciplinary Studies', value: 'Multidisciplinary Studies' , categories:['Multi_InterdisciplinaryStudiesDegrees']},
        { label: 'Musical Studies', value: 'Musical Studies' , categories:['Visual_and_PerformingArtsDegrees']},
        { label: 'Natural Resource Management', value: 'Natural Resource Management' , categories:['naturalResourceAndConservationDegrees']},
        { label: 'Performing Arts', value: 'Performing Arts' , categories:['Visual_and_PerformingArtsDegrees']},
        { label: 'Philosophy', value: 'Philosophy' , categories:['Philosophy_and_ReligiousStudiesDegrees', 'Theology_and_ReligiousVocationsDegrees']},
        { label: 'Psychology', value: 'Psychology' , categories:['PsychologyDegrees']},
        { label: 'Physical Sciences', value: 'Physical Sciences', categories: ['PhysicalSciencesDegrees']},
        { label: 'Political Science', value: 'Political Science', categories: ['SocialSciencesDegrees']},
        { label: 'Precision Production', value: 'Precision Production' , categories:['PrecisionProductionDegrees']},
        { label: 'Protective Services', value: 'Protective Services' , categories:['HomelandSecurity_LawEnforcement_Firefighting_and_RelatedProtectiveServicesDegrees']},
        { label: 'Public Administration', value: 'Public Administration', categories: ['PublicAdmin_and_SocialServiceDegrees']},
        { label: 'Religious Studies', value: 'Religious Studies' , categories:['Philosophy_and_ReligiousStudiesDegrees']},
        { label: 'Religious Vocations', value: 'Religious Vocations' , categories:['Philosophy_and_ReligiousStudiesDegrees']},
        { label: 'Social Services', value: 'Social Services' , categories:['PublicAdmin_and_SocialServiceDegrees']},
        { label: 'Social Sciences', value: 'Social Sciences', categories: ['SocialSciencesDegrees']},
        { label: 'Sociology', value: 'Sociology' , categories:['SocialSciencesDegrees']},
        { label: 'Statistics', value: 'Statistics' , categories:['Math_and_StatsDegrees']},
        { label: 'Supply Chain', value: 'Supply Chain' , categories:['BusinessManagmentMarketingDegrees']},
        { label: 'Theology', value: 'Theology' , categories:['Theology_and_ReligiousVocationsDegrees', 'Philosophy_and_ReligiousStudiesDegrees']},
        { label: 'Visual Arts', value: 'Visual Arts' , categories:['Visual_and_PerformingArtsDegrees']},
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

    

    const handleSubmit = async () => {
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
            categories: majorData.find(entry =>entry.label == major).categories,
            userId: auth().currentUser.uid
        }

        const result = ( await matchColleges(answers)).top100Colleges;
        navigation.navigate("Results", {top100: result});
        alert("Quiz submitted successfully!");
            
        
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
