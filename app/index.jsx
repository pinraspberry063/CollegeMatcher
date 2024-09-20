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

  useEffect(() => {
    const checkSuperRec = async () => {
      if (!user || !user.uid) {
        return;  // User is not logged in
      }

      try {
        // Query the "CompleteColleges" collection where "SuperRec" matches the user's UID
        const q = query(
          collection(firestore, 'CompleteColleges'),
          where('SuperRec', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);

        // If a document is found, the user is a SuperRec
        if (!querySnapshot.empty) {
          setIsSuperRec(true);
        }
      } catch (error) {
        console.error('Error checking SuperRec:', error);
        Alert.alert('Error', 'Failed to check SuperRec status.');
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
          <Button
            style={[styles.button, { textShadowColor: theme.color }]}
            onPress={() => {
              navigation.push('AddRecs');  // Navigate to your desired screen
            }}
            title="Super Recruiter"
            color="#841584"
            accessibilityLabel="Access Super Recruiter features"
          />
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
