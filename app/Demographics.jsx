import {
StyleSheet,
Text,
View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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

useEffect(() => {
    const func = async () => {
    const collegeQuery = query(
        collegesRef,
        where('school_id', '==', parseInt(collegeID)),
    );
    try {
        const querySnapshot = await getDocs(collegeQuery);

        if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        const collegeData = firstDoc.data();
        const sToF = collegeData.student_to_Faculty_Ratio;

        const uniqueMajors = [];
        const majorSet = new Set();

        majorData.forEach(major => {
            const majorCategory = major.categories || [' '];
            const field = 'percent_' + major.categories;
            const percent = collegeData[field];

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
}, [sToF, majors]);

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
}, [userPref]);

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

    <Text style={styles.subTitle}>Major Break Down</Text>
    {majors.map((major, index) => (
        <View key={index}>
        <Text> {major[0]} :</Text>
        <Text> {major[1]} % </Text>
        </View>
    ))}
    <Text> </Text>
    <Text> </Text>
    <Text style={styles.subTitle}>Diversity: </Text>
    <Text> To Be Calculated </Text>
    <Text></Text>
    </View>
);
};

export default Demographics


const styles = StyleSheet.create({
container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
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
    color: 'black',
},
});