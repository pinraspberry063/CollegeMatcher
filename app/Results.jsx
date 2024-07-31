import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ScrollView } from 'react-native';
import DropdownComponent from '../components/DropdownComp';



const Results = ({ route }) => {
    const top100  = route.params.top100;
    const [numResults, setNumResults] = useState(5);
    const [page, setPage] = useState('results');
    
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.collegeName}>{item.name}</Text>
            <Text style={styles.collegeScore}>Match Accuracy: {item.score}%</Text>
        </View>
    );
    const numResultsData = [
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
        
    ];
    const resultpage = () => (
        <View style={styles.container}>
            <Text style={styles.title}>Top {numResults} College Matches</Text>
            <DropdownComponent style={styles.dropdown} data={numResultsData} value={numResults} onChange={setNumResults} />
            <FlatList
                data={top100.slice(0,numResults)}
                renderItem={renderItem}
                // keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.list}
            />
        </View>

    )

    return (
        <SafeAreaView style={styles.safeaArea}>{page === 'results' && resultpage()}</SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeaArea: {
        flex:1
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingTop: 10,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
        paddingTop: 60
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
    dropdown: {
        width: 100,
        alignSelf: 'flex-end'
    }
});

export default Results;