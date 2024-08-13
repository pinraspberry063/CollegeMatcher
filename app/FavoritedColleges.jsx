import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import { db } from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, addDoc, getDocs, getDoc, doc, setDoc , getFirestore, query, where} from 'firebase/firestore';
import Constants from 'expo-constants';

const firestore = getFirestore(db);



const FavoritedColleges = ({navigation}) => {

    const [userFavorites, setUserFavorites] = useState([]);
    const [favColleges, setFavColleges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = auth().currentUser.uid;

   
    const loadColleges = async() => {
        const loadedColleges = await Promise.all(userFavorites.map(async(ID) => {

            const collegesRef = collection(firestore, 'CompleteColleges');
            const collegeQuery = query(collegesRef, where('school_id', '==', parseInt(ID)));
        
            try{
                const querySnapshot = await getDocs(collegeQuery);
        
                if(!querySnapshot.empty){
                    const firstDoc = querySnapshot.docs[0];
                    const collegeData = firstDoc.data();
                    return collegeData.shool_name;
                }
                
                return null;
                
        
            }catch (error) {
                console.log("UserFavorites: Error finding College ID" + error);
            }

        }))

        setFavColleges(loadedColleges.filter(c=>c));
        setIsLoading(false);


    }

    useEffect(() => {
        const func = async() => {
            if(isLoading){
                const usersRef = collection(firestore, 'Users');
                const userQuery = query(usersRef, where('User_UID', '==', user));

                try{
                    const querySnapshot = (await getDocs(userQuery))

                    if(!querySnapshot.empty){
                        const firstDoc = querySnapshot.docs[0];
                        const userData = firstDoc.data();
                        const favColleges = userData.favorited_colleges || [];
                        setUserFavorites(favColleges);
                        loadColleges();
                    }

                }catch (error) {
                    console.error("Error Retrieving User's Favorited Colleges: ", error);
                    
                }
                loadColleges();
                setIsLoading(false);
            }

            }
            
        func();
    }, [ userFavorites, user, isLoading])
  
    

    const renderCollege = ({item}) => {
        return (
            <View>
                <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.push('DetailsFav', {college: item, id: userFavorites[favColleges.indexOf(item)]})}
                >
                    <Text style={styles.text}>{item}</Text> 
                </TouchableOpacity>
            </View>
        );
    }  

    useEffect(() => {
        if (userFavorites.length > 0) {
            loadColleges();
        }
    }, [userFavorites]);


    
    if(isLoading){
        return(<View><Text>Loading...</Text></View>)
    }

    return (

        <View style={styles.container}> 
            <FlatList
            data={favColleges}
            renderItem={renderCollege}
            // keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.list}
            />
        
        </View>

    )
   

    
}

export default FavoritedColleges

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        marginTop: Constants.statusBarHeight,
    },
    button: {
        borderBottomWidth: 1,
        borderBlockColor: 'grey'
    },
    text: {
        fontSize: 20,
        padding: 20,
    }

})