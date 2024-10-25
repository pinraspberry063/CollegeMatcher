import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import { getStorage, ref, getDownloadURL } from '@react-native-firebase/storage';


const { width, height } = Dimensions.get('window'); // Get device dimensions

const Account = ({route, navigation}) => {
        
        const [url, seturl] = useState();
        const user = auth().currentUser;

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
            </View>
          
        )

    
    
}

export default Account


const styles = StyleSheet.create({
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