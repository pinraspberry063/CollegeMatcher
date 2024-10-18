import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Button, Dimensions, ImageBackground, Alert} from 'react-native';
import themeContext from '../theme/themeContext';
import { UserContext } from '../components/UserContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import PlanetSwiper from '../components/PlanetSlider.jsx';

const firestore = getFirestore(db);
const { width, height } = Dimensions.get('window'); // Get device dimensions

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
    <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
    <View style={styles.container}>
      <View style={styles.icon}>
        {/* <Ionicons
          color='white'
          raised
          name="settings-outline"
          size={40}
          onPress={() => {
            navigation.push('Settings');
          }}
        /> */}
      </View>

      <SafeAreaView style={styles.titleContainer}>
        <Text style={[styles.title, {color: 'purple'}]}>
          College Matcher
        </Text>
        <Text style={[styles.subtitle, {color: 'white'}]}>
          Let colleges find you today!
        </Text>
      </SafeAreaView>
        
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
        <View style={{marginTop: -30}} >
          <View style={styles.orangeCircle} />
        </View>
          
          <PlanetSwiper navigation={navigation}/> 
        </View>

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

            <Button
              style={[styles.button, { textShadowColor: theme.color }]}
              onPress={() => {
                navigation.push('EditCollege', { collegeDocId });
              }}
              title="Edit College"
              color="#841584"
              accessibilityLabel="Edit your college details"
            />
          </>
        )}
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: height * 0.15, // Dynamic padding based on screen height
  },
  title: {
    fontSize: height * 0.08, // Dynamic font size based on screen height
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: height * 0.03, // Dynamic font size for subtitle
  },
  planetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.1, // Adjust the top margin dynamically
  },
  orangeCircle: {
    width: width * 0.6, // Dynamic width based on screen width
    height: width * 0.6, // Dynamic height based on screen width (to make it circular)
    borderRadius: (width * 0.65) / 2, // Ensure circular shape
    backgroundColor: 'orange',
    position: 'absolute',
    alignSelf: 'center',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.1, // Dynamic top padding
  },
  button: {
    width: width * 0.5, // Dynamic button width
    marginVertical: height * 0.02, // Dynamic margin between buttons
  },
});

export default Index;
