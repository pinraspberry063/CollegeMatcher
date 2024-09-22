import {StyleSheet, Text, View, TextInput, Button, FlatList, TouchableWithoutFeedback, Keyboard,} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import DropdownComponent from '../components/DropdownComp';
import {SafeAreaView} from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import {collection, addDoc, getDocs, doc, setDoc, query, where, getFirestore,} from 'firebase/firestore';
import matchColleges from '../src/utils/matchingAlgorithm';
import majorData from '../assets/major_data';
import { Slider } from 'react-native-elements';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const firestore = getFirestore(db);

const Quiz = ({ navigation }) => {
  const theme = useContext(themeContext);

   const stateData = [
      {label: 'Alabama', value: 'Alabama'},
      {label: 'Alaska', value: 'Alaska'},
      {label: 'Arizona', value: 'Arizona'},
      {label: 'Arkansas', value: 'Arkansas'},
      {label: 'California', value: 'California'},
      {label: 'Colorado', value: 'Colorado'},
      {label: 'Connecticut', value: 'Connecticut'},
      {label: 'Delaware', value: 'Delaware'},
      {label: 'Florida', value: 'Florida'},
      {label: 'Georgia', value: 'Georgia'},
      {label: 'Hawaii', value: 'Hawaii'},
      {label: 'Idaho', value: 'Idaho'},
      {label: 'Illinois', value: 'Illinois'},
      {label: 'Indiana', value: 'Indiana'},
      {label: 'Iowa', value: 'Iowa'},
      {label: 'Kansas', value: 'Kansas'},
      {label: 'Kentucky', value: 'Kentucky'},
      {label: 'Louisiana', value: 'Louisiana'},
      {label: 'Maine', value: 'Maine'},
      {label: 'Maryland', value: 'Maryland'},
      {label: 'Massachusetts', value: 'Massachusetts'},
      {label: 'Michigan', value: 'Michigan'},
      {label: 'Minnesota', value: 'Minnesota'},
      {label: 'Mississippi', value: 'Mississippi'},
      {label: 'Missouri', value: 'Missouri'},
      {label: 'Montana', value: 'Montana'},
      {label: 'Nebraska', value: 'Nebraska'},
      {label: 'Nevada', value: 'Nevada'},
      {label: 'New Hampshire', value: 'New Hampshire'},
      {label: 'New Jersey', value: 'New Jersey'},
      {label: 'New Mexico', value: 'New Mexico'},
      {label: 'New York', value: 'New York'},
      {label: 'North Carolina', value: 'North Carolina'},
      {label: 'North Dakota', value: 'North Dakota'},
      {label: 'Ohio', value: 'Ohio'},
      {label: 'Oklahoma', value: 'Oklahoma'},
      {label: 'Oregon', value: 'Oregon'},
      {label: 'Pennsylvania', value: 'Pennsylvania'},
      {label: 'Rhode Island', value: 'Rhode Island'},
      {label: 'South Carolina', value: 'South Carolina'},
      {label: 'South Dakota', value: 'South Dakota'},
      {label: 'Tennessee', value: 'Tennessee'},
      {label: 'Texas', value: 'Texas'},
      {label: 'Utah', value: 'Utah'},
      {label: 'Vermont', value: 'Vermont'},
      {label: 'Virginia', value: 'Virginia'},
      {label: 'Washington', value: 'Washington'},
      {label: 'West Virginia', value: 'West Virginia'},
      {label: 'Wisconsin', value: 'Wisconsin'},
      {label: 'Wyoming', value: 'Wyoming'},
      {label: 'Puerto Rico', value: 'Puerto Rico'},
   ];

   const distanceData = [
      {label: '0-50 miles', value: '0-50 miles'},
      {label: '50-200 miles', value: '50-200 miles'},
      {label: '200-500 miles', value: '200-500 miles'},
      {label: '500+ miles', value: '500+ miles'},
   ];

   const tuitionData = [
      {label: '$0 - $10,000', value: '$0 - $10,000'},
      {label: '$10,000 - $20,000', value: '$10,000 - $20,000'},
      {label: '$20,000 - $30,000', value: '$20,000 - $30,000'},
      {label: '$30,000 - $40,000', value: '$30,000 - $40,000'},
      {label: '$40,000+', value: '$40,000+'},
   ];

   const religiousAffiliationData = [
      {label: 'N/A', value: 'N/A'},
      {label: 'American Methodist Episcopal', value: 'American Methodist Episcopal',},
      {label: 'African Methodist Episcopal Zion', value: 'African Methodist Episcopal Zion',},
      {label: 'American Baptist', value: 'American Baptist'},
      {label: 'American Evangelical Lutheran', value: 'American Evangelical Lutheran',},
      {label: 'Assemblies of God Church', value: 'Assemblies of God Church'},
      {label: 'Baptist', value: 'Baptist'},
      {label: 'Brethren Church', value: 'Brethren Church'},
      {label: 'Christ and Missionary Alliance', value: 'Christ and Missionary Alliance',},
      {label: 'Christian', value: 'Christian'},
      {label: 'Christian Methodist', value: 'Christian Methodist'},
      {label: 'Christian Reformed', value: 'Christian Reformed'},
      {label: 'Church of God', value: 'Church of God'},
      {label: 'Church of Nazarene', value: 'Church of Nazarene'},
      {label: 'Church of Christ', value: 'Church of Christ'},
      {label: 'Cumberland Presbyterian', value: 'Cumberland Presbyterian'},
      {label: 'Episcopal Reformed', value: 'Episcopal Reformed'},
      {label: 'Evangelical', value: 'Evangelical'},
      {label: 'Evangelical Covenant', value: 'Evangelical Covenant'},
      {label: 'Evangelical Free Church of American', value: 'Evangelical Free Church of American',},
      {label: 'Evangelical Lutheran', value: 'Evangelical Lutheran'},
      {label: 'Free Methodist', value: 'Free Methodist'},
      {label: 'Free Will Baptist', value: 'Free Will Baptist'},
      {label: 'General Baptist', value: 'General Baptist'},
      {label: 'Greek Orthodox', value: 'Greek Orthodox'},
      {label: 'Interdenominational', value: 'Interdenominational'},
      {label: 'Jewish', value: 'Jewish'},
      {label: 'Mennonite Brethren', value: 'Mennonite Brethren'},
      {label: 'Mennonite', value: 'Mennonite'},
      {label: 'Missionary', value: 'Missionary'},
      {label: 'Moravian', value: 'Moravian'},
      {label: 'Multiple Protestant Denomination', value: 'Multiple Protestant Denomination',},
      {label: 'Non-Denominational', value: 'Non-Denominational'},
      {label: 'North American Baptist', value: 'North American Baptist'},
      {label: 'Original Free Will Baptist', value: 'Original Free Will Baptist'},
      {label: 'Other Protestant', value: 'Other Protestant'},
      {label: 'Pentecostal Holiness', value: 'Pentecostal Holiness'},
      {label: 'Plymouth Brethren', value: 'Plymouth Brethren'},
      {label: 'Presbyterian', value: 'Presbyterian'},
      {label: 'Protestant Episcopal', value: 'Protestant Episcopal'},
      {label: 'Reformed Church in America', value: 'Reformed Church in America'},
      {label: 'Reformed Presbyterian', value: 'Reformed Presbyterian'},
      {label: 'Roman Catholic', value: 'Roman Catholic'},
      {label: 'Seventh Day Adventist', value: 'Seventh Day Adventist'},
      {label: 'Southern Baptist', value: 'Southern Baptist'},
      {label: 'Church of Jesus Christ of Latter-Day Saints', value: 'Church of Jesus Christ of Latter-Day Saints',},
      {label: 'Undenominational', value: 'Undenominational'},
      {label: 'Unitarian Universalist', value: 'Unitarian Universalist'},
      {label: 'United Brethren', value: 'United Brethren'},
      {label: 'United Methodist', value: 'United Methodist'},
      {label: 'Wesleyan', value: 'Wesleyan'},
      {label: 'Wisconsin Evangelical Lutheran', value: 'Wisconsin Evangelical Lutheran',},
   ];

   const sizeData = [
      {label: 'Small', value: 'Small'},
      {label: 'Medium', value: 'Medium'},
      {label: 'Large', value: 'Large'},
      {label: 'N/A', value: 'N/A'},
   ];

   const typeOfAreaData = [
      {label: 'City: Small', value: 'City: Small'},
      {label: 'City: Midsize', value: 'City: Midsize'},
      {label: 'City: Large', value: 'City: Large'},
      {label: 'Suburb: Small', value: 'Suburb: Small'},
      {label: 'Suburb: Midsize', value: 'Suburb: Midsize'},
      {label: 'Suburb: Large', value: 'Suburb: Large'},
      {label: 'Rural: Fringe', value: 'Rural: Fringe'},
      {label: 'Rural: Distant', value: 'Rural: Distant'},
      {label: 'Town: Fringe', value: 'Town: Fringe'},
      {label: 'Town: Distant', value: 'Town: Distant'},
      {label: 'N/A', value: 'N/A'},
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

  const [distanceImportance, setDistanceImportance] = useState(0.5);
  const [majorImportance, setMajorImportance] = useState(0.5);
  const [tuitionImportance, setTuitionImportance] = useState(0.5);
  const [religiousAffilImportance, setReligiousAffilImportance] = useState(0.5);
  const [sportEventsImportance, setSportEventsImportance] = useState(0.5);
  const [stateChoiceImportance, setStateChoiceImportance] = useState(0.5);
  const [diversityImportance, setDiversityImportance] = useState(0.5);
  const [sizeImportance, setSizeImportance] = useState(0.5);
  const [classificationImportance, setClassificationImportance] = useState(0.5);
  const [urbanizationImportance, setUrbanizationImportance] = useState(0.5);

  const handleSubmit = async () => {
    if (!address || !gpa || !major.length || !stateChoice.length || !distanceFromCollege || !tuitionCost || !religiousAffiliation || !sportCollege || !collegeDiversity || !size || !schoolClassification || !urbanizationLevel) {
      alert('Please fill out all required fields before submitting.');
      return;
    }

    const answers = {
      address,
      gpa,
      sat: satScore || 'N/A',
      act: actScore || 'N/A',
      distance_from_college: distanceFromCollege,
      distance_importance: distanceImportance,
      major,
      major_importance: majorImportance,
      tuition_cost: tuitionCost,
      tuition_importance: tuitionImportance,
      religious_affiliation: religiousAffiliation,
      religious_importance: religiousAffilImportance,
      sport_college: sportCollege,
      sport_importance: sportEventsImportance,
      state_choice: stateChoice,
      state_choice_importance: stateChoiceImportance,
      college_diversity: collegeDiversity,
      diversity_importance: diversityImportance,
      size,
      size_importance: sizeImportance,
      school_classification: schoolClassification,
      classification_importance: classificationImportance,
      urbanization_level: urbanizationLevel,
      urbanization_importance: urbanizationImportance,
      userId: auth().currentUser.uid,
    };

    try {
      await setDoc(doc(collectionref, auth().currentUser.uid), answers);
      const result = (await matchColleges(answers)).top100Colleges;
      navigation.navigate('QuizStack', { top100: result });
      alert('Quiz submitted successfully!');
    } catch (error) {
      console.error('Error submitting the quiz:', error);
      alert('There was an error submitting your quiz. Please try again.');
    }
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

      <Text style={[styles.text, { color: theme.color }]}>
        How far from home do you want your college to be?
      </Text>
      <DropdownComponent data={distanceData} value={distanceFromCollege} onChange={setDistance} />
      <Slider
        value={distanceImportance}
        onValueChange={setDistanceImportance}
        step={0.1}
        minimumValue={0}
        maximumValue={1}
        thumbTintColor="silver"
        minimumTrackTintColor="purple"
      />
      <View style={styles.sliderLabels}>
        <Text>Not Important</Text>
        <Text>Neutral</Text>
        <Text>Very Important</Text>
      </View>

      <Text style={[styles.text, { color: theme.color }]}>What do you plan to study?</Text>
      <DropdownComponent data={majorData} value={major} onChange={setMajor} multiSelect={true} />
      <Slider
        value={majorImportance}
        onValueChange={setMajorImportance}
        step={0.1}
        minimumValue={0}
        maximumValue={1}
        thumbTintColor="silver"
        minimumTrackTintColor="purple"
      />
      <View style={styles.sliderLabels}>
        <Text>Not Important</Text>
        <Text>Neutral</Text>
        <Text>Very Important</Text>
      </View>
    </View>
  );

  const renderPageTwo = () => (
    <View>
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

      <Text style={[styles.text, { color: theme.color }]}>
        How much are you willing to pay for tuition?
      </Text>
      <DropdownComponent data={tuitionData} value={tuitionCost} onChange={setTuition} />
      <Slider
        value={tuitionImportance}
        onValueChange={setTuitionImportance}
        step={0.1}
        minimumValue={0}
        maximumValue={1}
        thumbTintColor="silver"
        minimumTrackTintColor="purple"
      />
      <View style={styles.sliderLabels}>
        <Text>Not Important</Text>
        <Text>Neutral</Text>
        <Text>Very Important</Text>
      </View>

      <Text style={[styles.text, { color: theme.color }]}>What is your GPA?</Text>
      <TextInput
        style={[styles.textInput, { borderColor: theme.color }]}
        value={gpa}
        onChangeText={setGpa}
        placeholder="Ex: 3.6..."
      />
    </View>
  );

  const renderPageThree = () => (
    <View>
      <Text style={[styles.text, { color: theme.color }]}>
        Do you wish to attend a college of a specific religious affiliation?
      </Text>
      <DropdownComponent data={religiousAffiliationData} value={religiousAffiliation} onChange={setReligiousAffil} />
      <Slider
        value={religiousAffilImportance}
        onValueChange={setReligiousAffilImportance}
        step={0.1}
        minimumValue={0}
        maximumValue={1}
        thumbTintColor="silver"
        minimumTrackTintColor="purple"
      />
      <View style={styles.sliderLabels}>
        <Text>Not Important</Text>
        <Text>Neutral</Text>
        <Text>Very Important</Text>
      </View>

      <Text style={[styles.text, { color: theme.color }]}>Are you looking for a school with sporting events?</Text>
      <DropdownComponent data={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} value={sportCollege} onChange={setSportEvents} />
      <Slider
        value={sportEventsImportance}
        onValueChange={setSportEventsImportance}
        step={0.1}
        minimumValue={0}
        maximumValue={1}
        thumbTintColor="silver"
        minimumTrackTintColor="purple"
      />
      <View style={styles.sliderLabels}>
        <Text>Not Important</Text>
        <Text>Neutral</Text>
        <Text>Very Important</Text>
      </View>

      <Text style={[styles.text, { color: theme.color }]}>
        Are you looking to attend college in a specific state?
      </Text>
      <DropdownComponent data={stateData} value={stateChoice} onChange={setState} multiSelect={true} />
      <Slider
        value={stateChoiceImportance}
        onValueChange={setStateChoiceImportance}
        step={0.1}
        minimumValue={0}
        maximumValue={1}
        thumbTintColor="silver"
        minimumTrackTintColor="purple"
      />
      <View style={styles.sliderLabels}>
        <Text>Not Important</Text>
        <Text>Neutral</Text>
        <Text>Very Important</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={handleSubmit} title="Submit" />
      </View>
    </View>
  );

  const renderContent = () => {
    if (currentPage === 1) return renderPageOne();
    if (currentPage === 2) return renderPageTwo();
    if (currentPage === 3) return renderPageThree();
  };

  const handleNext = () => setCurrentPage((prev) => prev + 1);
  const handleBack = () => setCurrentPage((prev) => prev - 1);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={[{ key: 'quizContent' }]}
          renderItem={renderContent}
          keyExtractor={(item) => item.key}
          ListFooterComponent={() => (
            <View style={styles.buttonContainer}>
              {currentPage < 3 && <Button onPress={handleNext} title="Next" />}
              {currentPage > 1 && <Button onPress={handleBack} title="Back" />}
            </View>
          )}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 20,
  },
});

