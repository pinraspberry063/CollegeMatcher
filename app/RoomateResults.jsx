import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';

const RoomateResults = ({ route }) => {
    const top5  = route.params.top5;
    console.log("top5: " + top5);
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.username}>{item.name}</Text>
            <Text style={styles.roomateScore}>Match Accuracy: {item.score}%</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Top 5 Roomate Matches</Text>
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
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    roomateScore: {
        fontSize: 16,
        color: '#555',
    },
});

export default RoomateResults;