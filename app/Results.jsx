import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Button, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';
import { db } from '../config/firebaseConfig';

const firestore = getFirestore(db);  // Initialize Firestore

const Results = ({ route }) => {
    const top5 = route.params.top5;
    const { user } = useContext(UserContext);  // Get the current user from UserContext
    const [committedColleges, setCommittedColleges] = useState([]);

    useEffect(() => {
        const fetchCommittedColleges = async () => {
            if (!user) return;

            // Query the "Users" collection for the document where "User_UID" matches the current user's UID
            const usersQuery = query(collection(firestore, 'Users'), where('User_UID', '==', user.uid));
            const querySnapshot = await getDocs(usersQuery);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];  // Get the first matching document
                const data = userDoc.data();

                // Set the committed colleges from the user's data, or an empty array if it doesn't exist
                setCommittedColleges(data.Committed_Colleges || []);
            }
        };

        fetchCommittedColleges();
    }, [user]);

    const handleCommit = async (collegeName) => {
        try {
            if (!user) {
                Alert.alert('Error', 'You must be logged in to commit to a college.');
                return;
            }

            const usersQuery = query(collection(firestore, 'Users'), where('User_UID', '==', user.uid));
            const querySnapshot = await getDocs(usersQuery);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];  // Get the first matching document
                const userDocRef = doc(firestore, 'Users', userDoc.id);

                let updatedCommittedColleges;
                if (committedColleges.includes(collegeName)) {
                    // Remove the college if it exists in the committed list
                    updatedCommittedColleges = committedColleges.filter(college => college !== collegeName);
                    await updateDoc(userDocRef, {
                        Committed_Colleges: arrayRemove(collegeName),
                    });
                    Alert.alert('Commitment Removed', `You have removed your commitment to ${collegeName}`);
                } else {
                    // Add the college if it doesn't exist in the committed list
                    updatedCommittedColleges = [...committedColleges, collegeName];
                    await updateDoc(userDocRef, {
                        Committed_Colleges: arrayUnion(collegeName),
                    });
                    Alert.alert('Committed', `You have committed to ${collegeName}`);
                }

                // Update the local state
                setCommittedColleges(updatedCommittedColleges);
            } else {
                Alert.alert('Error', 'User not found in the database.');
            }
        } catch (error) {
            console.error('Error committing to college:', error);
            Alert.alert('Error', 'Something went wrong while committing to the college.');
        }
    };

    const renderItem = ({ item }) => {
        const isCommitted = committedColleges.includes(item.name);

        return (
            <View style={styles.card}>
                <Text style={styles.collegeName}>{item.name}</Text>
                <Text style={styles.collegeScore}>Match Accuracy: {item.score}%</Text>
                <Button
                    title={isCommitted ? "Remove Commit" : "Commit"}
                    onPress={() => handleCommit(item.name)}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Top 5 College Matches</Text>
            <FlatList
                data={top5}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

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
    collegeName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    collegeScore: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
});

export default Results;
