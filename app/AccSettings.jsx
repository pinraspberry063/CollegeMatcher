import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect , useState, useContext} from 'react'
import { Button } from 'react-native-elements';
//import ProfileImagePicker from '../components/ProfileImageComp';
import auth from '@react-native-firebase/auth';
import {getStorage, ref, getDownloadURL} from '@react-native-firebase/storage';
import themeContext from '../theme/themeContext'


const Account = ({route, navigation}) => {
        const theme = useContext(themeContext);
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
            
            <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        
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
        marginTop: 10,
        backgroundColor:'#fff'
        
    },
    profile: {
        width: 200, height: 200, resizeMode: "cover", alignSelf: 'center'
    },
    button: {
        width: '50%',
        alignSelf: 'center'
    }
})