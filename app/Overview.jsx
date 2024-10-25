import {Text,View, StyleSheet, ImageBackground} from 'react-native';
import React, { useContext, useEffect, useState} from 'react';
import Constants from 'expo-constants';
import { CollegesContext } from '../components/CollegeContext';
import FastImage from 'react-native-fast-image';


const OverView = ({collegeID}) => {
    // const college = route.params.collegeID;
    
    const [urbanLevel, setUrbanLevel] = useState(collegeID.ubanization_level.split(':'));
    // const {colleges, loading} = useContext(collegeID);
  
  
    return (
      <FastImage source={require('../assets/galaxy.webp')} style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.subTitle}>Address: </Text>
        <Text style= {{color: 'white'}}>
          {collegeID.address}, {collegeID.city}, {collegeID.state}
        </Text>
  
        <Text style={styles.subTitle}>Urbanization Level: </Text>
        <Text style= {{color: 'white'}}>
          {urbanLevel[1]} {urbanLevel[0]}
        </Text>
  
        <Text style={styles.subTitle}>Admissions Rate: </Text>
        <Text style= {{color: 'white'}}>{collegeID.adm_rate} %</Text>
      </View>
      </FastImage>
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