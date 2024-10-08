import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import DropdownComponent from '../components/DropdownComp';
import {SafeAreaView} from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, addDoc, getDocs, doc, query, deleteDoc, where, setDoc , getFirestore} from 'firebase/firestore';
import matchColleges from '../src/utils/matchingAlgorithm';
import majorData from '../assets/major_data';
import { UserContext } from '../components/UserContext';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import stateData from '../assets/state_data';
import { handleReport } from '../src/utils/reportUtils';

const firestore = getFirestore(db);

const Quiz = ({navigation}) => {
  const theme = useContext(themeContext);

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

    const [currentPage, setCurrentPage] = useState(1);
    const [address, setAddress] = useState('');
    const [gpa, setGpa] = useState('');
    const [satScore, setSatScore] = useState('');
    const [actScore, setActScore] = useState('');
    const [stateChoice, setState] = useState('');
    const [major, setMajor] = useState('');
    const [distanceFromCollege, setDistance] = useState('');
    const [tuitionCost, setTuition] = useState('');
    const [religiousAffiliation, setReligiousAffil] = useState('');
    const [size, setSize] = useState('');
    const [urbanizationLevel, setTypeOfArea] = useState('');
    const [sportCollege, setSportEvents] = useState('');
    const [collegeDiversity, setDiverse] = useState('');
    const [schoolClassification, setType] = useState('');


    const collectionref = collection(firestore, 'Quiz');

    const handleSubmit = async () => {
        const answers = {
            address: address,
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
            userId: auth().currentUser.uid,
        };
          const deleteItem = async(uid) => {
              const quizesRef = collection(firestore, 'Quiz');
              const q = query(quizesRef, where('userId', '==', uid));
              const querySnapshot = await getDocs(q);
              //onst quizCount = await querySnapshot.count;
              //console.log(quizCount);
              try{
              if (!querySnapshot.empty) {
                  const userDoc = querySnapshot.docs[0];
                  const userData = userDoc.data();
                  deleteDoc(userDoc.ref)
                   } else {
                       //console.error('No user found with the given UID.');
                   }
               } catch (error) {
                   console.error('Error deleting repeat quiz:', error);
               }
           };
       await deleteItem(auth().currentUser.uid);

        try {
            await addDoc(collectionref, answers);
            alert('Quiz submitted successfully!');
        } catch (error) {
            console.error('Error adding document: ', error);
        }

        const result = (await matchColleges(answers)).top5Colleges;
        navigation.navigate('Results', { top5: result });
    };

    const renderPageOne = () => (
        <View>
            <Text style={[styles.text, { color: theme.color }]}>What is your address?</Text>
            <View style={{ zIndex: 10, elevation: 10 }}>
                <GooglePlacesAutocomplete
                    placeholder="123 Main St..."
                    onPress={(data, details = null) => {
                        setAddress(data.description);
                    }}
                    textInputProps={{
                        value: address,
                        onChangeText: (text) => setAddress(text),
                    }}
                    query={{
                        key: 'AIzaSyB_0VYgSr15VoeppmqLur_6LeHHxU0q0NI',
                        language: 'en',
                    }}
                    styles={{
                        textInput: {
                            height: 40,
                            borderWidth: 1,
                            fontSize: 18,
                            padding: 10,
                            marginVertical: 10,
                            borderColor: theme.color,
                        },
                        listView: {
                            backgroundColor: theme.background,
                            position: 'absolute',
                            top: 50,
                            zIndex: 10,
                            elevation: 10,
                        },
                    }}
                />
            </View>

            <Text style={[styles.text, { color: theme.color }]}>How far from home do you want your college to be?</Text>
            <DropdownComponent data={distanceData} value={distanceFromCollege} onChange={setDistance} />

            <Text style={[styles.text, { color: theme.color }]}>What do you plan to study?</Text>
            <DropdownComponent data={majorData} value={major} onChange={setMajor} />

            <Text style={[styles.text, { color: theme.color }]}>How much are you willing to pay for tuition?</Text>
            <DropdownComponent data={tuitionData} value={tuitionCost} onChange={setTuition} />

            <Text style={[styles.text, { color: theme.color }]}>SAT score?</Text>
            <TextInput
                style={[styles.textInput, { borderColor: theme.color }]}
                value={satScore}
                onChangeText={setSatScore}
                placeholder="Ex: 1200..."
            />

            <Text style={[styles.text, { color: theme.color }]}>ACT score?</Text>
            <TextInput
                style={[styles.textInput, { borderColor: theme.color }]}
                value={actScore}
                onChangeText={setActScore}
                placeholder="Ex: 25..."
            />
        </View>
    );

    const renderPageTwo = () => (
        <View>
            <Text style={[styles.text, { color: theme.color }]}>What is your GPA?</Text>
            <TextInput
                style={[styles.textInput, { borderColor: theme.color }]}
                value={gpa}
                onChangeText={setGpa}
                placeholder='Ex: 3.6...'
            />

            <Text style={[styles.text, { color: theme.color }]}>Do you wish to attend a college of a specific religious affiliation?</Text>
            <DropdownComponent data={religiousAffiliationData} value={religiousAffiliation} onChange={setReligiousAffil} />

            <Text style={[styles.text, { color: theme.color }]}>Are you looking for a school with sporting events?</Text>
            <DropdownComponent data={[
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
            ]}
                value={sportCollege}
                onChange={setSportEvents}
            />

            <Text style={[styles.text, { color: theme.color }]}>Are you looking to attend college in a specific state?</Text>
            <DropdownComponent data={stateData} value={stateChoice} onChange={setState} />

            <Text style={[styles.text, { color: theme.color }]}>Are you looking for a diverse college?</Text>
            <DropdownComponent data={[
                { label: 'Neutral', value: 'Neutral' },
                { label: 'Important', value: 'Important' },
                { label: 'Very Important', value: 'Very Important' },
            ]}
                value={collegeDiversity}
                onChange={setDiverse}
            />
        </View>
    );


    const renderPageThree = () => (
        <View>
            <Text style={[styles.text, { color: theme.color }]}>What size college are you looking for?</Text>
            <DropdownComponent data={sizeData} value={size} onChange={setSize} />

            <Text style={[styles.text, { color: theme.color }]}>Are you looking for a Public or Private college?</Text>
            <DropdownComponent data={[
                { label: 'Public', value: 'Public' },
                { label: 'Private', value: 'Private' },
            ]}
                value={schoolClassification}
                onChange={setType}
            />

            <Text style={[styles.text, { color: theme.color }]}>Are you looking for a college in a specific type of area?</Text>
            <DropdownComponent data={typeOfAreaData} value={urbanizationLevel} onChange={setTypeOfArea} />

            <View style={styles.buttonContainer}>
                <Button
                    onPress={handleSubmit}
                    title="Submit"
                />
            </View>
        </View>
    );

    const renderContent = () => {
        if (currentPage === 1) return renderPageOne();
        if (currentPage === 2) return renderPageTwo();
        if (currentPage === 3) return renderPageThree();
    };

  return (
    <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={[{key: 'quizContent'}]}
          renderItem={renderContent}
          keyExtractor={item => item.key}
          ListFooterComponent={() => (
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
          )}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
   </ImageBackground>
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
    color: 'white',
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
  background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
});
