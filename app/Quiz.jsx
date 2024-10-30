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
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  LogBox,
  Alert,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import DropdownComponent from '../components/DropdownComp';
import {SafeAreaView} from 'react-native-safe-area-context';
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, addDoc, getDocs, doc, query, deleteDoc, where, setDoc , getFirestore} from 'firebase/firestore';
import matchColleges from '../src/utils/matchingAlgorithm';
import majorData from '../assets/major_data';
import { UserContext } from '../components/UserContext';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import stateData from '../assets/state_data';
import { handleReport } from '../src/utils/reportUtils';
import Slider from '@react-native-community/slider';
import { CollegesContext } from '../components/CollegeContext';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']);

const firestore = getFirestore(db);

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

const Quiz = ({navigation}) => {
    

    const [currentPage, setCurrentPage] = useState(1);
    const [tookACT, setTookACT] = useState('');
    const [tookSAT, setTookSAT] = useState('');
    const [address, setAddress] = useState('');
    const [gpa, setGpa] = useState('');
    const [satScore, setSatScore] = useState('');
    const [actScore, setActScore] = useState('');
    const [satMath, setSatMath] = useState('');
    const [satCriticalReading, setSatCriticalReading] = useState('');
    const [actMath, setActMath] = useState('');
    const [actScience, setActScience] = useState('');
    const [actReading, setActReading] = useState('');
    const [actEnglish, setActEnglish] = useState('');
    const [actWriting, setActWriting] = useState('');
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
    const {colleges } = useContext(CollegesContext);

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
    const [placeSearch, setPlaceSearch] = useState('');


    const collectionref = collection(firestore, 'Quiz');

    const handleSubmit = async () => {
        const missingFields = [];

        if (!address) missingFields.push('Address');
        if (!gpa) missingFields.push('GPA');
        if (!major.length) missingFields.push('Major');
        if (!stateChoice.length) missingFields.push('State Choice');
        if (!distanceFromCollege) missingFields.push('Distance from College');
        if (!tuitionCost) missingFields.push('Tuition Cost');
        if (!religiousAffiliation) missingFields.push('Religious Affiliation');
        if (!sportCollege) missingFields.push('Sporting Events');
        if (!collegeDiversity) missingFields.push('College Diversity');
        if (!size) missingFields.push('College Size');
        if (!schoolClassification) missingFields.push('School Classification');
        if (!urbanizationLevel) missingFields.push('Urbanization Level');
    
        if (missingFields.length > 0) {
            const fields = missingFields.join(', ');
            alert(`Please fill out the following required fields: ${fields}`);
            return;
        }
    

        const answers = {
            address,
            gpa,
            sat: satScore || 'N/A'|| 'NA',
            act: actScore || 'N/A' || 'NA',
            sat_critical_reading: satCriticalReading || 'N/A' || 'NA',
            act: actScore || 'N/A' || 'NA',
            act_math: actMath || 'N/A' || 'NA',
            act_science: actScience || 'N/A' || 'NA',
            act_reading: actReading || 'N/A' || 'NA',
            act_english: actEnglish || 'N/A' || 'NA',
            act_writing: actWriting || 'N/A' || 'NA',
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

    //       const deleteItem = async(uid) => {
    //           const quizesRef = collection(firestore, 'Quiz');
    //           const q = query(quizesRef, where('userId', '==', uid));
    //           const querySnapshot = await getDocs(q);
    //           //onst quizCount = await querySnapshot.count;
    //           //console.log(quizCount);
    //           try{
    //           if (!querySnapshot.empty) {
    //               const userDoc = querySnapshot.docs[0];
    //               const userData = userDoc.data();
    //               deleteDoc(userDoc.ref)
    //                } else {
    //                    //console.error('No user found with the given UID.');
    //                }
    //            } catch (error) {
    //                console.error('Error deleting repeat quiz:', error);
    //            }
    //        };
    //    await deleteItem(auth().currentUser.uid);

        // try {
        //     await setDoc(doc(collection(firestore, "Users"), auth().currentUser.uid), {userPreferences: answers, User_UID: auth().currentUser.uid},
        //     {merge: true});
        //     alert('Quiz submitted successfully!');
        // } catch (error) {
        //     console.error('Error adding document: ', error);
        // }

        const result = (await matchColleges(answers, colleges)).top100;
        navigation.navigate('QuizStack', { top100: result });
    };
    
    const renderPageOne = () => (
        <View>
          <Text style={[styles.text]}>What do you plan on studying?</Text>
          <DropdownComponent
            data={majorData}
            value={major}
            onChange={setMajor}
            multiSelect={true}
            maxSelect={3}
          />
          <Slider
            value={majorImportance || 0.5}
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
    
          <Text style={[styles.text]}>Are you looking to attend college in a specific state?</Text>
          <DropdownComponent data={stateData} value={stateChoice} onChange={setState} multiSelect={true} maxSelect={3} />
          <Slider
            value={stateChoiceImportance || 0.5}
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
    
          <Text style={[styles.text]}>How far from home do you want your college to be?</Text>
          <DropdownComponent data={distanceData} value={distanceFromCollege} onChange={setDistance} multiSelect={true} maxSelect={3} />
          <Slider
            value={distanceImportance || 0.5}
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
    
          <Text style={[styles.text]}>How much are you willing to pay for tuition?</Text>
          <DropdownComponent data={tuitionData} value={tuitionCost} onChange={setTuition} multiSelect={true} maxSelect={3} />
          <Slider
            value={tuitionImportance || 0.5}
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
        </View>
      );
    
      const renderPageTwo = () => (
        <View>
          <Text style={[styles.text]}>Are you looking for a public or private school?</Text>
          <DropdownComponent
          data={[
              { label: 'Public', value: 'Public' },
              { label: 'Private', value: 'Private' },
          ]}
          value={schoolClassification}
          onChange={setType}
          multiSelect={true}
          maxSelect={2}
          />
          <Slider
            value={classificationImportance || 0.5}
            onValueChange={setClassificationImportance}
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
    
          <Text style={[styles.text]}>Are you looking for a diverse college?</Text>
          <DropdownComponent
             data={[
                 { label: 'Neutral', value: 'Neutral' },
                 { label: 'Important', value: 'Important' },
                 { label: 'Very Important', value: 'Very Important' },
             ]}
             value={collegeDiversity}
             onChange={setDiverse}
             multiSelect={true}
             maxSelect={3}
          />
          <Slider
            value={diversityImportance || 0.5}
            onValueChange={setDiversityImportance}
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
    
          <Text style={[styles.text]}>Do you wish to attend a college with a specific religious affiliation?</Text>
          <DropdownComponent data={religiousAffiliationData} value={religiousAffiliation} onChange={setReligiousAffil} multiSelect={true} maxSelect={3} />
          <Slider
            value={religiousAffilImportance || 0.5}
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
        </View>
      );
    
      const renderPageThree = () => (
        <View>
            <Text style={[styles.text]}>What size college are you looking for?</Text>
            <DropdownComponent data={sizeData} value={size} onChange={setSize} multiSelect={true} maxSelect={3} />
            <Slider
               value={sizeImportance || 0.5}
               onValueChange={setSizeImportance}
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
          <Text style={[styles.text]}>Are you looking for a school with sporting events?</Text>
          <DropdownComponent data={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} value={sportCollege} onChange={setSportEvents} multiSelect={true} maxSelect={2} />
          <Slider
            value={sportEventsImportance || 0.5}
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
    
          <Text style={[styles.text]}>Are you looking for a college in a specific type of area?</Text>
          <DropdownComponent data={typeOfAreaData} value={urbanizationLevel} onChange={setTypeOfArea} multiSelect={true} maxSelect={3} />
          <Slider
            value={urbanizationImportance || 0.5}
            onValueChange={setUrbanizationImportance}
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
    
          <Text style={[styles.text]}>What is your GPA?</Text>
          <TextInput
              style={[styles.textInput]}
              value={gpa}
              onChangeText={(text) => {
                  const formatted = text.replace(/[^0-9.]/g, '');
                  if (formatted.match(/^\d*\.?\d{0,2}$/)) {
                      if (formatted === '' || (parseFloat(formatted) >= 0 && parseFloat(formatted) <= 4.00)) {
                          setGpa(formatted);
                      }
                  }
              }}
              placeholder="Ex: 3.6..."
              keyboardType="numeric"
          />
        </View>
      );
    
      const renderPageFour = () => (
       
          <View>
            <Text style={[styles.text]}>Did you take the ACT?</Text>
            <DropdownComponent
              data={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
              value={tookACT}
              onChange={(value) => {
                setTookACT(value);
    
                if (value.includes('No')) {
                  setActScore('');
                  setActMath('');
                  setActEnglish('');
                  setActReading('');
                  setActScience('');
                  setActWriting('');
                }
              }}
            />
    
            {tookACT.includes('Yes') && (
              <>
                <Text style={[styles.text]}>ACT Composite score?</Text>
                <TextInput
                  style={[styles.textInput]}
                  value={actScore}
                  onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        setActScore(formatted);
                    }}
                  onBlur={() => {
                        const value = parseInt(actScore, 10);
                        if (value > 36) {
                            setActScore('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (value < 0) {
                            setActScore('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (isNaN(value)) {
                            setActScore('N/A');
                        }
                    }}
                  placeholder="Ex: 25..."
                  keyboardType="numeric"
                />
    
                <Text style={[styles.text]}>ACT Math score?</Text>
                <TextInput
                  style={[styles.textInput]}
                  value={actMath}
                  onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        setActMath(formatted);
                    }}
                  onBlur={() => {
                        const value = parseInt(actMath, 10);
                        if (value > 36) {
                            setActMath('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (value < 0) {
                            setActMath('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (isNaN(value)) {
                            setActMath('N/A');
                        }
                    }}
                  placeholder="Ex: 25..."
                  keyboardType="numeric"
                />
    
                <Text style={[styles.text]}>ACT English score?</Text>
                <TextInput
                  style={[styles.textInput]}
                  value={actEnglish} 
                  onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        setActEnglish(formatted);
                    }}
                  onBlur={() => {
                        const value = parseInt(actEnglish, 10);
                        if (value > 36) {
                            setActEnglish('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (value < 0) {
                            setActEnglish('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (isNaN(value)) {
                            setActEnglish('N/A');
                        }
                    }}
                  placeholder="Ex: 25..."
                  keyboardType="numeric"
                />
    
                <Text style={[styles.text]}>ACT Reading score?</Text>
                <TextInput
                  style={[styles.textInput]}
                  value={actReading}
                  onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        setActReading(formatted);
                    }}
                  onBlur={() => {
                        const value = parseInt(actReading, 10);
                        if (value > 36) {
                            setActReading('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (value < 0) {
                            setActReading('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (isNaN(value)) {
                            setActReading('N/A');
                        }
                    }}
                  placeholder="Ex: 25..."
                  keyboardType="numeric"
                />
    
                <Text style={[styles.text]}>ACT Science score?</Text>
                <TextInput
                  style={[styles.textInput]}
                  value={actScience}
                  onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        setActScience(formatted);
                    }}
                  onBlur={() => {
                        const value = parseInt(actScience, 10);
                        if (value > 36) {
                            setActScience('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (value < 0) {
                            setActScience('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (isNaN(value)) {
                            setActScience('N/A');
                        }
                    }}
                  placeholder="Ex: 25..."
                  keyboardType="numeric"
                />
    
                <Text style={[styles.text]}>ACT Writing score?</Text>
                <TextInput
                  style={[styles.textInput]}
                  value={actWriting}
                  onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        setActWriting(formatted);
                    }}
                  onBlur={() => {
                        const value = parseInt(actWriting, 10);
                        if (value > 36) {
                            setActWriting('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (value < 0) {
                            setActWriting('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 0-36.');
                        } else if (isNaN(value)) {
                            setActWriting('N/A');
                        }
                    }}
                  placeholder="Ex: 25..."
                  keyboardType="numeric"
                />
              </>
            )}
          </View>
        );
    
      const renderPageFive = () => (
          <View>
            <Text style={[styles.text]}>Did you take the SAT?</Text>
            <DropdownComponent
              data={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
              value={tookSAT}
              onChange={(value) => {
                setTookSAT(value);
                if (value.includes('No')) {
                  setSatScore(''); setSatMath(''); setSatCriticalReading('');
                }
              }}
            />
    
            {tookSAT.includes('Yes') && (
              <>
                <Text style={[styles.text]}>SAT Composite score?</Text>
                <TextInput
                  style={[styles.textInput ]}
                  value={satScore}
                  onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        setSatScore(formatted);
                    }}
                  onBlur={() => {
                        const value = parseInt(satScore, 10);
                        if (value > 1600) {
                            setSatScore('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 400-1600.');
                        } else if (value < 400) {
                            setSatScore('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 400-1600.');
                        } else if (isNaN(value)) {
                            setSatScore('N/A');
                        }
                    }}
                  placeholder="Ex: 1200..."
                  keyboardType="numeric"
                />
                <Text style={[styles.text,]}>SAT Math score?</Text>
                <TextInput
                  style={[styles.textInput]}
                  value={satMath}
                  onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        setSatMath(formatted);
                    }}
                  onBlur={() => {
                        const value = parseInt(satMath, 10);
                        if (value > 800) {
                            setSatMath('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 200-800.');
                        } else if (value < 200) {
                            setSatMath('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 200-800.');
                        } else if (isNaN(value)) {
                            setSatMath('N/A');
                        }
                    }}
                  placeholder="Ex: 600..."
                  keyboardType="numeric"
                />
                <Text style={[styles.text, ]}>SAT Evidence Based Reading and Writing score?</Text>
                <TextInput
                  style={[styles.textInput]}
                  value={satCriticalReading}
                  onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        setSatCriticalReading(formatted);
                    }}
                  onBlur={() => {
                        const value = parseInt(satCriticalReading, 10);
                        if (value > 800) {
                            setSatCriticalReading('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 200-800.');
                        } else if (value < 200) {
                            setSatCriticalReading('');
                            Alert.alert('Invalid Input', 'Please enter a valid number between 200-800.');
                        } else if (isNaN(value)) {
                            setSatCriticalReading('N/A');
                        }
                    }}
                  placeholder="Ex: 600..."
                  keyboardType="numeric"
                />
              </>
            )}
    
            <Text style={[styles.text]}>What is your address?</Text>
            <GooglePlacesAutocomplete
              placeholder="123 Main St..."
              fetchDetails={true}
              onPress={(data, details = null) => {
                setAddress(details?.formatted_address || data.description);
              }}
              value={address}
              textInputProps={{ value: placeSearch, onChangeText: setPlaceSearch }}
              query={{ key: 'AIzaSyB_0VYgSr15VoeppmqLur_6LeHHxU0q0NI', language: 'en' }}
              styles={{ listView: { maxHeight: 200 } }}
            />
          </View>
      );
    
    
      const renderContent = () => {
        if (currentPage === 1) return renderPageOne();
        if (currentPage === 2) return renderPageTwo();
        if (currentPage === 3) return renderPageThree();
        if (currentPage === 4) return renderPageFour();
        if (currentPage === 5) return renderPageFive();
      };
    
      const handleNext = () => setCurrentPage((prev) => prev + 1);
      const handleBack = () => setCurrentPage((prev) => prev - 1);

      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior="height"
            style={styles.container}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
            >
              {renderContent()}

              {currentPage === 5 ? (
                <View style={styles.lastPageButtonContainer}>
                  <Button onPress={handleSubmit} title="Submit" style={styles.button} />
                  <Button onPress={handleBack} title="Back" style={styles.button} />
                </View>
              ) : (
                <View style={styles.buttonContainer}>
                  {currentPage > 1 && (
                    <Button onPress={handleBack} title="Back" style={styles.button} />
                  )}
                  {currentPage < 5 && (
                    <Button onPress={handleNext} title="Next" style={styles.button} />
                  )}
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      );
};
  
export default Quiz

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
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    button: {
      flex: 1,
      padding: 10,
      marginHorizontal: 5,
      backgroundColor: '#007AFF',
      borderRadius: 5,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    choiceBoxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    choiceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        marginRight: 5,
        marginBottom: 5,
    },
    choiceBoxText: {
        marginRight: 5,
    },
});

