import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, getFirestore, Timestamp, onSnapshot } from 'firebase/firestore';

const firestore = getFirestore(db);

const ColForum = ({ navigation }) => {
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCreatedBy, setNewThreadCreatedBy] = useState('');
  const [newPostContent, setNewPostContent] = useState({});
  const [newPostCreatedBy, setNewPostCreatedBy] = useState({});
  const theme = useContext(themeContext);

  useEffect(() => {
    const threadsRef = collection(firestore, 'Forums', 'Louisiana Tech University', 'threads');

    const unsubscribe = onSnapshot(threadsRef, async (threadsSnapshot) => {
      const threadsList = [];

      for (const threadDoc of threadsSnapshot.docs) {
        const threadData = threadDoc.data();
        const threadId = threadDoc.id;

        const postsRef = collection(firestore, 'Forums', 'Louisiana Tech University', 'threads', threadId, 'posts');
        const postsSnapshot = await getDocs(postsRef);
        const postsList = postsSnapshot.docs.map(postDoc => ({ id: postDoc.id, ...postDoc.data() }));

        threadsList.push({
          id: threadId,
          ...threadData,
          posts: postsList,
        });
      }

      setThreads(threadsList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddThread = async () => {
    try {
      const newThread = {
        title: newThreadTitle,
        createdBy: newThreadCreatedBy,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(firestore, 'Forums', 'Louisiana Tech University', 'threads'), newThread);
      setNewThreadTitle('');
      setNewThreadCreatedBy('');
      // Navigate away and back to reload the page
      navigation.navigate('Index');
      setTimeout(() => {
        navigation.navigate('ColForum');
      }, 100);
    } catch (error) {
      console.error('Error adding new thread: ', error);
    }
  };

  const handleAddPost = async (threadId) => {
    try {
      const newPost = {
        content: newPostContent[threadId] || '',
        createdBy: newPostCreatedBy[threadId] || '',
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(firestore, 'Forums', 'Louisiana Tech University', 'threads', threadId, 'posts'), newPost);
      setNewPostContent(prev => ({ ...prev, [threadId]: '' }));
      setNewPostCreatedBy(prev => ({ ...prev, [threadId]: '' }));
      // Navigate away and back to reload the page
      navigation.navigate('Index');
      setTimeout(() => {
        navigation.navigate('ColForum');
      }, 100);
    } catch (error) {
      console.error('Error adding new post: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.newThreadContainer}>
          <TextInput
            style={styles.input}
            placeholder="Thread Title"
            value={newThreadTitle}
            onChangeText={setNewThreadTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Created By"
            value={newThreadCreatedBy}
            onChangeText={setNewThreadCreatedBy}
          />
          <Button title="Add Thread" onPress={handleAddThread} />
        </View>
        {threads.map((thread) => (
          <View key={thread.id} style={styles.threadItem}>
            <Text style={[styles.threadTitle, { color: theme.textColor }]}>{thread.title}</Text>
            <Text style={[styles.threadCreatedBy, { color: theme.textColor }]}>Created by: {thread.createdBy}</Text>
            <Text style={[styles.threadCreatedAt, { color: theme.textColor }]}>Created at: {thread.createdAt.toDate().toLocaleString()}</Text>
            {thread.posts.map((post) => (
              <View key={post.id} style={styles.postItem}>
                <Text style={[styles.postContent, { color: theme.textColor }]}>{post.content}</Text>
                <Text style={[styles.postCreatedBy, { color: theme.textColor }]}>Posted by: {post.createdBy}</Text>
                <Text style={[styles.postCreatedAt, { color: theme.textColor }]}>Posted at: {post.createdAt.toDate().toLocaleString()}</Text>
              </View>
            ))}
            <View style={styles.newPostContainer}>
              <TextInput
                style={styles.input}
                placeholder="Post Content"
                value={newPostContent[thread.id] || ''}
                onChangeText={(text) => setNewPostContent(prev => ({ ...prev, [thread.id]: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Created By"
                value={newPostCreatedBy[thread.id] || ''}
                onChangeText={(text) => setNewPostCreatedBy(prev => ({ ...prev, [thread.id]: text }))}
              />
              <Button title="Add Post" onPress={() => handleAddPost(thread.id)} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  newThreadContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  newPostContainer: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  threadItem: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  threadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  threadCreatedBy: {
    fontSize: 14,
    marginTop: 4,
  },
  threadCreatedAt: {
    fontSize: 14,
    marginTop: 4,
  },
  postItem: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  postContent: {
    fontSize: 16,
  },
  postCreatedBy: {
    fontSize: 14,
    marginTop: 4,
  },
  postCreatedAt: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default ColForum;
