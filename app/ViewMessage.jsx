import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, FlatList, View, ScrollView, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);

const ViewMessage = ( { navigation } ) => {
    console.log("Looping entire ViewMessaage");
  const { user } = useContext(UserContext);  // Get the current user from UserContext
  const [colleges, setColleges] = useState([]);
  const [collegeName, setCollegeName] = useState('');
  const [userName, setUsername] = useState('');
  const [otherName, setOtherName] = useState('');
  const [activeMessages, setActiveMessages] = useState([]);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const theme = useContext(themeContext);

         //console.log("LOOP");

  useEffect(() => {
    const fetchCommittedColleges = async () => {
      if (!user || !user.uid) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      try {
        // Query the "Users" collection for the document where "User_UID" matches the current user's UID
        const usersQuery = query(collection(firestore, 'Users'),
            where('User_UID', '==', user.uid));
        const querySnapshot = await getDocs(usersQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];  // Get the first matching document
          const data = userDoc.data();

          // Set the colleges from the user's Committed_Colleges field
          setActiveMessages(data.activeMessages || []);
        } else {
          Alert.alert('Error', 'User data not found.');
        }
      } catch (error) {
        console.error('Error fetching committed colleges:', error);
        Alert.alert('Error', 'Something went wrong while fetching committed colleges.');
      }
        console.log("LOOP INSIDE USEEFFECT");
    };

    fetchCommittedColleges();
  }, [user]);

  const handleNavigation = async (collegeName) => {
    // Navigate to the ForumSelect screen for the selected college
    navigation.navigate('ForumSelect', { collegeName });
  };

  const handleFollowedForumsNavigation = () => {
    navigation.navigate('FollowedForums');
    console.log("LOOP AT END");
  };


  //console.log(getDocs(query(collection(firestore,'Users'),where('Users_UID', '==',item)))).docs[0].data().Username);
      const renderItem = ({ item }) => (
          <View style={styles.card}>
              <Text style={styles.username}>{
              item}</Text>
              <Button
                  style={styles.button}
                  onPress={() => handleMessageNavigation(user.uid,item)}
                  title="Message"
              />
          </View>
      );


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Top 5 Roomate Matches</Text>
            <FlatList
                data={activeMessages}
                renderItem={renderItem}
                //keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
    card: {
        backgroundColor: '#8f8f8f',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
  buttonContainer: {
    marginBottom: 16,
  },
  noCollegesText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  followedForumsButtonContainer: {
    marginTop: 20,
    padding: 10,
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
  },
      username: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 5,
      },
});

export default ViewMessage;