import React, {useState, useContext} from 'react';
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
import themeContext from '../theme/themeContext'

const Settings = ({navigation}) => {
  const theme = useContext(themeContext);

  return (
    <View style={styles.container}>
      <ScrollView>

          <TouchableOpacity onPress={() => navigation.navigate('Account')}>

            <Text style={[styles.item, {color: theme.color}]}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Preferences')}>

            <Text style={[styles.item, {color: theme.color}]}>Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Favorited Colleges")}>

            <Text style={[styles.item, {color: theme.color}]}>Favorited Colleges</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Saved MAKK Chats")}>

            <Text style={[styles.item, {color: theme.color}]}>Saved MAKK Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Privacy")}>

            <Text style={[styles.item, {color: theme.color}]}>Privacy</Text>
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

export default Settings;
