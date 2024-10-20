import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
    Image,
  } from 'react-native';
  import React, {Suspense, useEffect, useState} from 'react';
  import Constants from 'expo-constants';
  import axios from 'axios';
  import {createDrawerNavigator} from '@react-navigation/drawer';
  import {NavigationContainer} from '@react-navigation/native';
  import {WebView} from 'react-native-webview';
  import {db} from '../config/firebaseConfig';
  import auth from '@react-native-firebase/auth';
  import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    setDoc,
    getFirestore,
    query,
    where,
  } from 'firebase/firestore';
  import {createNativeStackNavigator} from '@react-navigation/native-stack';
  import {SafeAreaView} from 'react-native-safe-area-context';
  import Swiper from 'react-native-screens-swiper';
  import {color} from 'react-native-elements/dist/helpers';
  import Svg, {Circle, text} from 'react-native-svg';
  import majorData from '../assets/major_data';


  // Lazy load the tabs
const Admissions = React.lazy(() => import('./Admissions'));
const Demographics = React.lazy(() => import('./Demographics'));
const OverView = React.lazy(() => import('./Overview'));
  
  const firestore = getFirestore(db);
  const collegesRef = collection(firestore, 'CompleteColleges');
  const usersRef = collection(firestore, 'Users');
  
//   const doCirclesOverlap = (circle1, circle2) => {
//     const dx = circle1.cx - circle2.cx;
//     const dy = circle1.cy - circle2.cy;
//     const distance = Math.sqrt(dx * dx + dy * dy);
//     const combinedRadii = circle1.r + circle2.r + 6;
//     return distance < combinedRadii;
//   };
  
//   const favoriteCollege = async ({ID}) => {
//     const collegeID = parseInt(ID);
  
//     const userQuery = query(usersRef, where('User_UID', '==', user));
  
//     try {
//       const querySnapshot = await getDocs(userQuery);
  
//       if (!querySnapshot.empty) {
//         const firstDoc = querySnapshot.docs[0];
//         const userData = firstDoc.data();
//         const currentFavorited = userData.favorited_colleges;
//         currentFavorited.push(collegeID);
  
//         await setDoc(
//           firstDoc.ref,
//           {
//             favorited_colleges: currentFavorited,
//           },
//           {merge: true},
//         );
  
//         alert('College added to Favorites!');
//       }
//     } catch (error) {
//       console.error('Error adding college to favorites: ', error);
//     }
//   };
  
  
  
  const Details = ({route}) => {
    const collegeID = route.params.id;
    const collName = route.params.college;
    const collegeobj = route.params.obj;
    // const Star = require('../assets/pinkstar.png');
    
    
    const data = [
      {
        tabLabel: 'Overview',
        component: () => <OverView collegeID={collegeobj}/>,
      
      },
      {
        tabLabel: 'Demographics',
        component: () => <Demographics collegeID={collegeobj}/>,
  
      },
      {
        tabLabel: 'Admissions',
        component: () => <Admissions collegeID={collegeobj} />,
      },
    ];
  
    return (
      <ScrollView style={styles.container}>
        <View style={{height: 200, backgroundColor: '#a49af4'}}>
          <TouchableOpacity
            onPress={() => {
              favoriteCollege({ID: collegeID});
            }}>
            {/* <Image
              style={styles.star}
              source={require('../assets/pinkstar.png')}
              // onError={(error)=> console.log("Image error: " + error)}
            /> */}
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 40,
              color: 'white',
              paddingLeft: 15,
              fontWeight: 'bold',
              paddingTop: Constants.statusBarHeight
            }}>
            {collName}
          </Text>
        </View>
  
        <View style={styles.swipView}>
          <Suspense fallback={<Text> loading </Text>}>
            <Swiper
              data={data}
              isStaticPills={true}
              stickyHeaderEnabled={true}
              scrollableContainer={true}
              stickyHeaderIndex={1}
              style={swipeStyles}
            />
          </Suspense>
        </View>
      </ScrollView>
    );
  };
  // const Drawer = createDrawerNavigator();
  // const Details = ({route}) => {
  //     const id = route.params.id;
  
  //     return (
  //         <NavigationContainer
  //         independent={true}>
  //             <Drawer.Navigator initialRouteName='MainDetail'>
  //                 <Drawer.Screen name="MainDetail" initialParams={{collegeID: id}} component={MainDetails}/>
  //                 <Drawer.Screen name="Admissions" initialParams={{collegeID: id}} component={Admissions}/>
  //                 <Drawer.Screen name="Demographics" initialParams={{collegeID: id}} component={Demographics} />
  
  //             </Drawer.Navigator>
  //         </NavigationContainer>
  //     )
  // }
  
  export default Details;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    star: {
      width: 50,
      height: 50,
      alignSelf: 'flex-end',
      marginTop: 100,
    },
    swipView: {
      flex: 1,
      paddingTop: 10,
      marginBottom: Constants.statusBarHeight,
      justifyContent: 'center',
    },
    contentContainer: {
      paddingLeft: 20,
      width: '100%',
      height: 1500,
      // justifyContent: 'center',
      // alignContent: 'center',
    },
    webView: {
      flex: 1,
      height: 1500,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#A020F0',
      borderRadius: 5,
      marginVertical: 5,
    },
    buttonText: {
      color: '#FADADD',
      textAlign: 'center',
      fontSize: 16,
    },
    subTitle: {
      fontSize: 25,
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: 'black',
    },
  });
  
  const swipeStyles = {
    borderActive: {
      borderColor: '#FADADD',
    },
    pillLabel: {
      color: '#808080',
    },
    activeLabel: {
      color: '#696880',
    },
  };