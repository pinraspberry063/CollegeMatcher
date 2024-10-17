import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';

const UserActivityScreen = ({ route }) => {
  const { userActivity, reportedUser } = route.params;

  if (!userActivity || !reportedUser) {
    Alert.alert('Error', 'Invalid user activity data.');
    navigation.goBack();
    return null;
  }

  const renderItem = ({ item, type }) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{type === 'thread' ? item.title : item.content}</Text>
      <Text>Created At: {item.createdAt.toDate().toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{reportedUser}'s Activity</Text>
      <Text style={styles.sectionTitle}>Threads:</Text>
      <FlatList
        data={userActivity.threads}
        renderItem={({ item }) => renderItem({ item, type: 'thread' })}
        keyExtractor={item => item.id}
      />
      <Text style={styles.sectionTitle}>Posts:</Text>
      <FlatList
        data={userActivity.posts}
        renderItem={({ item }) => renderItem({ item, type: 'post' })}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserActivityScreen;
