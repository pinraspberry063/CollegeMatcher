import React from 'react';
// import type {PropsWithChildren} from 'react';
import {
  // SafeAreaView,
  // ScrollView,
  // StatusBar,
  StyleSheet,
  Text,
  // useColorScheme,
  View,
} from 'react-native';

import {Stack} from 'expo-router';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

const RootLayout = () => {
  return (
    <Stack.Screen name="index" options= {{}} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
});

export default RootLayout;
