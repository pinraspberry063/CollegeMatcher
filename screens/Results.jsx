import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

const Results = () => {
    const [colleges, setColleges] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const firestore = getFirestore(db);
            const resultsRef = collection(firestore, 'Results');
            const querySnapshot = await getDocs(resultsRef);
            setColleges(querySnapshot.docs.map(doc => doc.data()));
        };
        fetchResults();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {colleges.map((college, index) => (
                <View key={index} style={styles.collegeContainer}>
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
