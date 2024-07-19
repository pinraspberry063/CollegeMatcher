import React, {useContext} from 'react';
// import type {PropsWithChildren} from 'react';
import TabBar from '../components/TabBar'
import {
  SafeAreaView,
  ScrollView,
  // StatusBar,
  StyleSheet,
  Text,
  // useColorScheme,
  View,
  Button
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import themeContext from '../theme/themeContext'
import Settings from './Settings';
import Account from './AccSettings';
import Quiz from './Quiz';
import Login from './Login'
import AccountCreation from './AccountCreation'
import Preferences from './Preferences';
import {Link, Redirect} from 'expo-router';


const Home = ( {navigation} ) => {
  const theme = useContext(themeContext);
  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <View style={styles.icon}>
            <Ionicons
            color = {theme.color}
            raised
            name='settings-outline'
            //type='ionicon'
            size= {40}
            onPress={()=> {navigation.navigate('Settings')}}
            />
        </View>
      </View>
      
      <SafeAreaView style={styles.titleContainer}>
        
          <Text style={[styles.title, {color: theme.color}]}>College Matcher</Text>
          <Text style={[styles.subtitle, {color: theme.color}]}>Let colleges find you today!</Text>
        
      </SafeAreaView>

      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, {textShadowColor: theme.color}]}
          onPress={() => {navigation.navigate('Quiz')}}
          title="Take the Quiz"
          color="#841584"
          accessibilityLabel="Take the quiz to be matched with colleges automatically"
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    height: '5%',
    backgroundColor: 'grey'
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

export default Home

export {
  Login, 
  AccountCreation,
  Account, 
  Preferences,
  Quiz,
  Settings

}
