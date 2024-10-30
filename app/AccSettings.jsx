import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
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
        }, []);

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
              <View style={{backgroundColor: 'white', borderRadius: 10, marginTop: 20, height: 200, width: 365, marginLeft: 20}}>
                 <Text style={styles.label}> UserName :     {UserData.Username? UserData.Username : 'User'}</Text>
                 <Text style={styles.label}> Name :      {UserData.First} {UserData.Last}</Text>
                  <Text style={styles.label}> Email :     {UserData.Email? UserData.Email: 'Not Given'}</Text>
                  <Text style={styles.label}> Address :     {UserData.userPreferences? UserData.userPreferences.address : 'Not Given'}</Text>
                  
                 

              </View>
                
                
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
    marginTop: 20,
    paddingLeft: 10

  }, 
  field:{
    color: 'black', 
    alignSelf: 'flex-end', 
    paddingRight: 10
  }


});