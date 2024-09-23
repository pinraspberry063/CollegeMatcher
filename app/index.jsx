import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Button, Dimensions, Animated, TouchableWithoutFeedback , TouchableOpacity, ImageBackground} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import themeContext from '../theme/themeContext';
import {EventRegister} from 'react-native-event-listeners';
import auth from '@react-native-firebase/auth';

import PlanetSwiper from '../components/PlanetSlider.jsx';
const Index = ({navigation}) => {
  const theme = useContext(themeContext);



  return (
    <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons
          color='white'
          raised
          name="settings-outline"
          //type='ionicon'
          size={40}
          onPress={() => {
            navigation.push('Settings');
          }}
        />
      </View>

      <SafeAreaView style={styles.titleContainer}>
        <Text style={[styles.title, {color: 'purple'}]}>
          College Matcher
        </Text>
        <Text style={[styles.subtitle, {color: 'white'}]}>
          Let colleges find you today!
        </Text>
      </SafeAreaView>
        
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
           {/* Orange central view */}
        <View style={{marginTop: -30}} >
          <View style={styles.orangeCircle} />
        </View>
          
          <PlanetSwiper /> 
        </View>

        
      
      

      
      

      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, {textShadowColor: theme.color}]}
          onPress={() => {
            navigation.push('QuizButton');
          }}
          title="Take the Quiz"
          color="#841584"
          accessibilityLabel="Take the quiz to be matched with colleges automatically"
        />
      
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover'
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 150,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'light',
  },
  orangeCircle: {
    width: 250,
    height: 250,
    borderRadius: 225,
    backgroundColor: 'orange',
    position: 'absolute', 
    alignSelf: 'center' 
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
  },
  button: {
    width: '50%',
    margin: 10,
  },

  buttonContainer2: {
    alignItems: 'center',
    marginTop: 20,
  },
  button2: {
    marginVertical: 10,
    width: 200,
  },
});

export default Index;
