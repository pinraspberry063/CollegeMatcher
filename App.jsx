// noinspection JSUnusedLocalSymbols

import React, { useState, useEffect, useContext} from 'react';
import {StyleSheet, Text, View, Alert, Image, ActivityIndicator, useWindowDimensions} from 'react-native';
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
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Launch from './app/Launch';
import Preferences from './app/Preferences';
import ColForum from './app/ColForum';
// noinspection SpellCheckingInspection
import RoomateMatcher from './app/RoomateMatcher';
// noinspection SpellCheckingInspection
import RoomateResults from './app/RoomateResults';
import Message from './app/Message';
import ViewMessage from './app/ViewMessage'
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
  // addDoc,
  getDocs,
  doc,
  // setDoc,
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
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'


import CommentPage from './app/CommentPage';
import Onboarding from 'react-native-onboarding-swiper';
import FastImage from 'react-native-fast-image';

const firestore = getFirestore(db);

// Create a query client instance
const queryClient = new QueryClient();

const fetchAllColleges = async () => {
  const snapshot = await getDocs(collection(firestore, 'CompleteColleges'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

};
// // Pre-fetch the data before rendering the app
// const colleges = queryClient.prefetchQuery({
//     queryKey: ['colleges'], // Now an array inside an object
//     queryFn: fetchAllColleges, // Query function passed as part of the object
//   })
//   .then(() => {
//     console.log('Data has been pre-fetched');
//   })
//   .catch((error) => {
//     console.error('Error pre-fetching data:', error);
//   });

queryClient.prefetchQuery({
      queryKey: ['colleges'], // Now an array inside an object
      queryFn: fetchAllColleges, // Query function passed as part of the object
    })
    .then(() => {
      console.log('Data has been pre-fetched');
    })
    .catch((error) => {
      console.error('Error pre-fetching data:', error);
    });


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
    background: "#fff",
    
  }
};

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen name="Index" component={Home} />
    <HomeStack.Screen name="Settings" component={Settings} />
    <HomeStack.Screen name="Account" component={Account} />
    <HomeStack.Screen name="Picker" component={Picker}  />
    <HomeStack.Screen name="Preferences" component={Preferences} />
    <HomeStack.Screen name="QuizButton" component={QuizStackScreen} />
    <HomeStack.Screen name="AddRecs" component={AddRecs} />
    <HomeStack.Screen name="FavColleges" component={FavColleges} />
    <HomeStack.Screen name="EditCollege" component={EditCollege} />
    <HomeStack.Screen name="CompareColleges" component={CompareColleges} />
    <HomeStack.Screen name="ProfilePage" component={ProfilePage} />
    <HomeStack.Screen name="AI" component={AIStackScreen} />
    <HomeStack.Screen name="ModeratorScreen" component={ModeratorScreen} />
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
    <ForumStack.Screen name="CommentPage" component={CommentPage}/>
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
  AI: 'chat-question',
  Moderation: 'shield-account'
};

const Tab = createBottomTabNavigator();
// const MainNav = () => {
//   const [topColleges, setTopColleges] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   // const user = auth().currentUser.uid;

//   useEffect(() => {
//     const checkQuiz = async () => {
//       const usersRef = collection(firestore, 'Users');
//       const userQuery = query(
//         usersRef,
//         where('User_UID', '==', auth().currentUser.uid),
//       );
//       try {
//         const querySnapshot = await getDocs(userQuery);

//         if (!querySnapshot.empty) {
//           const firstDoc = querySnapshot.docs[0];
//           const collegeData = firstDoc.data();
//           const top100 = collegeData.top100Colleges;

//           setTopColleges(top100);
//         } else {
//           console.log('No matching document found.');
//         }
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error retrieving document:', error);
//       }
//     };
//     checkQuiz();
//   }, [topColleges, isLoading]);

//   if (isLoading) {
//     return (
//       <View>
//         <Text>Loading</Text>
//       </View>
//     );
//   }
//   return(
//   <TabStack.Navigator
//     screenOptions={screenOptions}
//   >
//     <TabStack.Screen name="Home" component={HomeStackScreen} />
//     <TabStack.Screen
//         name="QuizStack"
//         initialParams={{Top100: topColleges}}
//         component={ResultStackScreen}
//       />
//     <TabStack.Screen name="ColForumSelectorTab" component={ForumStackScreen} />
//     <TabStack.Screen name="Messages" component={MessageStackScreen} />
//     <TabStack.Screen name="AI" component={AIStackScreen} />
// {/*     {checkUserStatus === 'moderator' && ( */}
//               <TabStack.Screen name="Moderation" component={ModeratorScreen} />
// {/*             )} */}
//         <TabStack.Screen
//               name="UserActivityScreen"
//               component={UserActivityScreen}
//               options={{ tabBarButton: () => null }}
//             />
//             <TabStack.Screen
//               name="Planets"
//               component={TabScreen}
//               options={{ tabBarButton: () => null }}
//             />
//   </TabStack.Navigator>
// )};
const TabScreen = () => {
  const [topColleges, setTopColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldHideTabBar, setShouldHideTabBar] = useState(true);
  const [first, setFirst] = useState(true);
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

  // Function to determine tab bar visibility
  const handleTabVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;
    console.log(routeName)
    if (routeName === 'Index' || routeName === 'Picker' || routeName === 'Home') {
      setShouldHideTabBar(true);  // Hide tab bar on 'Index' and 'Picker'
    } else {
      setShouldHideTabBar(false); // Show tab bar on other screens
    }
    if(first){
      setShouldHideTabBar(true);
      setFirst(false);
    }
  };

  if (isLoading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  return(
  <Tab.Navigator
  screenOptions={({ route }) => {
    
    // Handle visibility when route changes
    useEffect(() => {
      handleTabVisibility(route);
    }, [route]);

    return {
      ...screenOptions,
      tabBarStyle: {
        display: shouldHideTabBar ? 'none' : 'flex', // Control tab bar visibility
      },
        tabBarIcon: () => {
          return (
            <MaterialCommunityIcons
              name={icons[route.name]}
              size={20}
            />
          );
        },
  
      };
      
    }}
  >
    <Tab.Screen name="Home" component={HomeStackScreen}/>
    <Tab.Screen
        name="QuizStack"
        initialParams={{Top100: topColleges}}
        component={ResultStackScreen}
      />
    <Tab.Screen name="ColForumSelectorTab" component={ForumStackScreen} />
    <Tab.Screen name="Messages" component={MessageStackScreen} />
  </Tab.Navigator>
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
    <LaunchStack.Screen
      name="EmailVerificationPrompt"
      component={EmailVerificationPrompt}
      options={{
        headerLeft: () => null, // Hide back button on Android
        gestureEnabled: false // Disable swipe back gesture on IOS
      }}
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
  
  // const [takenQuiz, setTakenQuiz] = useState(false);
  // const [topColleges, setTopColleges] = useState([]);
  const [initializing, setInitializing] = useState(true); // indicates whether app is still checking for INITIAL auth state
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   queryClient.prefetchQuery({
  //     queryKey: ['colleges'], // Key for the cached query
  //     queryFn: fetchAllColleges, // The function to fetch the data
  //   });
  // }, [queryClient]);


  // useEffect(() => {
  //    queryClient.prefetchQuery({
  //         queryKey: ['colleges'], // Key for the cached query
  //         queryFn: fetchAllColleges, // The function to fetch the data
  //       });
  // }, [queryClient]);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const {height: height, width: width} = useWindowDimensions();

  const ui_styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    imageContainer: {
      marginBottom: 20,
    },
    image: {
      width: width * 0.8,
      height: height * 0.4,
      resizeMode: 'contain',
    },
    title: {
      marginBottom: 10,
    },
  });

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };


  // onboarding checks
  useEffect(() => {
    if (__DEV__) {
      AsyncStorage.removeItem('hasOnboarded'); // always shows onboarding for dev
      // setShowOnboarding(false); // can hide onboarding here for testing purposes
    }
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem('hasOnboarded');
      if (value === null) {
        setShowOnboarding(true);
      }
    };
    checkOnboarding();
  }, []);

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
  if (showOnboarding) {
    return (
        <Onboarding
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
                image: <FastImage source={require('./assets/Launch.png')}
                              style={ui_styles.image}
                />,
                title: 'Welcome to Universe college matcher!',
                subtitle: '',
              },
              {
                backgroundColor: '#fff',
                size: '',
                image: <FastImage source={require('./assets/Form.png')}
                              style={ui_styles.image}
                />,
                title: 'College Matcher Quiz',
                subtitle: 'Check out our college matching quiz today!',
              },
              {
                backgroundColor: '#fff',
                image: <FastImage source={require('./assets/Community.png')}
                              style={ui_styles.image}
                />,
                title: 'Forums',
                subtitle: 'Chat with other students in the forums!',
              },
              {
                backgroundColor: '#fff',
                image: <FastImage source={require('./assets/Chatbot.png')}
                              style={ui_styles.image}
                />,
                title: 'Get Help',
                subtitle: 'Chat with an AI assistant or connect with recruiters!',
              },
              {
                backgroundColor: '#fff',
                image: <FastImage source={require('./assets/Secure-login.png')}
                              style={ui_styles.image}
                />,
                title: 'Login to get started!',
                subtitle: '',
              },
            ]}
            containerStyles={ui_styles.container}
            imageContainerStyles={ui_styles.imageContainer}
        />
    );
  }

    return (

        <UserProvider>
        <QueryClientProvider client={queryClient}>
          <CollegesProvider queryClient={queryClient}>
        
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
          </QueryClientProvider>
        </UserProvider>
      
    )
  }

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