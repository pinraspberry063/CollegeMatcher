import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'react-native-elements';
//import ProfileImagePicker from '../components/ProfileImageComp';
import auth from '@react-native-firebase/auth';
import {getStorage, ref, getDownloadURL} from '@react-native-firebase/storage';
import themeContext from '../theme/themeContext'
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove, doc, query, where, getFirestore, Timestamp } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';
import { getStorage, ref, getDownloadURL } from '@react-native-firebase/storage';

const firestore = getFirestore(db);

const { width, height } = Dimensions.get('window'); // Get device dimensions

const Account = ({route, navigation}) => {

        const [url, seturl] = useState();
        const user = auth().currentUser;
        const [userName, setUsername] = useState('');
        const [Email, setEmail] = useState('');
        const userNames = collection(firestore,'Users');
        const emails = collection(firestore, 'Users');
        const email = auth().currentUser;

        useEffect(() => {
            const func = async () => {
                const storage = getStorage();
                const reference = ref(storage, "images/" + user.uid + "/profile");

                await getDownloadURL(reference)
                    .then((x)=> {seturl(x);})
                    .catch((error)=> {

                        getDownloadURL(ref(storage, "profile.jpg"))
                        .then((x)=> {seturl(x);})
                    })
            }
            func();
        }, []);

        const fetchUserdata = async (uid) => {
            try {
                const usersRef = collection(firestore, 'Users');
                const q = query(usersRef, where('User_UID', '==', uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();
                    setUsername(userData.Username);
                    setEmail(userData.Email);
                } else {
                    console.error('No user found with the given UID.');
                }
            } catch (error) {
                console.error('Error fetching username and recruiter status:', error);
                }
            };
        fetchUserdata(auth().currentUser.uid);

        return (
            
            <View style={styles.container}>
        
                <Image
                style={styles.profile}
                source={{uri: url}
                }
                />
                <Button
                style={styles.button}
                title="Change Profile Picture"
                onPress={() => {navigation.push('Picker')}
                }
                />
                <Text style={styles.buttonText}>
                    Username: {userName}
                </Text>
                <Text style={styles.smallerText}>
                    Contact info: {Email}
                </Text>

            </View>
          
        )

    
    
}

export default Account

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        marginTop: 10,
        backgroundColor:'#fff'
        
    },
    profile: {
        width: 200, height: 200, resizeMode: "cover", alignSelf: 'center'
    },
    button: {
        width: '50%',
        alignSelf: 'center'
    },
    buttonContainer: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFFFFFF',
    },
    smallerText: {
        fontSize: 20,
        color: '#FFFFFFF'
    },
    buttonSubText: {
        fontSize: 14,
        marginBottom: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
  container: {
    flex: 1,
    alignContent: 'center',
    marginTop: height * 0.02, // Dynamic margin top
    backgroundColor: '#fff',
  },
  profile: {
    width: width * 0.5, // Dynamic width based on screen width
    height: width * 0.5, // Dynamic height to maintain aspect ratio
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: width * 0.25, // Ensures a circular image
  },
  button: {
    width: width * 0.6, // Dynamic width for button
    alignSelf: 'center',
    marginTop: height * 0.03, // Dynamic margin top for spacing
  },
});