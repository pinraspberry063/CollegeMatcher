import {
    ImageBackground,
StyleSheet,
Text,
View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import {
collection,
getDocs,
getFirestore,
query,
where,
} from 'firebase/firestore';
import uniqueMajors , {unique_Majors} from '../assets/major_data';
import Constants from 'expo-constants';
import { CollegesContext } from '../components/CollegeContext';
import * as Progress from 'react-native-progress';
import {Circle, Svg} from 'react-native-svg'
import FastImage from 'react-native-fast-image';
import {generateCircleData} from '../components/createCircleGraphic'
import computeDiverse from '../assets/diversity_data';
import Piechart from '../components/pieChart';
import GenderChart from '../components/genderChart';
import { diverses } from '../assets/diversity_data';

const firestore = getFirestore(db);
const usersRef = collection(firestore, 'Users');
  
//   const favoriteCollege = async ({ID}) => {
//     const collegeID = parseInt(ID);
  
//     const userQuery = query(usersRef, where('User_UID', '==', user));
  
//     try {
//       const querySnapshot = await getDocs(userQuery);
  
//       if (!querySnapshot.empty) {
//         const firstDoc = querySnapshot.docs[0];
//         const userData = firstDoc.data();
//         const currentFavorited = userData.favorited_colleges;
//         currentFavorited.push(collegeID);
  
//         await setDoc(
//           firstDoc.ref,
//           {
//             favorited_colleges: currentFavorited,
//           },
//           {merge: true},
//         );
  
//         alert('College added to Favorites!');
//       }
//     } catch (error) {
//       console.error('Error adding college to favorites: ', error);
//     }
//   };

const Demographics = ({navigation, collegeID}) => {

    // const college = route.params.collegeID;
const college = collegeID;
const diverseColors = [ '#8a05f7','#05aff7', '#f7e705', '#c72246', '#ff00fb' , '#00ff77','#00ffdd', '#f77e05'];
const genderColors = [ '#8a05f7','#05aff7']
const genders = ["Male", 'Female']
const [sToF, setSToF] = useState(collegeID.student_to_Faculty_Ratio);
const [userPref, setUserPref] = useState([]);
const genPercentages = [collegeID.percent_male, collegeID.percent_women]
const [circleData, setCircleData] = useState(generateCircleData(collegeID.student_to_Faculty_Ratio));
const user = auth().currentUser.uid;
const [majors, setMajors] = useState(unique_Majors({collegeID: collegeID}));
const [percentages, setPercentages] = useState(computeDiverse({college: collegeID}));

// useEffect(()=> {
//     const func = () => {
//         setMajors(unique_Majors(collegeID))
//     }
//     const makeCircles = () => {
//         if (sToF > 0) {
            
//             setCircleData(generateCircleData(sToF))
//           }
//     }
//     makeCircles()
//     func()
// },[])

// useEffect(() => {
//     const func =  () => {

//     try {    
 

//         const uniqueMajors = [];
//         const majorSet = new Set();

//         majorData.forEach(major => {
//             const majorCategory = major.categories || [' '];
//             const field = 'percent_' + major.categories;
//             const percent = collegeID[field];

//             if (!majorSet.has(majorCategory) && percent) {
//             majorSet.add(majorCategory);
//             uniqueMajors.push([majorCategory, percent]);
//             }
//         });
//         uniqueMajors.reduce((acc, curr) => {
//             const majorCategory = curr.categories;

//             if (!acc.some(major => major.categories === majorCategory)) {
//             acc.push(curr);
//             }

//             return acc;
//         }, []);

//         setMajors(uniqueMajors);
    
//     } catch (error) {
//         console.error('Error retrieving document:', error);
//     }
//     };
//     func();

// }, []);

// useEffect(() => {
//     const func = async () => {
//     const userQuery = query(usersRef, where('User_UID', '==', user));
//     try {
//         const querySnapshot = await getDocs(userQuery);

//         if (!querySnapshot.empty) {
//         const firstDoc = querySnapshot.docs[0];
//         const userData = firstDoc.data();
//         const userPreferences = userData.userPreferences;

//         setUserPref(userPreferences);
//         } else {
//         console.log('No matching document found.');
//         }
//     } catch (error) {
//         console.error('Error retrieving document:', error);
//     }
//     };
//     func();

// }, []);



return (
    <FastImage source={require('../assets/galaxy.webp')} style={styles.container}> 
    <View style={styles.contentContainer}>
        <View>
            <Text style={styles.subTitle}>Student to Faculty Ratio </Text>
        </View>
        <Svg height="250" width="100%">
            <Circle cx="50" cy="100" r="50" fill="blue" />
            <Text style={{color: 'white', position: 'absolute', left: 30, top: 70, fontSize: 40}}>{sToF}</Text>

            {circleData && circleData.map((circle, index) => (
            <Circle
                key={index}
                cx={circle.cx}
                cy={circle.cy}
                r={circle.r}
                fill="pink"
            />
            ))}
        </Svg>
        <View style={{paddingVertical: 20}}>
            <Text style={styles.subTitle}>Major Break Down</Text>
            {majors.map((major, index) => (
                 
                    <View style={[styles.legend, {flexDirection: 'column', paddingVertical: 5, paddingRight: 100}]}>
                        <Text style={{color: '#eae8e5', marginBottom: 5}}> {major[0]} :</Text>
                        <Progress.Bar progress={major[1]/100} style={{width: 295}} />
                        <Text style={{color: 'white', position:'absolute', right: 10, top: 6, fontSize: 20}}> {major[1]}%</Text>
                    </View>
      
            ))}

        </View>

        <View style={{ paddingVertical: 20 }}>
            <Text style={styles.chartHeader}>Diversity</Text>
            <View>
                <View style={{height: 300, paddingTop: 20, paddingLeft: 70}}>
                    <View style={styles.pieBorder}>
                        <View style={[styles.pieBorder, {width:205, height: 205, marginLeft:6, borderWidth:3}]}>
                            <Piechart percentages={percentages} />
                        </View>
                    </View>
                </View>
                {diverseColors.map((color, index) => (
                    <View style={styles.legend} key={index}>
                        <View style={{ backgroundColor: color, width: 20, height: 20, marginTop: 10,borderRadius:10 }} />
                        <Text style={{ color: 'white', marginTop: 10, marginLeft: 20 }}>{diverses[index]}</Text>
                        <Text style={{color: 'white', position:'absolute', right: 10, top: 6, fontSize: 20}}> {percentages[index]}%</Text>
                    </View>
                ))}
            </View>
        </View>
    <View style={{ paddingVertical: 20 }}>       
            <Text style={styles.chartHeader}>Gender Breakdown</Text>

            <View style={{height: 300, paddingTop: 20, paddingLeft: 70}}>
                    <View style={styles.pieBorder}>
                        <View style={[styles.pieBorder, {width:205, height: 205, marginLeft:6, borderWidth:3}]}>
                            <GenderChart percentages={genPercentages} />
                        </View>
                    </View>
                </View>

                <View>
                    {genderColors.map((color, index) => (
                        <View style={styles.legend} key={index}>
                            <View style={{backgroundColor: color, width: 20, height: 20, marginTop: 10, borderRadius:10}}/>
                            <Text style={{color: 'white', marginTop: 10, marginLeft: 20, alignSelf: 'flex-start'}}>{genders[index]}</Text>
                            <Text style={{color: 'white', position:'absolute', right: 10, top: 6, fontSize: 20}}> {genPercentages[index]}%</Text>
                        </View>
                    )
                    )}
                </View>
        </View>
    </View>

    </FastImage>
);
};

export default Demographics


const styles = StyleSheet.create({
container: {
    flex: 1,
    resizeMode: 'cover',
},
star: {
    width: 50,
    height: 50,
    alignSelf: 'flex-end',
    marginTop: 100,
},
swipView: {
    flex: 1,
    paddingTop: 10,
    marginBottom: Constants.statusBarHeight,
    justifyContent: 'center',
},
contentContainer: {
    paddingLeft: 20,
    width: '100%',
    height: 4000,
    paddingVertical: 20
    // justifyContent: 'center',
    // alignContent: 'center',
},
webView: {
    flex: 1,
    height: 1500,
},
button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#A020F0',
    borderRadius: 5,
    marginVertical: 5,
},
buttonText: {
    color: '#FADADD',
    textAlign: 'center',
    fontSize: 16,
},
subTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'white',
    alignSelf: 'center',
    marginBottom: 20
    
},
chartHeader:{
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center', 
    marginRight: 15
},
progressBar: {
    height: 50,
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'darkgrey',
    color: 'darkgreen', // For Android
  },
  legend:{
    
    flexDirection: 'row', 
    backgroundColor: 'black', 
    width: '95%', 
    borderRadius: 15, 
    margin:5, 
    borderWidth: 2, 
    borderColor: 'white', 
    paddingLeft: 10, 
    paddingBottom: 10,


}, 
pieBorder:{
    borderColor: 'white', 
    borderWidth: 2, 
    backgroundColor: 'black', 
    borderRadius: 200, 
    width: 220, 
    height: 220, 
    alignContent: 'center', 
    justifyContent: 'center',
    
}
  
});