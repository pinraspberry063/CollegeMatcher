import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import DropdownComponent from '../components/DropdownComp';
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';

const firestore = getFirestore(db);
const usersRef = collection(firestore, 'Users');

const favoriteCollege = async ({ID}) => {
  const collegeID = parseInt(ID);

  const userQuery = query(usersRef, where('User_UID', '==', user));

  try {
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0];
      const userData = firstDoc.data();
      const currentFavorited = userData.favorited_colleges;
      currentFavorited.push(collegeID);

      await setDoc(
        firstDoc.ref,
        {
          favorited_colleges: currentFavorited,
        },
        {merge: true},
      );

      alert('College added to Favorites!');
    }
  } catch (error) {
    console.error('Error adding college to favorites: ', error);
  }
};

const Results = ({route, navigation}) => {
  const top100 = route.params.top100;
  const user = auth().currentUser.uid;

  // const screen = route.params.screen;

  // const firestore = getFirestore(db);
  // const resultsRef = collection(firestore, 'Users')
  // const resultDoc = query(resultsRef, where('User_UID', '==', auth().currentUser.uid));
  // const docID = (await getDocs(resultDoc)).docs[0].ref;
  // const savedData = docID.top100Colleges;

  const [numResults, setNumResults] = useState(5);

  const renderItem = ({item}) => (
    <ScrollView style={styles.card}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          favoriteCollege({ID: item.id});
        }}>
        <Image
          style={{width: 20, height: 20, alignSelf: 'flex-end'}}
          source={require('../assets/pinkstar.png')}

          // onError={(error)=> console.log("Image error: " + error)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.push('Details', {college: item.name, id: item.id})
        }>
        <Text style={styles.collegeName}>{item.name}</Text>
        <Text style={styles.collegeScore}>Match Percent: {item.score}%</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const numResultsData = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top College Matches</Text>
      <FlatList
        data={top100}
        renderItem={renderItem}
        // keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingTop: 10,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
    paddingTop: 60,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  collegeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  collegeScore: {
    fontSize: 16,
    color: '#555',
  },
  dropdown: {
    width: 100,
  },
  button: {
    width: 20,
    marginLeft: '93%',
    alignContent: 'flex-end',
  },
});

export default Results;
