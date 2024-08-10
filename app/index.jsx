import React, {useContext, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import themeContext from '../theme/themeContext'
import {EventRegister} from 'react-native-event-listeners'
import auth from '@react-native-firebase/auth';

const Index = ( {navigation} ) => {
  
  const theme = useContext(themeContext);
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons
        color = {theme.color}
        raised
        name='settings-outline'
        //type='ionicon'
        size= {40}
        onPress = {() => {navigation.push('Settings')}}
        />
      </View>
      
      <SafeAreaView style={styles.titleContainer}>
        
          <Text style={[styles.title, {color: theme.color}]}>College Matcher</Text>
          <Text style={[styles.subtitle, {color: theme.color}]}>Let colleges find you today!</Text>
        
      </SafeAreaView>
          {/* <View style={styles.buttonContainer2}>
            <Button
              title="Login"
              onPress={() => { navigation.navigate('Login') }}
              buttonStyle={styles.button2}
            />
            <Button
              title="Create Account"
              onPress={() => { navigation.navigate('AccountCreation') }}
              buttonStyle={styles.button2}
            />
          </View> */}

      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, {textShadowColor: theme.color}]}
          onPress={() => {navigation.push('QuizButton')}}
          title="Take the Quiz"
          color="#841584"
          accessibilityLabel="Take the quiz to be matched with colleges automatically"
        />
        {/* <Button
          style={[styles.button, { textShadowColor: theme.color }]}
          onPress={() => { navigation.push('MakkAI'); }}
          title="MAKK AI"
          color="#841584"
          accessibilityLabel="Chat with MAKK AI"
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 300
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold'
  },
  subtitle:  {
    fontSize: 20
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'light'
  },
  buttonContainer:{
    alignItems: 'center',
    paddingTop: 200
  },
  button: {
    width: '50%',
    margin: 10
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
