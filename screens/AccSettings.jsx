import { StyleSheet, Text, View, Image, RefreshControl, ScrollView } from 'react-native'
import React, { useEffect , useState, useContext} from 'react'
import { Button } from 'react-native-elements';
//import ProfileImagePicker from '../components/ProfileImageComp';
import auth from '@react-native-firebase/auth';
import {getStorage, ref, getDownloadURL} from '@react-native-firebase/storage';
import themeContext from '../theme/themeContext'
import { SafeAreaView } from 'react-native-safe-area-context';

const Account = ({ navigation}) => {
        const theme = useContext(themeContext);
        const [url, seturl] = useState();
        const user = auth().currentUser;
        const [refreshing, setRefreshing] = React.useState(false);

        const uploadImage = async () => {
            const storage = getStorage();
            const reference = ref(storage, "images/" + user.uid + "/profile");

            await getDownloadURL(reference)
                .then((x)=> {seturl(x);})
                .catch((error)=> {
                    
                    getDownloadURL(ref(storage, "profile.jpg"))
                    .then((x)=> {seturl(x);})
                })
            
            
            
        }
        
        
        

        useEffect(() => {
            uploadImage();
        }, []);


        

        const onRefresh = React.useCallback(() => {
            setRefreshing(true);
            uploadImage();
            setTimeout(() => {
            setRefreshing(false);
            }, 2000);
        }, []);

        return (
            
            <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <Image
                    style={styles.profile}
                    source={{uri: url}
                    }
                    />
                    <Button
                    style={styles.button}
                    title="Change Profile Picture"
                    onPress={() => {navigation.navigate('Picker')}
                    }
                    />
                </ScrollView>
            </SafeAreaView>
          
        )

    
    
}

export default Account

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'pink',
        alignItems: 'center',
        
        
      },
    profile: {
        width: 200, height: 200, resizeMode: "cover", alignSelf: 'center', marginTop: 20
    },
    button: {
        width: '50%',
        alignSelf: 'center'
    }
})