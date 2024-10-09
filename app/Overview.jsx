import {Text,View, StyleSheet, ImageBackground} from 'react-native';
import React, { useEffect, useState} from 'react';
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import {
collection,
getDocs,
getFirestore,
query,
where,
} from 'firebase/firestore';
import Constants from 'expo-constants';


const firestore = getFirestore(db);
const collegesRef = collection(firestore, 'CompleteColleges');

const OverView = ({collegeID}) => {
    const [address, setAddress] = useState([]);
    const [urbanLevel, setUrbanLevel] = useState([]);
    const [admRate, setAdmRate] = useState(0.0);
  
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
      };
      func();
      // console.log(admUrl)
    }, [address, urbanLevel, admRate]);
  
    return (
      <ImageBackground source={require('../assets/galaxy.webp')} style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.subTitle}>Address: </Text>
        <Text style= {{color: 'white'}}>
          {address[0]}, {address[1]}, {address[2]}
        </Text>
  
        <Text style={styles.subTitle}>Urbanization Level: </Text>
        <Text style= {{color: 'white'}}>
          {urbanLevel[1]} {urbanLevel[0]}
        </Text>
  
        <Text style={styles.subTitle}>Admissions Rate: </Text>
        <Text style= {{color: 'white'}}>{admRate} %</Text>
      </View>
      </ImageBackground>
    );
  };

  export default OverView


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      resizeMode: 'cover'
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
      marginTop: 10
    },
  });