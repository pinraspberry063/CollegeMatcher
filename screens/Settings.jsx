import React, {useState} from 'react';
// import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  // useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const settings = ({navigation}) => {


  return (
    <View style={styles.container}>
      <ScrollView>

          <TouchableOpacity onPress={() => navigation.push('Account')}>

            <Text style={styles.item}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.push('Preferences')}>

            <Text style={styles.item}>Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Favorited Colleges")}>

            <Text style={styles.item}>Favorited Colleges</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Saved MAKK Chats")}>

            <Text style={styles.item}>Saved MAKK Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Privacy")}>

            <Text style={styles.item}>Privacy</Text>
          </TouchableOpacity>


      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    fontSize: 30,
    padding: 20,

  },
});

export default settings;
