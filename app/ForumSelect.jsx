// College selected. Display the different subgroups within the college's forum.

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc, getDoc, getFirestore, Timestamp, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);


const ForumSelect = ({ route, navigation }) => {
  const { collegeName } = route.params;
  const [subgroups, setSubgroups] = useState([]);
  const [newSubgroupName, setNewSubgroupName] = useState('');
  const { user } = useContext(UserContext);
  const theme = useContext(themeContext);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user) {
      fetchUsername(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const fetchSubgroups = async () => {
      try {
        const subgroupsRef = collection(firestore, 'Forums', collegeName, 'subgroups');
        const subgroupsSnapshot = await getDocs(subgroupsRef);
        const subgroupsList = subgroupsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubgroups(subgroupsList);
      } catch (error) {
        console.error('Error fetching subgroups:', error);
      }
    };

    fetchSubgroups();
  }, [collegeName]);

  const fetchUsername = async (uid) => {
    try {
      const usersRef = collection(firestore, 'Users');
      const q = query(usersRef, where('User_UID', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUsername(userDoc.data().Username);
      } else {
        console.error('No user found with the given UID.');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const handleAddSubgroup = async () => {
    if (newSubgroupName.trim() && username) {
      try {
        const subgroupsRef = collection(firestore, 'Forums', collegeName, 'subgroups');
        const newSubgroup = {
          forumName: newSubgroupName.trim(),
          createdBy: username, // Automatically set to the user's username
          createdAt: Timestamp.now()
        };
        const docRef = await addDoc(subgroupsRef, newSubgroup);
        setSubgroups([...subgroups, { id: docRef.id, ...newSubgroup }]);
        setNewSubgroupName('');
      } catch (error) {
        console.error('Error adding new subgroup:', error);
      }
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
