import {Text,View, StyleSheet, ImageBackground} from 'react-native';
import React, { useContext, useEffect, useState} from 'react';
import Constants from 'expo-constants';
import { CollegesContext } from '../components/CollegeContext';


const OverView = ({collegeID}) => {
    const [address, setAddress] = useState([]);
    const [urbanLevel, setUrbanLevel] = useState([]);
    const [admRate, setAdmRate] = useState(0.0);
    const {colleges, loading} = useContext(CollegesContext);
  
    useEffect(() => {
      const func = async () => {

        try {
          const selCollege = colleges.filter(college => college.school_id == parseInt(collegeID));
          const college = selCollege[0];
          const admissionRate = parseFloat(college.adm_rate);
          const addy = college.address;
          const urban = college.ubanization_level;
          const getCity = college.city;
          const getState = college.state;

          const getAddy = [addy, getCity, getState];

          setAddress(getAddy);
          setUrbanLevel(urban.split(':'));
          setAdmRate(admissionRate);
        
        } catch (error) {
          console.error('Error retrieving document:', error);
        }
      };
      func();
    }, [loading]);
  
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