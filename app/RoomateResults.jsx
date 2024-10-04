import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList,Button, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, getDocs, where, addDoc } from 'firebase/firestore';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { UserContext } from '../components/UserContext';

const RoomateResults = ({ route, navigation }) => {
    const top5  = route.params.top5;
    const { user } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const [usernames, setUsernames] = useState({});
    console.log("top5: " + top5);

    const handleMessageNavigation = useCallback(
        async (userUID,roomateUID) => {
            console.log(roomateUID);
            console.log(userUID);
          const firestore = getFirestore(db);

          // Check if a conversation already exists between the user and the recruiter
          const messagingRef = collection(firestore, 'Messaging');
          const existingConvoQuery = query(
            messagingRef,
            where('Roomate_UID', '==', roomateUID),
            where('User_UID', '==', userUID)
          );
          const existingConvoSnapshot = await getDocs(existingConvoQuery);

          if (!existingConvoSnapshot.empty) {
            // Conversation already exists, navigate to the existing conversation
            const conversationId = existingConvoSnapshot.docs[0].id;
            navigation.navigate('RoomateMessage', { conversationId });
          } else {
            // No conversation exists, create a new one
            const newConvoRef = await addDoc(collection(firestore, 'Messaging'), {
              Roomate_UID: roomateUID,
              User_UID: userUID,
            });

            // Create a sub-collection 'conv' within the new conversation document
            await addDoc(collection(newConvoRef, 'conv'), {});

            // Navigate to the newly created conversation
            navigation.navigate('RoomateMessage', { conversationId: newConvoRef.id });
          }
        },
        [db, user, navigation] // Dependencies for useCallback
      );
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.username}>{item.name}</Text>
            <Text style={styles.roomateScore}>Match Accuracy: {item.score}%</Text>
            <Button
                style={styles.button}
                onPress={() => handleMessageNavigation(user.uid,item.roomate_uid)}
                title="Message"
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Top 5 Roomate Matches</Text>
            <FlatList
                data={top5}
                renderItem={renderItem}
                //keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    roomateScore: {
        fontSize: 16,
        color: '#555',
    },
    button: {
        marginTop: 20,
    },
});

export default RoomateResults;