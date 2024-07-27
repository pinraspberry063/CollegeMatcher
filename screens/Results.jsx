import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import {db} from '../config/firebaseConfig';
import matchColleges from '../src/utils/matchingAlgorithm';
import { collection, addDoc, getDocs, doc, setDoc , getFirestore} from 'firebase/firestore';

const Results = ({navigation}) => {
    const [colleges, setColleges] = useState([]);
 
    const top5 = navigation.getParam(top5)
    useEffect (() =>
    {
        setColleges(top5)
    })

    

    // useEffect(() => {
    //     const fetchResults = async () => {
    //         const firestore = getFirestore(db);
    //         const resultsRef = collection(firestore, 'Results');
    //         const querySnapshot = await getDocs(resultsRef);
    //         setColleges(querySnapshot.docs.map(doc => doc.data().top5colleges));
    //     };
    //     fetchResults();
    // }, []);

    return (
        <ScrollView style={styles.container}>
            {colleges.map((college) => (
                <View style={styles.collegeContainer}>
                    <Text style={styles.collegeName}>{college.name}</Text>
                    <Text>Match Score: {college.score}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    collegeContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    collegeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Results;
