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
import majorData from '../assets/major_data';
import Constants from 'expo-constants';
import { CollegesContext } from '../components/CollegeContext';
import PieChart from 'react-native-pie-chart';
import * as Progress from 'react-native-progress';

const firestore = getFirestore(db);
const collegesRef = collection(firestore, 'CompleteColleges');
const usersRef = collection(firestore, 'Users');



const Demographics = ({navigation, collegeID}) => {
// const collegeID = route.params.collegeID;
const [sToF, setSToF] = useState(0);
const [userPref, setUserPref] = useState([]);
const [circleData, setCircleData] = useState([]);
const user = auth().currentUser.uid;
const [majors, setMajors] = useState([]);
const {colleges, loading} = useContext(CollegesContext);

useEffect(() => {
    const func =  () => {
    // const collegeQuery = query(
    //     collegesRef,
    //     where('school_id', '==', parseInt(collegeID)),
    // );
    try {
        // const querySnapshot = await getDocs(collegeQuery);

        // if (!querySnapshot.empty) {
        // const firstDoc = querySnapshot.docs[0];
        // const collegeData = firstDoc.data();
        const college = colleges.find(college => college.school_id == parseInt(collegeID));
        if(college != null)
        {
            const sToF = college.student_to_Faculty_Ratio;
        
        

        const uniqueMajors = [];
        const majorSet = new Set();

        majorData.forEach(major => {
            const majorCategory = major.categories || [' '];
            const field = 'percent_' + major.categories;
            const percent = college[field];

            if (!majorSet.has(majorCategory) && percent) {
            majorSet.add(majorCategory);
            uniqueMajors.push([majorCategory, percent]);
            }
        });
        uniqueMajors.reduce((acc, curr) => {
            const majorCategory = curr.categories;

            if (!acc.some(major => major.categories === majorCategory)) {
            acc.push(curr);
            }

            return acc;
        }, []);

        setMajors(uniqueMajors);

        setSToF(sToF);
        
        } else {
        console.log('No matching document found.');
        }
    } catch (error) {
        console.error('Error retrieving document:', error);
    }
    };
    func();
    // console.log(sToF)
}, []);

useEffect(() => {
    const func = async () => {
    const userQuery = query(usersRef, where('User_UID', '==', user));
    try {
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        const userData = firstDoc.data();
        const userPreferences = userData.userPreferences;

        setUserPref(userPreferences);
        } else {
        console.log('No matching document found.');
        }
    } catch (error) {
        console.error('Error retrieving document:', error);
    }
    };
    func();
    // console.log(userPref)
}, []);

// useEffect(() => {
//   const generateCircleData = () => {
//     const data = [];
//     const Xmin = 145;
//     const Xmax = 350;
//     const Ymin = 20;
//     const Ymax = 155;
//     const radius = 15; // Radius of the circles

//     while (data.length < sToF) {
//       const newCircle = {
//         cx: Math.random() * (Xmax - Xmin) + Xmin,
//         cy: Math.random() * (Ymax - Ymin) + Ymin,
//         r: radius,
//       };

//       // Check if the new circle overlaps with any existing circles
//       let overlap = false;
//       for (let i = 0; i < data.length; i++) {
//         if (doCirclesOverlap(newCircle, data[i])) {
//           overlap = true;
//           break;
//         }
//       }

//       // Add the circle if no overlap was detected
//       if (!overlap) {
//         data.push(newCircle);
//       }
//     }
//     setCircleData(data);
//   };

//   if (sToF > 0) {
//     generateCircleData();
//   }
// }, [sToF]);

return (
    <ImageBackground source={require('../assets/galaxy.webp')} style={styles.container}> 
    <View style={styles.contentContainer}>
    <View>
        <Text style={styles.subTitle}>Student to Faculty Ratio: {sToF} </Text>
    </View>
    {/* <Svg height="250" width="100%">
        <Circle cx="50" cy="100" r="50" fill="blue" />

        {circleData.map((circle, index) => (
        <Circle
            key={index}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill="pink"
        />
        ))}
    </Svg> */}
    <View style={{paddingVertical: 20}}>
        <Text style={styles.subTitle}>Major Break Down</Text>
        {majors.map((major, index) => (
            <View style={{marginVertical: 10}} key={index}>
            <Text style={{color: '#eae8e5', marginBottom: 5 }}> {major[0]} :</Text>
            <Progress.Bar progress={parseInt(major[1])/100} width={100}/>
            </View>
        ))}

    </View>
    
    
    <Text style={styles.subTitle}>Diversity: </Text>
    <Text style={{color: '#eae8e5'}}> To Be Calculated </Text>
    <Text></Text>
    </View>
    </ImageBackground>
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
    height: 1500,
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