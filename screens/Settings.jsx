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
  
  const [setting, setSettings] = useState([
    {title: 'Account', key: '1'},
    {title: 'Favorited Colleges', key: '2'},
    {title: 'Account type', key: '3'},
    {title: 'Preferences', key: '4'},
  ]);


  return (
    <View style={styles.container}>
      <FlatList
        data={setting}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate('SetDetail', item)}>
            <Text style={styles.item}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
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
