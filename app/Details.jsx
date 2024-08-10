import { ScrollView, StyleSheet, Text, View , Button} from 'react-native'
import React, {useEffect, useState} from 'react'
import { Image } from 'react-native-elements';
import Constants from 'expo-constants';
import axios from 'axios';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import  {WebView } from 'react-native-webview';
import { db } from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, addDoc, getDocs, getDoc, doc, setDoc , getFirestore, query, where} from 'firebase/firestore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const firestore = getFirestore(db);

const Admissions = ({navigation, route}) => {
    
    const collegeID = route.params.collegeID;
    
    const [admUrl, setAdmUrl] = useState('');
    useEffect(()=> {
        const func = async()=> {
            const collegesRef = collection(firestore, 'CompleteColleges');
            const collegeQuery = query(collegesRef, where('school_id', '==', parseInt(collegeID)));
            try {
                const querySnapshot = await getDocs(collegeQuery);
              
                if (!querySnapshot.empty) {
                  const firstDoc = querySnapshot.docs[0];
                  const collegeData = firstDoc.data();
                  const admissionWebsite = collegeData.admission_website;
              
                  setAdmUrl(admissionWebsite);
                } else {
                  console.log('No matching document found.');
                }
              } catch (error) {
                console.error('Error retrieving document:', error);
              }

            
        }
        func();
        console.log(admUrl)

    },[admUrl]);

    


    return (
        
            <WebView
                styles={styles.container}
                originWhitelist={['*']}
                source={{uri: admUrl}}
            
            />
        
    )
}

const Demographics = ({navigation, route}) => {

    const collegeID = route.params.collegeID;
    const [sToF, setSToF] = useState(0);
    const [userPref, setUserPref] = useState([]);

    useEffect(()=> {
        const func = async()=> {
            const collegesRef = collection(firestore, 'CompleteColleges');
            const collegeQuery = query(collegesRef, where('school_id', '==', parseInt(collegeID)));
            try {
                const querySnapshot = await getDocs(collegeQuery);
              
                if (!querySnapshot.empty) {
                  const firstDoc = querySnapshot.docs[0];
                  const collegeData = firstDoc.data();
                  const sToF = collegeData.student_to_Faculty_Ratio;
              
                  setSToF(sToF);
                } else {
                  console.log('No matching document found.');
                }
              } catch (error) {
                console.error('Error retrieving document:', error);
              }

            
        }
        func();
        console.log(sToF)

    },[sToF]);

    useEffect(()=> {
        const func = async()=> {
            const usersRef = collection(firestore, 'Users');
            const userQuery = query(usersRef, where('User_UID', '==', auth().currentUser.uid));
            try {
                const querySnapshot = await getDocs(userQuery);
              
                if (!querySnapshot.empty) {
                  const firstDoc = querySnapshot.docs[0];
                  const userData = firstDoc.data();
                  const userPreferences = userData.userPreferences;
              
                  setUserPref(userPreferences);
                } else {
                  console.log('No matching document found.');
                }
              } catch (error) {
                console.error('Error retrieving document:', error);
              }

            
        }
        func();
        console.log(userPref)

    },[userPref]);

    return (
        <View>
            <Text> Student to Faculty Ratio: {sToF} </Text>
            <Text> Major: {userPref.major} </Text>
            <Text> Categories: {userPref.categories} </Text>
            <Text> Diversity: To Be Calculated </Text>
            <Text></Text>
        </View>
    )
   
}

const MainDetails = ({route}) => {
    <View style={styles.container}>
    </View>
    
}

const Drawer = createDrawerNavigator();
const Details = ({route}) => {
    const college = route.params.college;
    const id = route.params.id;
        
    return (
        <NavigationContainer
        independent={true}>
            <Drawer.Navigator initialRouteName='MainDetail'>
                <Drawer.Screen name="MainDetail" component={MainDetails}/>
                <Drawer.Screen name="Admissions" initialParams={{collegeName: college, collegeID: id}} component={Admissions}/>
                <Drawer.Screen name="Demographics" initialParams={{collegeID: id}} component={Demographics} />

            </Drawer.Navigator>
        </NavigationContainer>
    )
}

export default Details

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
      },
    

})