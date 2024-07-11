import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CollegePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.square}></View>
      <Text style={styles.text}>Welcome to the College Page!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
  },
  text: {
    marginTop: 20,
    color: '#000', // Ensuring text is visible
  }
});

export default CollegePage;
