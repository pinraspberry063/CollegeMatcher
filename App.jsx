import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';
import { UserProvider } from './components/UserContext';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Quiz from './app/Quiz';
import Settings from './app/Settings';
import Home from './app/index';
import Account from './app/AccSettings';
import Picker from './app/ProfileImageComp';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Launch from './app/Launch';
import Preferences from './app/Preferences';
import ColForum from './app/ColForum';
import RoomateMatcher from './app/RoomateMatcher';
import RoomateResults from './app/RoomateResults';
import Message from './app/Message';
import RoomateMessage from './app/RoomateMessage';
import RoomateViewQuiz from './app/RoomateViewQuiz';
import RecConvs from './app/RecConvs';
import MakkAI from './app/MakkAI';
import Login from './app/Login';
import AccountCreation from './app/AccountCreation';
import Results from './app/Results';
import Details from './app/Details';
import EmailVerificationPrompt from './app/EmailVerificationPrompt';

import ColForumSelector from './app/ColForumSelector';
import ForumSelect from './app/ForumSelect';
import FollowedForums from './app/FollowedForums';
import PhoneVerification from './app/PhoneVerification';
import ModeratorScreen from './app/ModeratorScreen';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getFirestore,
  query,
  where,
  getDoc,
} from 'firebase/firestore';
import { db } from './config/firebaseConfig';
import UserActivityScreen from './app/UserActivityScreen';
import RecruiterVerification from './app/RecruiterVerification';
import AddRecs from './app/AddRecs';
import FavColleges from './app/FavColleges';
import EditCollege from './app/EditCollege';
import MFAScreen from './app/MFAScreen';
import CompareColleges from './app/CompareColleges';
import UsernamePrompt from './app/UsernamePrompt';
import { CollegesProvider } from './components/CollegeContext';
import ProfilePage from './app/ProfilePage';



const firestore = getFirestore(db);


const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    background: "#fff"
  }
};

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen name="Index" component={Home} />
    <HomeStack.Screen name="Settings" component={Settings} />
    <HomeStack.Screen name="Account" component={Account} />
    <HomeStack.Screen name="Picker" component={Picker} />
    <HomeStack.Screen name="Preferences" component={Preferences} />
    <HomeStack.Screen name="QuizButton" component={QuizStackScreen} />
    <HomeStack.Screen name="AddRecs" component={AddRecs} />
    <HomeStack.Screen name="FavColleges" component={FavColleges} />
    <HomeStack.Screen name="EditCollege" component={EditCollege} />
    <HomeStack.Screen name="CompareColleges" component={CompareColleges} />
    <HomeStack.Screen name="ProfilePage" component={ProfilePage} />
  </HomeStack.Navigator>
);

const MessageStack = createNativeStackNavigator();
const MessageStackScreen = () => (
  <MessageStack.Navigator screenOptions={screenOptions}>
    <MessageStack.Screen name="RecConvs" component={RecConvs} />
    <MessageStack.Screen name="Message" component={Message} />
  </MessageStack.Navigator>
);

const QuizStack = createNativeStackNavigator();
const QuizStackScreen = () => (
  <QuizStack.Navigator screenOptions={screenOptions}>
    <QuizStack.Screen name="Quiz" component={Quiz} />
    <QuizStack.Screen name="Results" component={Results} />
    <QuizStack.Screen name="Details" component={Details} />
  </QuizStack.Navigator>
);


const ResultStack = createNativeStackNavigator();
const ResultStackScreen = ({route}) => {
  const Top100 = route.params.Top100;
  // console.log('Top100' + Top100);
  return (
    <ResultStack.Navigator screenOptions={screenOptions}>
      <ResultStack.Screen
        name="Results"
        initialParams={{top100: Top100}}
        component={Results}
      />
      <ResultStack.Screen name="Details" component={Details} />
    </ResultStack.Navigator>
  );
};

const ForumStack = createNativeStackNavigator();
const ForumStackScreen = () => (
  <ForumStack.Navigator screenOptions={screenOptions}>
    <ForumStack.Screen name="ColForumSelector" component={ColForumSelector} />
    <ForumStack.Screen name="Forum" component={ColForum} />
    <ForumStack.Screen name="ForumSelect" component={ForumSelect} />
    <ForumStack.Screen name="FollowedForums" component={FollowedForums} />
    <ForumStack.Screen name="RoomateMatcher" component={RoomateMatcher} />
    <QuizStack.Screen name="RoomateResults" component={RoomateResults} />
    <MessageStack.Screen name="RoomateMessage" component={RoomateMessage} />
    <QuizStack.Screen name="RoomateViewQuiz" component={RoomateViewQuiz}/>
  </ForumStack.Navigator>
);


const AIStack = createNativeStackNavigator();
const AIStackScreen = () => (
  <AIStack.Navigator screenOptions={screenOptions}>
    <AIStack.Screen name="MakkAI" component={MakkAI} />
  </AIStack.Navigator>
);

const icons = {
  Home: 'home',
  QuizStack: 'magnify',
  ColForumSelectorTab: 'forum',
  Messages: 'message',
  AI: 'head',
  Moderation: 'shield-account'
};

const Tab = createBottomTabNavigator();
const TabScreen = () => {
  const [topColleges, setTopColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const user = auth().currentUser.uid;

  useEffect(() => {
    const checkQuiz = async () => {
      const usersRef = collection(firestore, 'Users');
      const userQuery = query(
        usersRef,
        where('User_UID', '==', auth().currentUser.uid),
      );
      try {
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          const collegeData = firstDoc.data();
          const top100 = collegeData.top100Colleges;

          setTopColleges(top100);
        } else {
          console.log('No matching document found.');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error retrieving document:', error);
      }
    };
    checkQuiz();
  }, [topColleges, isLoading]);

  if (isLoading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  return(
  <TabStack.Navigator
    screenOptions={screenOptions}
  >
    <TabStack.Screen name="Home" component={HomeStackScreen} />
    <TabStack.Screen
        name="QuizStack"
        initialParams={{Top100: topColleges}}
        component={ResultStackScreen}
      />
    <TabStack.Screen name="ColForumSelectorTab" component={ForumStackScreen} />
    <TabStack.Screen name="Messages" component={MessageStackScreen} />
    <TabStack.Screen name="AI" component={AIStackScreen} />
{/*     {checkUserStatus === 'moderator' && ( */}
              <Tab.Screen name="Moderation" component={ModeratorScreen} />
{/*             )} */}
        <TabStack.Screen
              name="UserActivityScreen"
              component={UserActivityScreen}
              options={{ tabBarButton: () => null }}
            />
  </TabStack.Navigator>
)};

const RootStack = createNativeStackNavigator();
const LaunchStack = createNativeStackNavigator();
const TabStack = createNativeStackNavigator();
const LaunchStackScreen = () => (
  <LaunchStack.Navigator screenOptions={screenOptions}>
    <LaunchStack.Screen name="Login" component={Login} />
    <LaunchStack.Screen name="CreateAccount" component={AccountCreation} />
    <LaunchStack.Screen name="PhoneVerification" component={PhoneVerification} />
    <LaunchStack.Screen name="RecruiterVerification" component={RecruiterVerification} />
    <LaunchStack.Screen name="MFAScreen" component={MFAScreen} />
    <LaunchStack.Screen name="UsernamePrompt" component={UsernamePrompt} />
    <LaunchStack.Screen name="EmailVerificationPrompt" component={EmailVerificationPrompt} />
  </LaunchStack.Navigator>
);

const checkUserStatus = async (userId) => {
  const firestore = getFirestore(db);
  const userRef = doc(firestore, 'Users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    if (userData.IsBanned === true) {
      auth().signOut();
      Alert.alert('Account Banned', 'Your account has been banned. Please contact support for more information.');
      return 'banned';
    } else if (userData.isModerator) {
      return 'moderator';
    }
  }
  return 'regular';
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  // const [takenQuiz, setTakenQuiz] = useState(false);
  // const [topColleges, setTopColleges] = useState([]);
  const [initializing, setInitializing] = useState(true); // indicates whether app is still checking for INITIAL auth state
  const [user, setUser] = useState(null);

  useEffect(() => {
    const listener = EventRegister.addEventListener('Change Theme', (data) => {
      setDarkMode(data);
    });
    return () => {
      EventRegister.removeAllListeners(listener);
    };
  }, [darkMode]);

  // Dependency on data
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(()=> setUser(user));
    if (initializing){
      setInitializing(false);
    }
    return subscriber; // unsubscribe on unmount
  }, [user, initializing]);

  const handleDynamicLink = async (link) => {
    if (link.url) {
      console.log('Received dynamic link:', link.url);
      if (auth().isSignInWithEmailLink(link.url)) {
        try {
          const email = await AsyncStorage.getItem('emailForSignIn');
          console.log('Retrieved email for sign-in:', email);
          if (email) {
            const result = await auth().signInWithEmailLink(email, link.url);
            console.log('Sign-in result:', result);
            await AsyncStorage.removeItem('emailForSignIn');
            console.log('User signed in successfully:', result.user.email);
            setUser(result.user);
          } else {
            console.log('No email found for sign-in');
          }
        } catch (error) {
          console.error('Error signing in with email link:', error);
        }
      }
    }
  };

  useEffect(() => {
      const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

      dynamicLinks()
        .getInitialLink()
        .then(link => {
          if (link) {
            handleDynamicLink(link);
          }
        })
        .catch(error => console.error('Error checking initial link:', error));

      return unsubscribe;
    }, []);

    if (initializing) return null;

    return (

        <UserProvider>
        <CollegesProvider>
            <NavigationContainer>
              <RootStack.Navigator screenOptions={screenOptions}>
  {/*                */}{/* {user ? ( */}
  {/*                 <RootStack.Screen name="Main" component={TabScreen} options={{ headerShown: false }} /> */}
  {/*               ) : ( */}
  {/*                 <RootStack.Screen name="Launch" component={LaunchStackScreen} options={{ headerShown: false }} /> */}
  {/*               )} */}
                <RootStack.Screen name="Launch" component={LaunchStackScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="Main" component={TabScreen} options={{ headerShown: false }} />
              </RootStack.Navigator>
            </NavigationContainer>
          </CollegesProvider>
        </UserProvider>
      
    )
  }

export default registerRootComponent(App);

