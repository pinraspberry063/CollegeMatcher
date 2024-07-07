import React from 'react';
import { Button } from 'react-native-elements';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TabBar from '../components/TabBar';

const Index = ({ navigation }) => {
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
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    marginVertical: 10,
    width: 200,
  },
});

export default Index;
