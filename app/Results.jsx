import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Button, Alert, TextInput, ActivityIndicator,TouchableOpacity, ScrollView, ImageBackground, Image} from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';
import { db } from '../config/firebaseConfig';
import  CheckBox  from '@react-native-community/checkbox';
import DropdownComponent from '../components/DropdownComp';
import college_data from '../assets/college_data';
import stateData from '../assets/state_data'
import majorData from '../assets/major_data';
import { CollegesContext } from '../components/CollegeContext';

const firestore = getFirestore(db);
const usersRef = collection(firestore, 'Users');
const collegeRef = collection(firestore, 'CompleteColleges'); // Initialize Firestore

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

      Alert.alert('College added to Favorites!');
    }
  } catch (error) {
    console.error('Error adding college to favorites: ', error);
  }
};

const Results = ({route, navigation}) => {
  const top100 = route.params.top100;
  // const user = auth().currentUser.uid;
  const { user } = useContext(UserContext);  // Get the current user from UserContext
  const [committedColleges, setCommittedColleges] = useState([]);

  const [search, setSearch] = useState('');
  const [colllegeList, setCollegeList] = useState(top100);
  const [showFilter, setShowFilter] = useState(false);
  // const [colleges, setColleges] = useState([]);
  const {colleges, loading} = useContext(CollegesContext);
  const [isLoading, setisLoading] = useState(false);
  const [housing , setHousing] = useState(false);
  const [mealPlan, setMealplan] = useState(false);
  const [privateSchool, setPrivate] = useState (false);
  const [publicSchool, setPublicSchool] = useState(true);
  const [womenOnly, setWomenOnly] = useState(false);
  const [chooseState, setChooseState] = useState(false);
  const [stateChoice, setStateChoice] = useState([]);
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
  const [major, setMajor] = useState(false);
  const [selMajors, setSelMajors] = useState([]);
  
  

  useEffect(() => {
    const fetchCommittedColleges = async () => {
        if (!user) return;

        // Query the "Users" collection for the document where "User_UID" matches the current user's UID
        const usersQuery = query(collection(firestore, 'Users'), where('User_UID', '==', user.uid));
        const querySnapshot = await getDocs(usersQuery);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];  // Get the first matching document
            const data = userDoc.data();

            // Set the committed colleges from the user's data, or an empty array if it doesn't exist
            setCommittedColleges(data.Committed_Colleges || []);
        }
    };

    fetchCommittedColleges();
}, [user]);

  // useEffect(() => {
    
  //   const loadData = async() => {

  //     try{
  //     await college_data()
  //     .then((data)=>{
  //       const collegeData = (data.docs.map(doc=> doc.data()));
  //       setColleges(collegeData);
  //       setisLoading(false);

  //     })

  //     }catch(error) {
  //       Alert.alert("Error Message: " + error);
  //     }
      
  //   }
  //   setisLoading(true);
  //   loadData();
    
  
    
  // }, [])

  const handleCommit = async (collegeName) => {
    try {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to commit to a college.');
            return;
        }

        const usersQuery = query(collection(firestore, 'Users'), where('User_UID', '==', user.uid));
        const querySnapshot = await getDocs(usersQuery);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];  // Get the first matching document
            const userDocRef = doc(firestore, 'Users', userDoc.id);

            let updatedCommittedColleges;
            if (committedColleges.includes(collegeName)) {
                // Remove the college if it exists in the committed list
                updatedCommittedColleges = committedColleges.filter(college => college !== collegeName);
                await updateDoc(userDocRef, {
                    Committed_Colleges: arrayRemove(collegeName),
                });
                Alert.alert('Commitment Removed', `You have removed your commitment to ${collegeName}
                \n Please inform your possible roommates of this decision!`);
            } else {
                // Add the college if it doesn't exist in the committed list
                updatedCommittedColleges = [...committedColleges, collegeName];
                await updateDoc(userDocRef, {
                    Committed_Colleges: arrayUnion(collegeName),
                });
                Alert.alert('Committed', `You have committed to ${collegeName}`);
            }

            // Update the local state
            setCommittedColleges(updatedCommittedColleges);
        } else {
            Alert.alert('Error', 'User not found in the database.');
        }
    } catch (error) {
        console.error('Error committing to college:', error);
        Alert.alert('Error', 'Something went wrong while committing to the college.');
    }
};

  const renderItem = ({item}) => {
    const isCommitted = committedColleges.includes(item.name);
    
    return(
    
    <ScrollView style={styles.card}>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => {
          favoriteCollege({ID: item.id});
        }}>
        <Image
          style={{width: 20, height: 20, alignSelf: 'flex-end'}}
          source={require('../assets/pinkstar.png')}

          // onError={(error)=> console.log("Image error: " + error)}
        />
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => handleCommit(item.name)}
      >
        {isCommitted ? <Image source={require('../assets/rocket_sat.png')} style={[styles.commitButton]}/> : <Image source={require('../assets/rocket.png')} style={[styles.commitButton]}/>}

      </TouchableOpacity>
                    
      
      <TouchableOpacity
        onPress={() =>
          navigation.push('Details', {college: item.name, id: item.id})
        }>
        <Text style={styles.collegeName}>{item.name}</Text>
        <Text style={styles.collegeScore}> {(item.score != null)? "Match Percent: " + item.score + "%": "No Previous Matches"}</Text>
      </TouchableOpacity>
      
    </ScrollView>
  )};


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
      ((college.act_Composite25 >= actComp)  || college.act_Composite25 == 'null' || actComp == null) &&
      ((college.act_English25 >= actEng) || college.act_English25 == 'null' || actEng == null) &&
       ((college.act_Math25 >= actMath) || college.act_Math25 == 'null' || actMath == null) &&
      ((college.act_Writing25 >= actWrit) || college.act_Writing25 == 'null' || actWrit == null) &&

      //SAT
      ((college.sat_Total >= satTotal) || college.sat_Total == 'null' || satTotal == null) &&  
      ((college.sat_Math25 >= satMath) || college.sat_Math25 == 'null' || satMath == null) &&
      ((college.sat_Writing25 >= satWrit) || college.sat_Writing25 == 'null' || satWrit == null) &&
      ((college.act_criticalReading25 >= satRead)  || college.act_criticalReading25 == 'null' || satRead == null) &&

      //Majors
      (selMajors.length === 0 || selMajors.every(majorName => {
        // Use find method to search for the object with matching label or value
        const majorFound =  majorData.find(major => major.label === majorName || major.value === majorName);
        
        // Return the categories if the major is found, otherwise return null
        const majorCat = majorFound ? majorFound.categories : null;
        const majorKey = 'percent_' + majorCat;
        
        return majorKey in college && parseInt(college[majorKey]) !== 0;
      }))
      
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
    console.log(selMajors);
    

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

  const handleSetMajor = (choice) => {
    setMajor(choice);
    if(!choice){
      setSelMajors([]);
    }

  }

  if(isLoading || loading){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={100}/>
      </View>

    );
  
    

  }
  
 

  
    return (
      <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.searchView}>
          <TextInput style={styles.searchText} placeholder='Search...' clearButtonMode='always' value={search} onChangeText={handleSearch}/>
          <TouchableOpacity style={styles.searchContainer} onPress={handleFilterSearch}>
                <Text style={[{color: 'white'}]}>Search</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={showFilters} style={{ borderBlockColor: 'white', borderWidth: 2, width: 175, marginLeft: 10, borderRadius: 10, marginTop: 10}}>
              <Text style={{color: 'white', fontSize: 20, marginLeft: 20, marginTop: 10}}> Filter Search</Text>
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
                    value={major}
                    onValueChange={handleSetMajor}
                    style={styles.checkbox}
                  />
                  <Text> Select Majors </Text>
                </View>

                <View style={styles.choices}>
                {major && (
                    <>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                        {selMajors.map((choice, index) => (
                          <View key={index} style={styles.choiceBox}> 
                            <Text style={styles.label}>{choice}</Text>
                            <TouchableOpacity onPress={() => {
                              setSelMajors(prevChoices => prevChoices.filter((_, i) => i !== index));
                            }}>
                              <Text>X</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                      
                      
                    </>
                  )}
                  </View>

                  {major &&

                    <View style={{flex:1,width:'95%'}}>
                      <DropdownComponent
                        style={{width: '75%', marginLeft: 15}}
                        data={majorData}
                        value={selMajors}
                        onChange={(val) => {
                          setSelMajors(prevChoices => [...prevChoices, val]);
                        }}
                      />
                    </View>
                  }
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

                    <View style={{flex:1, width:'95%'}}>
                      <DropdownComponent
                        style={{ marginLeft: 15}}
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
      </ImageBackground>
    );

  }

  


  const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover'
    },
    // container: {
    //   flex: 1,
    //   backgroundColor: '#fff',
    //   padding: 20,
    // },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      paddingTop: 20,
      textAlign: 'center',
      color: 'grey'
    },
    list: {
      paddingBottom: 20,
      paddingTop: 60,
    },
    card: {
      backgroundColor: '#3A3B3C',
      padding: 20,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      width: '95%',
      alignSelf: 'center'
    },
    collegeName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 5,
    },
    collegeScore: {
      fontSize: 16,
      color: '#dbdada',
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
      width: '90%',
      height: 50,
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 50
    },
    searchText: {
      width: '95%',
      height: 50,
      borderBlockColor: 'grey',
      borderWidth: 1,
      backgroundColor: '#fff',
      borderRadius: 50,
      paddingLeft: 25
  
    },
    searchContainer:{
      width: '15%',
      height: '101%',
      position: 'absolute',
      right: 15,
      bottom: 1,
      backgroundColor: '#e5801b',
      borderRadius: 55,
      alignItems: 'center',
      justifyContent: 'center'
    },
    filterView: {
      width: '95%',
      height: 600,
      borderBlockColor: 'green',
      backgroundColor: 'white',
      justifyContent: 'flex-start', 
      alignItems: 'flex-start',
      paddingTop: 15,
      marginTop: 10
    
    
    },
     checkboxContainer:{
      flexDirection: 'row',
      marginBottom: 20,
      width: '95%',
      padding: 10
  
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
        width: 125,
        height: 50,
        borderBlockColor: 'black',
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
    },
    commitButton:
    { width: 50, height: 50, alignSelf: 'flex-end', borderRadius: 15, paddingLeft:20, }
    
  
  });
  
  export default Results