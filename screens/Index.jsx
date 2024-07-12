import React from 'react';
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

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

const index = ( {navigation} ) => {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons
        raised
        name='settings-outline'
        //type='ionicon'
        size= {40}
        onPress = {() => {navigation.push('Settings')}}
        />
      </View>
      
      <SafeAreaView style={styles.titleContainer}>
        
          <Text style={styles.title}>College Matcher</Text>
          <Text style={styles.subtitle}>Let colleges find you today!</Text>
        
      </SafeAreaView>

      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={() => {navigation.push('Quiz')}}
          title="Take the Quiz"
          color="#841584"
          accessibilityLabel="Take the quiz to be matched with colleges automatically"
        />
      </View>



      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => { navigation.navigate('Login') }}
          buttonStyle={styles.button}
        />
        <Button
          title="Create Account"
          onPress={() => { navigation.navigate('AccountCreation') }}
          buttonStyle={styles.button}
        />
      </View>

      <TabBar />
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

  },
  buttonContainer:{
    alignItems: 'center',
    paddingTop: 300
  },
  button: {
    width: '50%',
    margin: 10
  }
  
    height: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    marginVertical: 10,
    width: 200,
  },
});

export default index;
