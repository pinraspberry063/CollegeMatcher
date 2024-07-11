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
  },
  subtitle:  {
    fontSize: 20
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 10
  
  }
  
});

export default index;
