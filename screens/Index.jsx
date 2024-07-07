import React from 'react';
import { Button } from 'react-native-elements';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TabBar from '../components/TabBar';

const index = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Icon
          raised
          name='settings-outline'
          type='ionicon'
          onPress={() => { navigation.navigate('Settings') }}
        />
      </View>

      <SafeAreaView style={styles.titleContainer}>
        <Text style={styles.title}>College Matcher</Text>
        <Text style={styles.subtitle}>Let colleges find you today!</Text>
      </SafeAreaView>

      <View style={styles.loginButtonContainer}>
        <Button
          title="Login"
          onPress={() => { navigation.navigate('Login') }}
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
    paddingTop: 200,
  },
  title: {
    fontSize: 50,
  },
  subtitle: {
    fontSize: 20,
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 20,
  },
  loginButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});

export default index;
