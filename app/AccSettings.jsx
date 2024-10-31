import { StyleSheet, Text, View, Image, Dimensions, TextInput, LogBox } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import { getStorage, ref, getDownloadURL } from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../components/UserContext';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

LogBox.ignoreLogs([`ReactImageView: Image source "null" doesn't exist`]);

const firestore = getFirestore(db);


const { width, height } = Dimensions.get('window'); // Get device dimensions

const Account = ({route, navigation}) => {
        
        const [url, seturl] = useState(null);
        const {user} = useContext(UserContext);
        const [UserData, setUserData] = useState([]);
        const [edit, setEdit] = useState(false);

        useEffect(() => {
            const func = async () => {
                const storage = getStorage();
                const reference = ref(storage, "images/" + user.uid + "/profile");

                await getDownloadURL(reference)
                    .then((x)=> {seturl(x);})
                    .catch((error)=> {
                        
                        getDownloadURL(ref(storage, "profile.jpg"))
                        .then((x)=> {seturl(x);})
                        .catch(fallbackError => {
                          console.error("Error fetching fallback profile image:", fallbackError); // Log fallback error
                      });
                    })

            }
            func();
        }, [edit]);

        useEffect(()=>{
          const getUserInfo = async () => {
            try {
              const usersRef = collection(firestore, 'Users');
              const q = query(usersRef, where('User_UID', '==', user.uid));
              const querySnapshot = await getDocs(q);
              if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                if (!userData.First) {
                    userData.First = '';
                    }
                if (!userData.Last) {
                    userData.Last = '';
                    }
                setUserData(userData);
              } else {
                console.error('No user found with the given UID.');
              }
            } catch (error) {
              console.error('Error fetching username and recruiter status:', error);
            }
          
          }
          getUserInfo();

        }, [])
        return (
          <FastImage source={require('../assets/galaxy.webp')} style={styles.background}>
            <View style={{flex:1}}>
              <View style={{backgroundColor: '#2a272e', flexDirection: 'row', justifyContent: 'space-between', padding: 5
              }}>
                <Ionicons name={'settings-outline'} size={40} color={'white'} style={{alignSelf: 'flex-start'}} onPress={() => {navigation.navigate('Settings')}}/>
                <MaterialCommunityIcons name={'pencil'} size={40} color={'white'} style={{alignSelf: 'flex-end'}} onPress={() => {setEdit(!edit)}}/>
              </View>
              <View style={{backgroundColor:'#8b2dc2', paddingBottom: 20, paddingTop: 20, borderBlockColor: '#2a272e', borderWidth: 1}}>
                
                <Image
                style={styles.profile}
                source={{uri: url}
                }
                />
                
                {edit && (
                    <MaterialCommunityIcons
                        name={'camera'}
                        color={'white'}
                        size={40}
                        style={{
                            position: 'absolute',
                            bottom: 20, // Adjust as needed
                            right: 110,  // Adjust as needed
                        }}
                        onPress={() => navigation.navigate('Picker')}
                    />
                )}
              </View>
              
              <View style={{backgroundColor: 'white', borderRadius: 10, marginTop: 20, height: 475, width: '90%', marginLeft: 20}}>
                <View style={styles.property}>
                    <Text style={[styles.label]}> UserName :</Text>
                    <Text style={[styles.label, {alignSelf: 'flex-end', paddingRight: 10, marginBottom: 5}]}>{UserData.Username? UserData.Username : 'User'}</Text>
                </View>
                <View style={styles.property}>
                    <Text style={[styles.label]}> Name :</Text>
                    <Text style={[styles.label, {alignSelf: 'flex-end', paddingRight: 10, marginBottom: 5}]}>{(UserData.First == '' && UserData.Last == '' )? 'Not Given' : UserData.First + " " + UserData.Last}</Text>
                </View>
                <View style={styles.property}>
                    <Text style={[styles.label]}> Email :</Text>
                    <Text style={[styles.label, {alignSelf: 'flex-end',paddingRight: 10, marginBottom: 5}]}>{UserData.Email? UserData.Email: 'Not Given'}</Text>
                </View>
                <View style={styles.horixProperty}>
                    <Text style={[styles.label]}> Address :</Text>
                    {!edit &&
                    <Text style={[styles.label, {height: 80}]}>{UserData.userPreferences? UserData.userPreferences.address : 'Not Given'}</Text>}
                    
                </View>
                

              </View>
              {
              edit && 
              <View style={[styles.editWindow]}>
                <View style={styles.editProperty}>
                    <Text style={[styles.editColor]}> UserName :</Text>
                    <TextInput 
                      style={[styles.editTextInput]} 
                      placeholder={UserData.Username? UserData.Username : 'User'}
                      placeholderTextColor={'#cacfce'}
                    />
                </View>
                <View style={styles.editProperty}>
                    <Text style={[styles.editColor]}> Name :</Text>
                    <TextInput 
                      style={[styles.editTextInput]} 
                      placeholder={(UserData.First == '' && UserData.Last == '' )? 'Not Given' : UserData.First + " " + UserData.Last}
                      placeholderTextColor={'#cacfce'}
                    />
                </View>
                <View style={styles.editProperty}>
                    <Text style={[styles.editColor]}> Email :</Text>
                    <TextInput 
                      style={[styles.editTextInput]} 
                      placeholder={UserData.Email? UserData.Email: 'Not Given'}
                      placeholderTextColor={'#cacfce'}
                    />
                </View>
                <View style={[styles.horixProperty, {borderColor: 'white'}]}>
                    <Text style={[styles.editColor]}> Address :</Text>
                    <TextInput 
                      style={[styles.edithorix, {height: 80}]} 
                      placeholder={UserData.userPreferences? UserData.userPreferences.address : 'Not Given'}
                      placeholderTextColor={'#cacfce'}
                    />
                </View>
                

              </View>
              }
                
                
            </View>
          </FastImage>
          
        )

    
    
}

export default Account


const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    alignContent: 'center',
    opacity: 0.95
  },
  profile: {
    width: width * 0.5, // Dynamic width based on screen width
    height: width * 0.5, // Dynamic height to maintain aspect ratio
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: width * 0.25, 
  
  },
  label:{
    color: 'black', 
    alignSelf: 'flex-start', 
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: 20,
    paddingTop: 8

  }, 
  field:{
    color: 'black', 
    alignSelf: 'flex-end', 
    paddingRight: 10
  },
  property:{
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 15,
    marginTop: 10,
    borderRadius: 10,
    height: 40
  },
  horixProperty:{
    borderWidth: 1,
    borderColor: 'black',

    width: '90%',
    marginLeft: 15,
    marginTop: 10,
    borderRadius: 10,
    height: 100

  },
  editWindow:{
    width: '90%', 
    alignSelf: 'center', 
    borderRadius: 10, 
    height: 475, 
    backgroundColor: 'black', 
    borderWidth: 1, 
    borderColor: 'white',
    position: 'absolute', 
    top: 318, 
    opacity: 10
     
  
    

  },
  editColor: {
    color: 'white', 
    alignSelf: 'flex-start', 
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10, 
    marginBottom: 2

  },
  editProperty:
  {
    borderWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: 15,
    marginTop: 10,
    borderRadius: 10,
    height: 40

  }, 
  editTextInput:{
    color: 'white', 
    alignSelf: 'flex-end', 
    fontSize: 20,
    position: 'absolute', 
    right: 6,
    top: 0.05


  },
  edithorix:{
    color: 'white', 
    alignSelf: 'flex-end', 
    fontSize: 20,
    position: 'absolute', 
    left: 5,
    top: 15, 
    width: '90%'

  },


});