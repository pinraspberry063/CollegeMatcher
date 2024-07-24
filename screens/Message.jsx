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

const Message = ( {navigation} ) => {
  const theme = useContext(themeContext);
  return (
    <View style={styles.container}>

      <SafeAreaView style={styles.titleContainer}>

          <Text style={[styles.title, {color: theme.color}]}>Message</Text>

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
    fontWeight: 'bold'
    },
});

export default Message;
