// College selected. Display the different subgroups within the college's forum.

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc, getDoc, getFirestore, Timestamp, onSnapshot, query, orderBy } from 'firebase/firestore';

const firestore = getFirestore(db);

const ForumSelect = ({ route, navigation }) => {
  const { collegeName } = route.params;
  const [subgroups, setSubgroups] = useState([]);
  const [newSubgroupName, setNewSubgroupName] = useState('');
  const [newSubgroupCreatedBy, setNewSubgroupCreatedBy] = useState('');
  const theme = useContext(themeContext);

  useEffect(() => {
    const fetchSubgroups = async () => {
      const subgroupsRef = collection(firestore, 'Forums', collegeName, 'subgroups');
      const subgroupsSnapshot = await getDocs(subgroupsRef);
      const subgroupsList = subgroupsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubgroups(subgroupsList);
    };

    fetchSubgroups();
  }, [collegeName]);

  const handleAddSubgroup = async () => {
    if (newSubgroupName.trim() && newSubgroupCreatedBy.trim()) {
      const subgroupsRef = collection(firestore, 'Forums', collegeName, 'subgroups');
      const newSubgroup = { forumName: newSubgroupName.trim(), createdBy: newSubgroupCreatedBy.trim() };
      const docRef = await addDoc(subgroupsRef, newSubgroup);
      setSubgroups([...subgroups, { id: docRef.id, ...newSubgroup }]);
      setNewSubgroupName('');
      setNewSubgroupCreatedBy('');
    }
  };

  const handleNavigation = (forumName) => {
    // Navigate to the ColForum screen with the selected forum name
    navigation.navigate('Forum', { collegeName, forumName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {subgroups.map(subgroup => (
          <View key={subgroup.id} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{subgroup.forumName}</Text>
            <Text style={styles.buttonSubText}>Created by: {subgroup.createdBy}</Text>
            <Button
              title="View"
              onPress={() => handleNavigation(subgroup.forumName)}
              color={theme.buttonColor}
            />
          </View>
        ))}
        <View style={styles.newSubgroupContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Subgroup Name"
            value={newSubgroupName}
            onChangeText={setNewSubgroupName}
          />
          <TextInput
            style={styles.input}
            placeholder="Created By"
            value={newSubgroupCreatedBy}
            onChangeText={setNewSubgroupCreatedBy}
          />
          <Button title="Add Subgroup" onPress={handleAddSubgroup} color={theme.buttonColor} />
        </View>
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonSubText: {
    fontSize: 14,
    marginBottom: 8,
  },
  newSubgroupContainer: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default ForumSelect;
