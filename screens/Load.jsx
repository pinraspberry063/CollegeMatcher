import React, {useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import themeContext from '../theme/themeContext'


const Load = ( {navigation} ) => {
  const theme = useContext(themeContext);
  return (
      <SafeAreaView style={styles.titleContainer}>

          <Text style={[styles.title, {color: 'black'}]}>Loading</Text>

      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 300,
  },
});

export default Load;
