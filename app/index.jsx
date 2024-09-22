import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Button, StyleSheet, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import themeContext from '../theme/themeContext';
import { UserContext } from '../components/UserContext';  // Import the UserContext
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';  // Firestore imports
import { db } from '../config/firebaseConfig';  // Import Firebase configuration

const firestore = getFirestore(db);  // Initialize Firestore

const Index = ({ navigation }) => {
  const theme = useContext(themeContext);
  const { user } = useContext(UserContext);  // Get the current logged-in user
  const [isSuperRec, setIsSuperRec] = useState(false);  // State to track if the user is SuperRec
  const [collegeDocId, setCollegeDocId] = useState(null);  // Track the document ID for the college

  useEffect(() => {
    const checkSuperRec = async () => {
      if (!user || !user.uid) {
        return;  // User is not logged in
      }

      try {
        // Step 1: Query the "Users" collection to find the logged-in user and check if they are a Super Recruiter
        const userQuery = query(
          collection(firestore, 'Users'),
          where('User_UID', '==', user.uid)
        );

        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();

          // Check if the user is a Super Recruiter
          if (userData.SuperRecruiter) {
            setIsSuperRec(true);

            // Step 2: Use the "RecruiterInstitution" field to find the college in "CompleteColleges"
            const recruiterInstitution = userData.RecruiterInstitution;

            const collegeQuery = query(
              collection(firestore, 'CompleteColleges'),
              where('shool_name', '==', recruiterInstitution)
            );

            const collegeSnapshot = await getDocs(collegeQuery);

            // If a matching college document is found, save the document ID
            if (!collegeSnapshot.empty) {
              setCollegeDocId(collegeSnapshot.docs[0].id);
            } else {
              Alert.alert('Error', 'College not found for the given institution.');
            }
          }
        } else {
          Alert.alert('Error', 'User data not found.');
        }
      } catch (error) {
        console.error('Error checking SuperRec:', error);
        Alert.alert('Error', 'Failed to check Super Recruiter status.');
      }
    };

    checkSuperRec();
  }, [user]);  // Run the check when the component mounts or user changes

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons
          color={theme.color}
          raised
          name="settings-outline"
          size={40}
          onPress={() => {
            navigation.push('Settings');
          }}
        />
      </View>

      <SafeAreaView style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.color }]}>College Matcher</Text>
        <Text style={[styles.subtitle, { color: theme.color }]}>
          Let colleges find you today!
        </Text>
      </SafeAreaView>

      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, { textShadowColor: theme.color }]}
          onPress={() => {
            navigation.push('QuizButton');
          }}
          title="Take the Quiz"
          color="#841584"
          accessibilityLabel="Take the quiz to be matched with colleges automatically"
        />

        {/* Conditionally render the SuperRec button */}
        {isSuperRec && (
          <>
            <Button
              style={[styles.button, { textShadowColor: theme.color }]}
              onPress={() => {
                navigation.push('AddRecs');  // Navigate to AddRecs screen
              }}
              title="Add Recruiters to Institution"
              color="#841584"
              accessibilityLabel="Access who is considered a recruiter within your institution."
            />

            {/* New Edit College Button */}
            <Button
              style={[styles.button, { textShadowColor: theme.color }]}
              onPress={() => {
                navigation.push('EditCollege', { collegeDocId });  // Navigate to EditCollege page with the document ID
              }}
              title="Edit College"
              color="#841584"
              accessibilityLabel="Edit your college details"
            />
          </>
        )}
      </View>
    </View>
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
  title: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'light',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: 200,
  },
  button: {
    width: '50%',
    margin: 10,
  },
});

export default Index;
