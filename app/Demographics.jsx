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
import majorData , {unique_Majors} from '../assets/major_data';
import Constants from 'expo-constants';
import { CollegesContext } from '../components/CollegeContext';
import * as Progress from 'react-native-progress';
import {Circle, Svg} from 'react-native-svg'
import FastImage from 'react-native-fast-image';
import {generateCircleData} from '../components/createCircleGraphic'
import computeDiverse from '../assets/diversity_data';
import Piechart from '../components/pieChart';
import GenderChart from '../components/genderChart';

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
        <Text style={styles.subTitle}>Student to Faculty Ratio: {sToF} </Text>
    </View>
    <Svg height="250" width="100%">
        <Circle cx="50" cy="100" r="50" fill="blue" />

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
            <View style={{marginVertical: 10}} key={index}>
            <Text style={{color: '#eae8e5', marginBottom: 5 }}> {major[0]} :</Text>
            <Progress.Bar progress={parseInt(major[1])/100} width={200}/>
            </View>
        ))}

    </View>
    
    
    <Text style={styles.subTitle}>Diversity: </Text>
        <Piechart percentages={percentages} />
    <Text style={styles.subTitle}>Gender Breakdown: </Text>
        <GenderChart percentages={genPercentages}/>
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
    height: 3000,
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
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'white',
},
progressBar: {
    height: 50,
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'darkgrey',
    color: 'darkgreen', // For Android
  },
});