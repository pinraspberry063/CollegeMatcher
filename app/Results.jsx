import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Button,
  Image,
  ActivityIndicator,
  Pressable
} from 'react-native';
import  CheckBox  from '@react-native-community/checkbox';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import DropdownComponent from '../components/DropdownComp';
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import college_data from '../assets/college_data';
import stateData from '../assets/state_data'

const firestore = getFirestore(db);
const usersRef = collection(firestore, 'Users');
const collegeRef = collection(firestore, 'CompleteColleges');


const favoriteCollege = async ({ID}) => {
  const collegeID = parseInt(ID);

  const userQuery = query(usersRef, where('User_UID', '==', user));

  try {
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0];
      const userData = firstDoc.data();
      const currentFavorited = userData.favorited_colleges;
      currentFavorited.push(collegeID);

      await setDoc(
        firstDoc.ref,
        {
          favorited_colleges: currentFavorited,
        },
        {merge: true},
      );

      alert('College added to Favorites!');
    }
  } catch (error) {
    console.error('Error adding college to favorites: ', error);
  }
};

const Results = ({route, navigation}) => {
  const top100 = route.params.top100;
  const user = auth().currentUser.uid;

  

 

  // const screen = route.params.screen;

  // const firestore = getFirestore(db);
  // const resultsRef = collection(firestore, 'Users')
  // const resultDoc = query(resultsRef, where('User_UID', '==', auth().currentUser.uid));
  // const docID = (await getDocs(resultDoc)).docs[0].ref;
  // const savedData = docID.top100Colleges;

  const [numResults, setNumResults] = useState(5);
  const [searchRes, setSearchRes] = useState('');
  const [search, setSearch] = useState('');
  const [colllegeList, setCollegeList] = useState(top100);
  const [showFilter, setShowFilter] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [housing , setHousing] = useState(false);
  const [mealPlan, setMealplan] = useState(false);
  const [privateSchool, setPrivate] = useState (false);
  const [publicSchool, setPublicSchool] = useState(true);
  const [womenOnly, setWomenOnly] = useState(false);
  const [chooseState, setChooseState] = useState(false);
  const [stateChoice, setStateChoice] = useState([]);
  const [placeHolder, setPlaceHolder] = useState();
  const [act, setACT] = useState(false);
  const [actComp, setACTComp] = useState();
  const [actEng, setACTEng] = useState();
  const [actWrit, setACTWrit] = useState();
  const [actMath, setACTMath] = useState();
  const [actSci, setACTSci] = useState();
  const [sat, setSAT] = useState(false);
  const [satTotal, setSATTotal] = useState();
  const [satMath, setSATMath] = useState();
  const [satWrit, setSATWrit] = useState();
  const [satRead, setSATRead] = useState();
  const [satSci, setSATSci] = useState();
  
  



  useEffect(() => {
    
    const loadData = async() => {

      try{
      await college_data()
      .then((data)=>{
        const collegeData = (data.docs.map(doc=> doc.data()));
        setColleges(collegeData);
        setisLoading(false);

      })
      }catch(error) {
        alert("Error Message: " + error);
      }
      
      
    }
    setisLoading(true);
    loadData();
    
  
    
  }, [])

  const renderItem = ({item}) => (
    <ScrollView style={styles.card}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          favoriteCollege({ID: item.id});
        }}>
        <Image
          style={{width: 20, height: 20, alignSelf: 'flex-end'}}
          source={require('../assets/pinkstar.png')}

          // onError={(error)=> console.log("Image error: " + error)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.push('Details', {college: item.name, id: item.id})
        }>
        <Text style={styles.collegeName}>{item.name}</Text>
        <Text style={styles.collegeScore}>Match Percent: {item.score}%</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const camelize = (str) => {
    str = str.toLowerCase();
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index)=> {
      if (/\s+/.test(match));
      if (index === 0) return match.toUpperCase();
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  const handleFilterSearch = () => {
    setShowFilter(false);
    const filtered = colleges.filter(college=> 

      // Women Only
      (((college.women_only === 1) && womenOnly) || ((college.women_only === 0) && !womenOnly)) &&

      // Choose State
      (stateChoice.includes(college.state) && chooseState || !chooseState) &&

      // Public or Private
      ((college.school_classification.toLowerCase().includes("private") && privateSchool) || (college.school_classification.toLowerCase().includes("public") && publicSchool)) &&

      // MealPlan
      (((college.mealplan.toLowerCase() == "yes") && mealPlan) || ((college.mealplan.toLowerCase() == "no") && !mealPlan)) &&

      //ACT
      ((college.act_Composite25 >= actComp)  || college.act_Composite25 == 'null' || actComp == null) &&  ((college.act_English25 >= actEng) || college.act_English25 == 'null' || actEng == null) && ((college.act_Math25 >= actMath) || college.act_Math25 == 'null' || actMath == null) &&
      ((college.act_Writing25 >= actWrit) || college.act_Writing25 == 'null' || actWrit == null) &&

      //SAT
      ((college.sat_Total >= satTotal) || college.sat_Total == 'null' || satTotal == null) &&  ((college.sat_Math25 >= satMath) || college.sat_Math25 == 'null' || satMath == null) && ((college.sat_Writing25 >= satWrit) || college.sat_Writing25 == 'null' || satWrit == null) &&
      ((college.act_criticalReading25 >= satRead)  || college.act_criticalReading25 == 'null' || satRead == null)
      
    );

    setCollegeList(filtered.map(doc => ({name: doc.shool_name, id: doc.school_id})));
  }

  const handleSearch = (searchQuery) => {

    setSearch(searchQuery);

    if (searchQuery) {
      const filtered = colleges.filter(college =>
        college.shool_name && college.shool_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      setCollegeList(filtered.map(doc => ({ name: doc.shool_name, id: doc.school_id })));
    } else {
      // If searchQuery is not valid, reset the college list to the original data
      setCollegeList(top100.map(doc => ({ name: doc.shool_name, id: doc.school_id })));
    }
  
    setShowFilter(false);

  }

  const showFilters = ()=> {
    setShowFilter(!showFilter);

  }

  const handlePublicPrivate = (isPrivate) => {
    setPrivate(isPrivate);
    setPublicSchool(!isPrivate)
    
  }

  const handleChooseState = (choice) => {
    setChooseState(choice);
    if(!choice){
      setStateChoice([]);
    }
  }

  if(isLoading){
    return (
      <View>
        <Text> Loading...</Text>
      </View>

    );
  
    

  }
 

  
    return (
      <View style={styles.container}>
        <View style={styles.searchView}>
          <TextInput style={styles.searchText} placeholder='Search' clearButtonMode='always' value={search} onChangeText={handleSearch}/>
          <TouchableOpacity style={styles.searchContainer} onPress={handleFilterSearch}>
                <Text style={[{color: 'white'}]}>Search</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={showFilters}>
              <Text> Filter Search</Text>
          </TouchableOpacity>
        {showFilter && 
        
            <View style={styles.filterView}>
              <ScrollView style={{width: '98%' }}>
                <View style={styles.checkboxContainer} > 
                  <CheckBox
                    value={housing}
                    onValueChange={setHousing}
                    style={styles.checkbox}
                  />
                  <Text> On-Campus Housing </Text>
                </View>
                <View style={styles.checkboxContainer} > 
                  <CheckBox
                    value={mealPlan}
                    onValueChange={setMealplan}
                    style={styles.checkbox}
                  />
                  <Text> Meal Plan </Text>
                </View>
                <View style={styles.checkboxContainer} > 
                  <CheckBox
                    value={womenOnly}
                    onValueChange={setWomenOnly}
                    style={styles.checkbox}
                  />
                  <Text> Women-only </Text>
                </View>
                <View style={styles.checkboxContainer} > 
                  <CheckBox
                    value={publicSchool}
                    onValueChange={() => handlePublicPrivate(false)}
                    style={styles.checkbox}
                  />
                  
                  <Text> Public </Text>
                  <CheckBox
                    value={privateSchool}
                    onValueChange={() => handlePublicPrivate(true)}
                    style={styles.checkbox}
                  />
                  
                  <Text> Private </Text>
                </View>
                <View style={styles.checkboxContainer} > 
                  <CheckBox
                    value={chooseState}
                    onValueChange={handleChooseState}
                    style={styles.checkbox}
                  />
                  <Text> Choose State </Text>
                </View>
                <View style={styles.choices}>
                {chooseState && (
                    <>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                        {stateChoice.map((choice, index) => (
                          <View key={index} style={styles.choiceBox}> 
                            <Text style={styles.label}>{choice}</Text>
                            <TouchableOpacity onPress={() => {
                              setStateChoice(prevChoices => prevChoices.filter((_, i) => i !== index));
                            }}>
                              <Text>X</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                      
                      
                    </>
                  )}
                  </View>

                  {chooseState &&

                    <View style={{width:'95%'}}>
                      <DropdownComponent
                        style={{width: '98%', marginLeft: 15}}
                        data={stateData}
                        value={stateChoice}
                        onChange={(val) => {
                          setStateChoice(prevChoices => [...prevChoices, val]);
                        }}
                      />
                    </View>
                  }
                <View style={styles.checkboxContainer} > 
                  <CheckBox
                    value={act}
                    onValueChange={setACT}
                    style={styles.checkbox}
                  />
                  <Text> ACT </Text>
                </View>
                  {act &&
                    <View style={{width: '95%'}}>
                      {['Composite', 'English', 'Math', 'Science', 'Writing'].map((label, index) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                          <Text style={styles.label}>{label}</Text>
                          <TextInput
                            placeholder={label === 'Writing' ? '30' : '34'} 
                            value={index === 0 ? actComp : index === 1 ? actEng : index === 2 ? actMath : index === 3 ? actSci : actWrit}
                            onValueChange={index === 0 ? setACTComp : index === 1 ? setACTEng : index === 2 ? setACTMath : index === 3 ? setACTSci : setACTWrit}
                            style={styles.input}
                          />
                        </View>
                      ))}
                    </View>
                  }
                <View style={styles.checkboxContainer} > 
                  <CheckBox
                    value={sat}
                    onValueChange={setSAT}
                    style={styles.checkbox}
                  />
                  <Text> SAT </Text>
                </View>
                  {sat &&
                    <View style={{width: '95%'}}>
                      {['Total', 'Math', 'Science', 'Writing', 'Critical Reading'].map((label, index) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                          <Text style={styles.label}>{label}</Text>
                          <TextInput
                            placeholder={label === 'Writing' ? '30' : '34'} 
                            value={index === 0 ? satTotal : index === 1 ? satMath : index === 2 ? satSci : index === 3 ? satWrit : satRead}
                            onValueChange={index === 0 ? setSATTotal : index === 1 ? setSATMath : index === 2 ? setSATSci : index === 3 ? setSATWrit : setSATRead}
                            style={styles.input}
                          />
                        </View>
                      ))}
                    </View>
                  }
                

              
                </ScrollView>
            </View>

          
        }
        
        <Text style={styles.title}>Top College Matches</Text>
        <FlatList
          data={colllegeList}
          renderItem={renderItem}
          // keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      </View>
    );

  }

  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingTop: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
    paddingTop: 60,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  collegeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  collegeScore: {
    fontSize: 16,
    color: '#555',
  },
  dropdown: {
    width: 100,
  },
  button: {
    width: 20,
    marginLeft: '93%',
    alignContent: 'flex-end',
  },
  searchView:{
    width: '100%',
    height: 100,
    justifyContent: 'center',
  },
  searchText: {
    width: '75%',
    height: 50,
    borderBlockColor: 'grey',
    borderWidth: 1

  },
  searchContainer:{
    width: '25%',
    height: '50%',
    position: 'absolute',
    right: 0,
    top: 25,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterView: {
    width: '95%',
    height: 600,
    borderBlockColor: 'green',
    borderWidth: 3,
    justifyContent: 'flex-start', 
    alignItems: 'flex-start',
  
  
  },
   checkboxContainer:{
    flexDirection: 'row',
    marginBottom: 20,
    width: '95%'

  }, 
  checkbox:{
    alignSelf: 'center',

  },
  label: {
    margin: 8,
    color: 'black'
    
  },
  choices: {
    flexDirection: 'row',
    
    width: '90%'
  },
  choiceBox: {
      width: 100,
      height: 50,
      borderBlockColorL: 'black',
      borderWidth: 1,
      margin: 8,
      alignSelf: 'center',
      flexDirection: 'row'
  },
  input: {
    height: 30, 
    borderColor: 'black',
    borderWidth: 1,
    padding: 8, 
    marginLeft: 8,
  }
  

});

export default Results
