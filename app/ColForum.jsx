// Displays the threads and posts of the selected subgroup.

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, doc, getFirestore, Timestamp, query, orderBy, where } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';

const firestore = getFirestore(db);

const ColForum = ({ route, navigation }) => {
  const { collegeName, forumName } = route.params;
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState({});
  const { user } = useContext(UserContext);
  const theme = useContext(themeContext);
  const [username, setUsername] = useState('');
  const [isRecruiter, setIsRecruiter] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUsernameAndRecruiterStatus(user.uid);
    }
  }, [user]);

  useEffect(() => {
    fetchThreadsAndPosts();
  }, [collegeName, forumName]);

  const fetchUsernameAndRecruiterStatus = async (uid) => {
    try {
      const usersRef = collection(firestore, 'Users');
      const q = query(usersRef, where('User_UID', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setUsername(userData.Username);
        setIsRecruiter(userData.IsRecruiter || false); // Check if the user is a recruiter
      } else {
        console.error('No user found with the given UID.');
      }
    } catch (error) {
      console.error('Error fetching username and recruiter status:', error);
    }
  };

  const fetchThreadsAndPosts = async () => {
    try {
      const threadsRef = collection(firestore, 'Forums', collegeName, 'subgroups', forumName, 'threads');
      const threadsQuery = query(threadsRef, orderBy('createdAt', 'desc'));
      const threadsSnapshot = await getDocs(threadsQuery);
      const threadsList = [];

      for (const threadDoc of threadsSnapshot.docs) {
        const threadData = threadDoc.data();
        const threadId = threadDoc.id;

        const postsRef = collection(firestore, 'Forums', collegeName, 'subgroups', forumName, 'threads', threadId, 'posts');
        const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);
        const postsList = postsSnapshot.docs.map(postDoc => ({
          id: postDoc.id,
          ...postDoc.data()
        }));

        threadsList.push({
          id: threadId,
          ...threadData,
          posts: postsList
        });
      }

      setThreads(threadsList);
    } catch (error) {
      console.error('Error fetching threads and posts:', error);
    }
  };

  const handleAddThread = async () => {
    if (newThreadTitle.trim() && username) {
      try {
        const threadsRef = collection(firestore, 'Forums', collegeName, 'subgroups', forumName, 'threads');
        const newThread = {
          title: newThreadTitle.trim(),
          createdBy: username,
          createdAt: Timestamp.now(),
          isRecruiter
        };
        await addDoc(threadsRef, newThread);
        setNewThreadTitle('');
        fetchThreadsAndPosts();  // Refresh threads and posts after adding a new thread
      } catch (error) {
        console.error('Error adding new thread:', error);
      }
    }
  };

  const handleAddPost = async (threadId) => {
    if (newPostContent[threadId]?.trim() && username) {
      try {
        const postsRef = collection(firestore, 'Forums', collegeName, 'subgroups', forumName, 'threads', threadId, 'posts');
        const newPost = {
          content: newPostContent[threadId].trim(),
          createdBy: username,
          createdAt: Timestamp.now(),
          isRecruiter
        };
        await addDoc(postsRef, newPost);
        setNewPostContent(prev => ({ ...prev, [threadId]: '' }));
        fetchThreadsAndPosts();  // Refresh threads and posts after adding a new post
      } catch (error) {
        console.error('Error adding new post:', error);
      }
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
          <Button title="Add Thread" onPress={handleAddThread} />
        </View>
        {threads.map(thread => (
          <View key={thread.id} style={styles.threadItem}>
            <Text style={[styles.threadTitle, { color: theme.textColor }]}>{thread.title}</Text>
            <Text style={[
              styles.threadCreatedBy,
              { color: theme.textColor },
              thread.isRecruiter && styles.recruiterHighlight // Highlight if the user is a recruiter
            ]}>
              Created by: {thread.createdBy}
            </Text>
            <Text style={[styles.threadCreatedAt, { color: theme.textColor }]}>Created at: {thread.createdAt.toDate().toLocaleString()}</Text>
            {thread.posts.map(post => (
              <View key={post.id} style={styles.postItem}>
                <Text style={[styles.postContent, { color: theme.textColor }]}>{post.content}</Text>
                <Text style={[
                  styles.postCreatedBy,
                  { color: theme.textColor },
                  post.isRecruiter && styles.recruiterHighlight // Highlight if the user is a recruiter
                ]}>
                  Posted by: {post.createdBy}
                </Text>
                <Text style={[styles.postCreatedAt, { color: theme.textColor }]}>{post.createdAt.toDate().toLocaleString()}</Text>
              </View>
            ))}
            <View style={styles.newPostContainer}>
              <TextInput
                style={styles.input}
                placeholder="Post Content"
                value={newPostContent[thread.id] || ''}
                onChangeText={text => setNewPostContent(prev => ({ ...prev, [thread.id]: text }))}
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
  recruiterHighlight: {
    fontWeight: 'bold',
    color: '#ff9900', // Highlight color for recruiters
  },
});

export default ColForum;
