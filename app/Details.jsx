import { ScrollView, StyleSheet, Text, View , Button,TouchableOpacity, Image} from 'react-native'
import React, {useEffect, useState} from 'react'
import Constants from 'expo-constants';
import axios from 'axios';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import  { WebView } from 'react-native-webview';
import { db } from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, addDoc, getDocs, getDoc, doc, setDoc , getFirestore, query, where} from 'firebase/firestore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-screens-swiper';
import { color } from 'react-native-elements/dist/helpers';
import Svg, {Circle, text} from 'react-native-svg';
import majorData from '../assets/major_data';

const firestore = getFirestore(db);
const collegesRef = collection(firestore, 'CompleteColleges');
const usersRef = collection(firestore, 'Users');


const doCirclesOverlap = (circle1, circle2) => {
    const dx = circle1.cx - circle2.cx;
    const dy = circle1.cy - circle2.cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const combinedRadii = circle1.r + circle2.r + 6;
    return distance < combinedRadii;
}

const favoriteCollege = async({ID}) => {

    const collegeID = parseInt(ID);
    

    const userQuery = query(usersRef, where('User_UID', '==', user));

    try {

        const querySnapshot = await getDocs(userQuery);

        if(!querySnapshot.empty){
            const firstDoc = querySnapshot.docs[0];
            const userData = firstDoc.data();
            const currentFavorited = userData.favorited_colleges;
            currentFavorited.push(collegeID);
            
            
            await setDoc(firstDoc.ref,
            {
                favorited_colleges: currentFavorited
                
            }, {merge: true});

            alert("College added to Favorites!")
        }
        
        
    } catch (error) {
        console.error("Error adding college to favorites: ", error);
        
    }

}

const Admissions = ({navigation, collegeID}) => {
    
    // const collegeID = route.params.collegeID;
    const [admUrl, setAdmUrl] = useState('');
    const [finAidUrl, setFinAidUrl] = useState('');
    const [priceCalcUrl, setPriceCalcUrl] = useState('');
    const [showWebView, setShowWebView] = useState(null);


    useEffect(()=> {
        const func = async()=> {
            const collegeQuery = query(collegesRef, where('school_id', '==', parseInt(collegeID)));
            try {
                const querySnapshot = await getDocs(collegeQuery);
              
                if (!querySnapshot.empty) {
                  const firstDoc = querySnapshot.docs[0];
                  const collegeData = firstDoc.data();
                  const admissionWebsite = collegeData.admission_website;
                  const finAidWebsite = collegeData.fincAid_website;
                  const priceCalcWebsite = collegeData.priceCalculator_website;

              
                  setAdmUrl(admissionWebsite);
                  setFinAidUrl(finAidWebsite);
                  setPriceCalcUrl(priceCalcWebsite);
                  
                } else {
                  console.log('No matching document found.');
                }
              } catch (error) {
                console.error('Error retrieving document:', error);
              }

            
        }
        func();
        // console.log(admUrl)

    },[admUrl, finAidUrl, priceCalcUrl]);

    const Link = ({uri}) => {
        
        return(
        <View style={styles.webView}>
            <TouchableOpacity style={styles.button} onPress={()=> setShowWebView(null)}>
                    <Text style={styles.buttonText}> Back </Text>
            </TouchableOpacity>
            <WebView
            styles={{flex:1}}
            originWhitelist={['*']}
            source={{uri}}
        
            />
        </View>
        )   
    }

    const AdmOverView = () => {
        return (
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.button} onPress={()=> setShowWebView('admissions')}>
                    <Text style={styles.buttonText}> Admissions Page </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=> setShowWebView('finAid')}>
                    <Text style={styles.buttonText}> Financial Aid Page </Text>
                </TouchableOpacity>
                {priceCalcUrl != '' && (
                    <TouchableOpacity style={styles.button} onPress={()=> setShowWebView('priceCalc')}>
                        <Text style={styles.buttonText}> Price Calculator </Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }



    return (

        <View>
            
            {showWebView === null && <AdmOverView/>}
            {showWebView === 'admissions' && <Link uri={admUrl}/>}
            {showWebView === 'finAid' && <Link uri={finAidUrl}/>}
            {showWebView === 'priceCalc' && <Link uri={priceCalcUrl}/>}


        
        </View>
        
            
            
        
    )
}

const Demographics = ({navigation, collegeID}) => {

    // const collegeID = route.params.collegeID;
    const [sToF, setSToF] = useState(0);
    const [userPref, setUserPref] = useState([]);
    const [circleData, setCircleData] = useState([]);
    const user = auth().currentUser.uid;
    const [majors, setMajors] = useState([]);


    useEffect(()=> {
        const func = async()=> {
            const collegeQuery = query(collegesRef, where('school_id', '==', parseInt(collegeID)));
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

            
        }
        func();
        // console.log(sToF)

    },[sToF, majors]);



    useEffect(()=> {
        const func = async()=> {
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

            
        }
        func();
        // console.log(userPref)

    },[userPref]);

    

    useEffect(() => {
        const generateCircleData = () => {
            const data = [];
            const Xmin = 145;
            const Xmax = 350;
            const Ymin = 20;
            const Ymax = 155;
            const radius = 15; // Radius of the circles

            while (data.length < sToF) {
                const newCircle = {
                    cx: Math.random() * (Xmax - Xmin) + Xmin,
                    cy: Math.random() * (Ymax - Ymin) + Ymin,
                    r: radius,
                };

                // Check if the new circle overlaps with any existing circles
                let overlap = false;
                for (let i = 0; i < data.length; i++) {
                    if (doCirclesOverlap(newCircle, data[i])) {
                        overlap = true;
                        break;
                    }
                }

                // Add the circle if no overlap was detected
                if (!overlap) {
                    data.push(newCircle);
                }
            }
            setCircleData(data);
        }

        if (sToF > 0) {
            generateCircleData();
        }
    }, [sToF]);

    
    
    return (
        <View style={styles.contentContainer}>
            <View>  
                <Text style={styles.subTitle}>Student to Faculty Ratio: {sToF} </Text>
            </View>
            <Svg height="250" width="100%">
                <Circle
                    cx="50"
                    cy="100"
                    r='50'
                    fill='blue'
                />
                
                {circleData.map((circle, index) => (
                    <Circle
                        key={index}
                        cx={circle.cx}
                        cy={circle.cy}
                        r={circle.r}
                        fill='pink'
                    />
                ))}
            </Svg>
            
            <Text style={styles.subTitle}>Major Break Down</Text>
            {majors.map((major, index)=> (
                <View key={index}>
                    <Text> {major[0]} :</Text>
                    <Text > {major[1]} % </Text>
                </View>
            ))}
            <Text>  </Text>
            <Text>  </Text>
            <Text style={styles.subTitle}>Diversity: </Text>
            <Text> To Be Calculated </Text>
            <Text></Text>
        </View>
    )
   
}

const OverView = ({collegeID}) => {

    const [address, setAddress] = useState([]);
    const [urbanLevel, setUrbanLevel] = useState([]);
    const [admRate, setAdmRate] = useState(0.0);

    useEffect(()=> {
        const func = async()=> {
            const collegeQuery = query(collegesRef, where('school_id', '==', parseInt(collegeID)));
            try {
                const querySnapshot = await getDocs(collegeQuery);
              
                if (!querySnapshot.empty) {
                  const firstDoc = querySnapshot.docs[0];
                  const collegeData = firstDoc.data();
                  const admissionRate = parseFloat(collegeData.adm_rate);
                  const addy = collegeData.address;
                  const urban = collegeData.ubanization_level;
                  const getCity = collegeData.city;
                  const getState = collegeData.state;

                  const getAddy = [addy, getCity, getState];

                  
                  setAddress(getAddy);
                  setUrbanLevel(urban.split(':'));
                  setAdmRate(admissionRate);
                  
                } else {
                  console.log('No matching document found.');
                }
              } catch (error) {
                console.error('Error retrieving document:', error);
              }

            
        }
        func();
        // console.log(admUrl)

    },[address, urbanLevel, admRate]);


    return (
        <View style={styles.contentContainer}>
            <Text style={styles.subTitle}>Address:  </Text>
            <Text>{address[0]}, {address[1]}, {address[2]}</Text>
            
            <Text style={styles.subTitle}>Urbanization Level: </Text>
            <Text>{urbanLevel[1]} {urbanLevel[0]}</Text>
            
            <Text style={styles.subTitle}>Admissions Rate: </Text>
            <Text>{admRate} %</Text>
            
            
        </View>
        
    )
}

const Details = ({route}) => {
    const collegeID = route.params.id;
    const collName = route.params.college;
    const Star = require('../assets/pinkstar.png');

    const data = [
        {
            tabLabel: 'Overview',
            component: OverView,
            props: {collegeID: collegeID}
        },
        {
            tabLabel: 'Admissions',
            component: Admissions,
            props: {collegeID: collegeID}
        },
        {
            tabLabel: 'Demographics',
            component: () => <Demographics collegeID={collegeID} />,
            props: {collegeID: collegeID}
            
        },
    ];
    
    return (
        
            <ScrollView style={styles.container}>
                <View>
                    <TouchableOpacity onPress={()=> {favoriteCollege({ID: collegeID})}} >
                        <Image 
                        style={styles.star} 
                        source={require('../assets/pinkstar.png')}  
                        // onError={(error)=> console.log("Image error: " + error)}
                        />
                    </TouchableOpacity>
                    <Text style={{fontSize: 40, color: 'black', paddingLeft: 15, fontWeight: 'bold'}}>{collName}</Text>
                </View>
                
                <View style={styles.swipView}>
                    <Swiper
                        data={data}
                        isStaticPills={true}
                        stickyHeaderEnabled={true}
                        scrollableContainer={true}
                        stickyHeaderIndex={1}
                        style={swipeStyles}


                    />
                </View>
                
            </ScrollView>
        
    
    )
    
    
}
// const Drawer = createDrawerNavigator();
// const Details = ({route}) => {
//     const id = route.params.id;
        
//     return (
//         <NavigationContainer
//         independent={true}>
//             <Drawer.Navigator initialRouteName='MainDetail'>
//                 <Drawer.Screen name="MainDetail" initialParams={{collegeID: id}} component={MainDetails}/>
//                 <Drawer.Screen name="Admissions" initialParams={{collegeID: id}} component={Admissions}/>
//                 <Drawer.Screen name="Demographics" initialParams={{collegeID: id}} component={Demographics} />

//             </Drawer.Navigator>
//         </NavigationContainer>
//     )
// }

export default Details

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
        flex:1,
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
        height: 1500 
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
        fontStyle:'italic', 
        color:'black'

    }


})

const swipeStyles = {
    borderActive: {
        borderColor: '#FADADD',
    },
    pillLabel: {
        color: '#808080',
    },
    activeLabel: {
        color: '#696880',
    },
};