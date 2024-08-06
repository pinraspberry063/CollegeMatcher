// The screen that displays the different colleges' forums that the user can navigate to.

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc, getDoc, getFirestore, Timestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);

const ColForumSelector = ({ navigation }) => {
  const [colleges, setColleges] = useState([
    "Louisiana Tech University",
    "Test college",
    "Test college2"
  ]);
  const theme = useContext(themeContext);

  const handleNavigation = async (collegeName) => {
    const collegeDocRef = doc(firestore, 'Forums', collegeName);
    const collegeDocSnap = await getDoc(collegeDocRef);

    if (!collegeDocSnap.exists()) {
      // Create a new document if it doesn't exist
      await setDoc(collegeDocRef, {});
    }

    navigation.navigate('ForumSelect', { collegeName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {colleges.map(college => (
          <View key={college} style={styles.buttonContainer}>
            <Button
              title={college}
              onPress={() => handleNavigation(college)}
              color={theme.buttonColor}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
});

export default ColForumSelector;
