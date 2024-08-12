import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc, getDoc, getFirestore, Timestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleReport } from '../src/utils/reportUtils';

const firestore = getFirestore(db);

const ColForum = ({ navigation }) => {
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCreatedBy, setNewThreadCreatedBy] = useState('');
  const [newPostContent, setNewPostContent] = useState({});
  const [newPostCreatedBy, setNewPostCreatedBy] = useState({});
  const theme = useContext(themeContext);

  const collegeName = 'Louisiana Tech University';

  useEffect(() => {
    const unsubscribeThreads = [];
    const unsubscribePosts = [];

    const checkAndCreateCollegeDoc = async () => {
      try {
        const collegeDocRef = doc(firestore, 'Forums', collegeName);
        const collegeDocSnap = await getDoc(collegeDocRef);

        if (!collegeDocSnap.exists()) {
          await setDoc(collegeDocRef, {});
        }

        const threadsRef = collection(firestore, 'Forums', collegeName, 'threads');
        const threadsQuery = query(threadsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(threadsQuery, async (threadsSnapshot) => {
          const threadsList = [];
          const postsUnsubscribes = [];

          for (const threadDoc of threadsSnapshot.docs) {
            const threadData = threadDoc.data();
            const threadId = threadDoc.id;

            const postsRef = collection(firestore, 'Forums', collegeName, 'threads', threadId, 'posts');
            const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));

            const postsSnapshot = await getDocs(postsQuery);
            const postsList = postsSnapshot.docs.map(postDoc => ({ id: postDoc.id, ...postDoc.data() }));

            threadsList.push({
              id: threadId,
              ...threadData,
              posts: postsList,
            });

            // Set up real-time updates for posts in this thread
            const postUnsubscribe = onSnapshot(postsQuery, (postsSnapshot) => {
              const updatedPostsList = postsSnapshot.docs.map(postDoc => ({ id: postDoc.id, ...postDoc.data() }));
              setThreads(prevThreads => prevThreads.map(t => t.id === threadId ? { ...t, posts: updatedPostsList } : t));
            });

            postsUnsubscribes.push(postUnsubscribe);
          }

          setThreads(threadsList);
          // Unsubscribe from previous posts listeners
          unsubscribePosts.forEach(unsub => unsub());
          unsubscribePosts.length = 0;
          unsubscribePosts.push(...postsUnsubscribes);
        });

        unsubscribeThreads.push(unsubscribe);
      } catch (error) {
        console.error('Error fetching threads: ', error);
      }
    };

    checkAndCreateCollegeDoc();

    return () => {
      // Unsubscribe from all listeners on unmount
      unsubscribeThreads.forEach(unsub => unsub());
      unsubscribePosts.forEach(unsub => unsub());
    };
  }, []);

  const handleAddThread = async () => {
    try {
      const newThread = {
        title: newThreadTitle,
        createdBy: newThreadCreatedBy,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(firestore, 'Forums', collegeName, 'threads'), newThread);
      setNewThreadTitle('');
      setNewThreadCreatedBy('');
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

      await addDoc(collection(firestore, 'Forums', collegeName, 'threads', threadId, 'posts'), newPost);
      setNewPostContent(prev => ({ ...prev, [threadId]: '' }));
      setNewPostCreatedBy(prev => ({ ...prev, [threadId]: '' }));
    } catch (error) {
      console.error('Error adding new post: ', error);
    }
  };

  const handleReportPost = async (threadId, postId, reportedUser) => {
    const reportData = {
      threadId,
      postId,
      reportedUser,
      source: 'forum'
    };

    const success = await handleReport(reportData);
    if (success) {
      Alert.alert('Report Submitted', 'Thank you for your report. Our moderators will review it shortly.');
    } else {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
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
                <Button title="Report" onPress={() => handleReportPost(thread.id, post.id, post.createdBy)} />
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
