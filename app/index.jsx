import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Button, Dimensions, ImageBackground, Alert} from 'react-native';
import themeContext from '../theme/themeContext';
import { UserContext } from '../components/UserContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import PlanetSwiper from '../components/PlanetSlider.jsx';
import FastImage from 'react-native-fast-image';

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
        const userQuery = query(
          collection(firestore, 'Users'),
          where('User_UID', '==', user.uid)
        );

        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();

          if (userData.SuperRecruiter) {
            setIsSuperRec(true);

            const recruiterInstitution = userData.RecruiterInstitution;

            const collegeQuery = query(
              collection(firestore, 'CompleteColleges'),
              where('shool_name', '==', recruiterInstitution)
            );

            const collegeSnapshot = await getDocs(collegeQuery);

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
  }, [user]);

  return (
    <FastImage source={require('../assets/galaxy.webp')} style={styles.background}>
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
        
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', marginTop: 150}}>
           {/* Orange central view */}
        <View style={{marginTop: -100}} >
          <View style={styles.orangeCircle} />
    <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
      <View style={styles.container}>
        <SafeAreaView style={styles.titleContainer}>
          <Text style={[styles.title, {color: 'purple'}]}>
            College Matcher
          </Text>
          <Text style={[styles.subtitle, {color: 'white'}]}>
            Let colleges find you today!
          </Text>
        </SafeAreaView>

        {/* Place the sun image as a background */}
        <View style={styles.sunContainer}>
          <ImageBackground
            source={require('../assets/sun.png')}
            style={styles.sunImage}
            resizeMode="contain"
          />
        </View>

        {/* PlanetSwiper is positioned over the sun */}
        <View style={styles.planetContainer}>
          <PlanetSwiper navigation={navigation} />
        </View>

        {/* Buttons placed below the planets and sun */}
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
                  navigation.push('AddRecs');
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
    paddingTop: height * 0.1, // Dynamic padding based on screen height
  },
  title: {
    fontSize: height * 0.08, // Dynamic font size based on screen height
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: height * 0.03, // Dynamic font size for subtitle
  },
  sunContainer: {
    position: 'absolute',
    top: height * 0.35,
    left: width * 0.1,
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunImage: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.8) / 2,
  },
  planetContainer: {
    position: 'absolute',
    top: height * 0.3,
    left: 0,
    right: 0,
    zIndex: 1,
    height: height * 0.5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.1,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: width * 0.5,
    marginVertical: height * 0.02,
  },
});

export default Index;
