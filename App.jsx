// noinspection JSUnusedLocalSymbols

import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Alert, Image} from 'react-native';
import { registerRootComponent } from 'expo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';
import { UserProvider } from './components/UserContext';
import themeContext from './theme/themeContext';
import theme from './theme/theme';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Quiz from './app/Quiz';
import Settings from './app/Settings';
import Home from './app/index';
import Account from './app/AccSettings';
import Picker from './app/ProfileImageComp';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Launch from './app/Launch';
import Preferences from './app/Preferences';
import ColForum from './app/ColForum';
// noinspection SpellCheckingInspection
import RoomateMatcher from './app/RoomateMatcher';
// noinspection SpellCheckingInspection
import RoomateResults from './app/RoomateResults';
import Message from './app/Message';
import RoomateMessage from './app/RoomateMessage';
import RecConvs from './app/RecConvs';
import MakkAI from './app/MakkAI';
import Login from './app/Login';
import AccountCreation from './app/AccountCreation';
import Results from './app/Results';
import Details from './app/Details';
import {db} from './config/firebaseConfig';
import {
  collection,
  // addDoc,
  getDocs,
  doc,
  // setDoc,
  getFirestore,
  query,
  where,
  getDoc,
} from 'firebase/firestore';
import FavoritedColleges from './app/FavoritedColleges';
import ColForumSelector from './app/ColForumSelector';
import ForumSelect from './app/ForumSelect';
import FollowedForums from './app/FollowedForums';
import PhoneVerification from './app/PhoneVerification';
import ModeratorScreen from './app/ModeratorScreen';
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

import Onboarding from 'react-native-onboarding-swiper';

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    background: '#fff',
  },
};

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen name="Index" component={Home} />
    <HomeStack.Screen name="Settings" component={Settings} />
    <HomeStack.Screen name="Account" component={Account} />
    <HomeStack.Screen name="Picker" component={Picker} />
    <HomeStack.Screen name="Preferences" component={Preferences} />
    <HomeStack.Screen name="FavColleges" component={FavoritedColleges} />
    <HomeStack.Screen name="DetailsFav" component={Details} />
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
  console.log('Top100' + Top100);
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
  ColForumSelector: 'forum',
  Messages: 'message',
  // AI: 'head', AI: 'brain', AI: 'space-invaders', AI: 'clippy',
  AI: 'chat-question',
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
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          return (
            <MaterialCommunityIcons
              name={icons[route.name]}
              color={color}
              size={size}
            />
          )
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: 60,
          background: '#fff',
        },
      })}>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen
        name="QuizStack"
        initialParams={{Top100: topColleges}}
        component={ResultStackScreen}
      />
      <Tab.Screen name="ColForumSelector" component={ForumStackScreen} />
      <Tab.Screen name="Messages" component={MessageStackScreen} />
      <Tab.Screen name="AI" component={AIStackScreen} />
      {/*     {checkUserStatus === 'moderator' && ( */}
      <Tab.Screen name="Moderation" component={ModeratorScreen} />
      {/*             )} */}
      <Tab.Screen
        name="UserActivityScreen"
        component={UserActivityScreen}
        options={{tabBarButton: () => null}}
      />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator();
const LaunchStack = createNativeStackNavigator();
const LaunchStackScreen = () => (
  <LaunchStack.Navigator screenOptions={screenOptions}>
    <LaunchStack.Screen name="LaunchScreen" component={Launch} />
    <LaunchStack.Screen name="Login" component={Login} />
    <LaunchStack.Screen name="CreateAccount" component={AccountCreation} />
    <LaunchStack.Screen
      name="PhoneVerification"
      component={PhoneVerification}
    />
  </LaunchStack.Navigator>
);

const checkUserStatus = async (userId) => {
  // noinspection JSCheckFunctionSignatures
  const firestore = getFirestore(db);
  const userRef = doc(firestore, 'Users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    if (userData.status === 'banned') {
      auth().signOut();
      Alert.alert(
        'Account Banned',
        'Your account has been banned. Please contact support for more information.',
      );
      return 'banned';
    } else if (userData.isModerator) {
      return 'moderator';
    }
  }
  return 'regular';
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [takenQuiz, setTakenQuiz] = useState(false);
  const [topColleges, setTopColleges] = useState([]);
  const [initializing, setInitializing] = useState(true); // indicates whether app is still checking for INITIAL auth state
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Function to clear AsyncStorage
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const listener = EventRegister.addEventListener('Change Theme', data => {
      setDarkMode(data);
    });
    return () => {
      // EventRegister.removeAllListeners(listener);
      EventRegister.removeAllListeners();
    };
  }, [darkMode]);

  // Dependency on data
  useEffect(() => {
    if (__DEV__) {  // evals to true when on a dev build
      clearAsyncStorage();
      // setShowOnboarding(false); // uncomment to hide onboarding
    }

    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem('hasOnboarded');
      if (value === null) {
        setShowOnboarding(true);
      }
    };
    checkOnboarding();

    const subscriber = auth().onAuthStateChanged(()=> setUser(user));
    if (initializing){
      setInitializing(false);
    }
    return subscriber; // unsubscribe on unmount
  }, [user, initializing]);

  const handleDynamicLink = async link => {
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

    return () => unsubscribe();
  }, []);

  if (initializing) return null;
  if (showOnboarding) {
    return (
        <Onboarding
            // bottomBarColor={'#40FF00'}
            onDone={async () => {
              await AsyncStorage.setItem('hasOnboarded', 'true');
              setShowOnboarding(false);
            }}
            onSkip={async () => {
              await AsyncStorage.setItem('hasOnboarded', 'true');
              setShowOnboarding(false);
            }}
            pages={[
              {
                backgroundColor: '#fff',
                image: <Image source={require('./assets/Launch.png')}
                              style={styles.image}
                />,
                title: 'Welcome to Universe college matcher!',
                subtitle: '',
              },
              {
                backgroundColor: '#fff',
                size: '',
                image: <Image source={require('./assets/Form.png')}
                              style={styles.image}
                />,
                title: 'College Matcher Quiz',
                subtitle: 'Check out our college matching quiz today!',
              },
              {
                backgroundColor: '#fff',
                image: <Image source={require('./assets/Community.png')}
                              style={styles.image}
                />,
                title: 'Forums',
                subtitle: 'Chat with other students in the forums!',
              },
              {
                backgroundColor: '#fff',
                image: <Image source={require('./assets/Chatbot.png')}
                              style={styles.image}
                />,
                title: 'Get Help',
                subtitle: 'Chat with an AI assistant or connect with recruiters!',
              },
              {
                backgroundColor: '#fff',
                image: <Image source={require('./assets/Secure-login.png')}
                              style={styles.image}
                />,
                title: 'Login to get started!',
                subtitle: '',
              },
            ]}
            containerStyles={styles.container}
            imageContainerStyles={styles.imageContainer}
        />
    );
  }


  return (
    <UserProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <themeContext.Provider
          value={darkMode === true ? theme.dark : theme.light}>
          <NavigationContainer
            theme={darkMode === true ? DarkTheme : DefaultTheme}>
            <RootStack.Navigator screenOptions={screenOptions}>
              <RootStack.Screen
                name="Launch"
                component={LaunchStackScreen}
                options={{headerShown: false}}
              />
              <RootStack.Screen
                name="Main"
                component={TabScreen}
                options={{headerShown: false}}
              />
            </RootStack.Navigator>
          </NavigationContainer>
        </themeContext.Provider>
      </GestureHandlerRootView>
    </UserProvider>
  );
};

export default registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  imageContainer: {
    // paddingBottom: 1,
    // paddingVertical: 1
  },
  title: {
    // marginTop: 10,
  },
  image: {
    resizeMode: 'contain',
    width: '70%',
    height: '70%',
  },
});