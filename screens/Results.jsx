import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';

const Results = ({ route }) => {
    const top5  = route.params.top5;
    console.log("top5: " + top5);
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.collegeName}>{item.name}</Text>
            <Text style={styles.collegeScore}>Match Score: {item.score}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Top 5 College Matches</Text>
            <FlatList
                data={top5}
                renderItem={renderItem}
                // keyExtractor={(item, index) => index.toString()}
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
    collegeName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    collegeScore: {
        fontSize: 16,
        color: '#555',
    },
});

export default Results;



// import React, {useState, useEffect} from 'react';
// import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
// import {db} from '../config/firebaseConfig';
// import matchColleges from '../src/utils/matchingAlgorithm';
// import { collection, addDoc, getDocs, doc, setDoc , getFirestore} from 'firebase/firestore';
//
// const Results = ({navigation}) => {
//     const [colleges, setColleges] = useState([]);
//
//     const top5 = navigation.getParam(top5)
//     useEffect (() =>
//     {
//         setColleges(top5)
//     })
//
//
//
//     // useEffect(() => {
//     //     const fetchResults = async () => {
//     //         const firestore = getFirestore(db);
//     //         const resultsRef = collection(firestore, 'Results');
//     //         const querySnapshot = await getDocs(resultsRef);
//     //         setColleges(querySnapshot.docs.map(doc => doc.data().top5colleges));
//     //     };
//     //     fetchResults();
//     // }, []);
//
//     return (
//         <ScrollView style={styles.container}>
//             {colleges.map((college) => (
//                 <View style={styles.collegeContainer}>
//                     <Text style={styles.collegeName}>{college.name}</Text>
//                     <Text>Match Score: {college.score}</Text>
//                 </View>
//             ))}
//         </ScrollView>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     collegeContainer: {
//         marginBottom: 20,
//         padding: 10,
//         borderWidth: 1,
//         borderColor: '#ccc',
//     },
//     collegeName: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
// });
//
// export default Results;
