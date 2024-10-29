import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Image } from 'react-native';

const UserActivityScreen = ({ route }) => {
  const { userActivity, reportedUser } = route.params;

  if (!userActivity || !reportedUser) {
    Alert.alert('Error', 'Invalid user activity data.');
    navigation.goBack();
    return null;
  }

  const renderItem = ({ item, type }) => (
    <View style={styles.item}>
      {type === 'thread' && (
        <>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.imageUrls && item.imageUrls.length > 0 ? (
            item.imageUrls.map((imageUrl, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                />
              </View>
            ))
          ) : null}
        </>
      )}
      {type === 'post' && (
        <>
          <Text>{item.content}</Text>
          {item.imageUrls && item.imageUrls.length > 0 ? (
            item.imageUrls.map((imageUrl, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                />
              </View>
            ))
          ) : null}
        </>
      )}
      <Text>Created At: {item.createdAt && item.createdAt.toDate ? item.createdAt.toDate().toLocaleString() : 'Unknown'}</Text>
      <Text>Created By: {item.createdBy || 'Unknown'}</Text>
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
  imageContainer: {
    marginVertical: 8,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 8,
  },
});

export default UserActivityScreen;
