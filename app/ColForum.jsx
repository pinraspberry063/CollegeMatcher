// Displays the threads and posts of the selected subgroup.

import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext';
import {db} from '../config/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getFirestore,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import {UserContext} from '../components/UserContext';
import {handleReport} from '../src/utils/reportUtils';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import auth from '@react-native-firebase/auth';

const firestore = getFirestore(db);

const ColForum = ({route, navigation}) => {
    const {collegeName, forumName} = route.params;
    const [threads, setThreads] = useState([]);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState({});
    const {user} = useContext(UserContext);
    const theme = useContext(themeContext);
    const [username, setUsername] = useState('');
    const [isRecruiter, setIsRecruiter] = useState(false);
    const [images, setImages] = useState([]); // add state to store selected image
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    // Function to handle image selection
    const selectImage = async () => {
        const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        quality: 1,
      };

      let result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) {
          const images = result.assets.map(asset => ({uri: asset.uri }));
          setImages([...images, ...selectedImages]);
          }
    };

    // Upload image to Firebase
    const uploadImage = async () => {
          const imageUrls = [];

          for (const image of images) {
            const uploadUri = image.uri;
            const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

            setUploading(true);
            setTransferred(0);

            const task = storage()
              .ref(`forum_images/${auth().currentUser.uid}/${filename}`)
              .putFile(uploadUri);

    // Listen for upload
        task.on('state_changed', snapshot => {
          setTransferred(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        });

        try {
          await task;
          const url = await storage().ref(`forum_images/${auth().currentUser.uid}/${filename}`).getDownloadURL();
          imageUrls.push(url);  // Store uploaded image URL
        } catch (e) {
          console.error(e);
        }
      }
      setUploading(false);
      return imageUrls;
    };

  useEffect(() => {
    if (user) {
      fetchUsernameAndRecruiterStatus(user.uid);
    }
  }, [user]);

  useEffect(() => {
    fetchThreadsAndPosts();
  }, [collegeName, forumName]);

  const fetchUsernameAndRecruiterStatus = async uid => {
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
      const threadsRef = collection(
        firestore,
        'Forums',
        collegeName,
        'subgroups',
        forumName,
        'threads',
      );
      const threadsQuery = query(threadsRef, orderBy('createdAt', 'desc'));
      const threadsSnapshot = await getDocs(threadsQuery);
      const threadsList = [];

      for (const threadDoc of threadsSnapshot.docs) {
        const threadData = threadDoc.data();
        const threadId = threadDoc.id;

        const postsRef = collection(
          firestore,
          'Forums',
          collegeName,
          'subgroups',
          forumName,
          'threads',
          threadId,
          'posts',
        );
        const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);
        const postsList = postsSnapshot.docs.map(postDoc => ({
          id: postDoc.id,
          ...postDoc.data(),
        }));

        threadsList.push({
          id: threadId,
          ...threadData,
          posts: postsList,
        });
      }

      setThreads(threadsList);
    } catch (error) {
      console.error('Error fetching threads and posts:', error);
    }
  };

  const handleAddThread = async () => {
    if (newThreadTitle.trim() && username) {
        let imageUrls = [];
        if (images.length> 0) {
            imageUrls = await uploadImages();
            }
      try {
        const threadsRef = collection(
          firestore,
          'Forums',
          collegeName,
          'subgroups',
          forumName,
          'threads',
        );
        const newThread = {
          title: newThreadTitle.trim(),
          createdBy: username,
          createdAt: Timestamp.now(),
          isRecruiter,
          imageUrls: imageUrls,
        };
        await addDoc(threadsRef, newThread);
        setNewThreadTitle('');
        setImages([]);
        fetchThreadsAndPosts(); // Refresh threads and posts after adding a new thread
      } catch (error) {
        console.error('Error adding new thread:', error);
      }
    }
  };

  const handleAddPost = async threadId => {
    if (newPostContent[threadId]?.trim() && username) {
      try {
        const postsRef = collection(
          firestore,
          'Forums',
          collegeName,
          'subgroups',
          forumName,
          'threads',
          threadId,
          'posts',
        );
        const newPost = {
          content: newPostContent[threadId].trim(),
          createdBy: username,
          createdAt: Timestamp.now(),
          isRecruiter,
        };
        await addDoc(postsRef, newPost);
        setNewPostContent(prev => ({...prev, [threadId]: ''}));
        fetchThreadsAndPosts(); // Refresh threads and posts after adding a new post
      } catch (error) {
        console.error('Error adding new post:', error);
      }
    }
  };

  const handleReportSubmission = async (
    reportType,
    threadId,
    postId = null,
    reportedUsername,
  ) => {
    const reportData = {
      threadId,
      postId,
      reportedUser: reportedUsername,
      source: 'forum',
      type: reportType,
    };

    const success = await handleReport(reportData);
    if (success) {
      Alert.alert(
        'Report Submitted',
        'Thank you for your report. Our moderators will review it shortly.',
      );
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
          <Button title="Add Thread" onPress={handleAddThread} />

          {/*Button to select images */}
          <Button title="Select Images" onPress={selectImage} />

          {/*Display selected images */}
          {images.length > 0 && (
                      <View>
                        {images.map((img, index) => (
                          <Image key={index} source={{ uri: img.uri }} style={styles.imageBox} />
                        ))}
                        {uploading ? <Progress.Bar progress={transferred} width={300} /> : null}
                      </View>
                    )}
        </View>
        {threads.map(thread => (
          <View key={thread.id} style={styles.threadItem}>
            <View style={styles.threadHeader}>
              <View style={styles.threadTitleRow}>
                <Text style={[styles.threadTitle, {color: theme.textColor}]}>
                  {thread.title}
                </Text>
              </View>

              {/* Render the uploaded images */}
              {thread.imageUrls && thread.imageUrls.length > 0 && (
                  <View style={styles.imageContainer}>
                      {thread.imageUrls.map((url, index) => (
                          <Image key={index} source={{ uri:url }} style={sytles.imageBox} />
                      ))}
                  </View>
              )}

              {images.length > 0 && (
                <View>
                  {images.map((img, index) => (
                    <Image key={index} source={{ uri: img.uri }} style={styles.imageBox} />
                  ))}
                  {uploading ? <Progress.Bar progress={transferred} width={300} /> : null}
                </View>
              )}

              <Button
                title="Report Thread"
                onPress={() =>
                  handleReportSubmission(
                    'thread',
                    thread.id,
                    null,
                    thread.createdBy,
                  )
                }
                style={styles.reportButton}
              />
            </View>
            <Text
              style={[
                styles.threadCreatedBy,
                {color: theme.textColor},
                thread.isRecruiter && styles.recruiterHighlight, // Highlight if the user is a recruiter
              ]}>
              Created by: {thread.createdBy}
            </Text>
            <Text style={[styles.threadCreatedAt, {color: theme.textColor}]}>
              Created at: {thread.createdAt.toDate().toLocaleString()}
            </Text>
            {thread.posts.map(post => (
              <View key={post.id} style={styles.postItem}>
                <Text style={[styles.postContent, {color: theme.textColor}]}>
                  {post.content}
                </Text>
                <Text
                  style={[
                    styles.postCreatedBy,
                    {color: theme.textColor},
                    post.isRecruiter && styles.recruiterHighlight, // Highlight if the user is a recruiter
                  ]}>
                  Posted by: {post.createdBy}
                </Text>
                <Text style={[styles.postCreatedAt, {color: theme.textColor}]}>
                  {post.createdAt.toDate().toLocaleString()}
                </Text>
                <Button
                  title="Report Post"
                  onPress={() =>
                    handleReportSubmission(
                      'post',
                      thread.id,
                      post.id,
                      post.createdBy,
                    )
                  }
                />
              </View>
            ))}
            <View style={styles.newPostContainer}>
              <TextInput
                style={styles.input}
                placeholder="Post Content"
                value={newPostContent[thread.id] || ''}
                onChangeText={text =>
                  setNewPostContent(prev => ({...prev, [thread.id]: text}))
                }
              />
              <Button
                title="Add Post"
                onPress={() => handleAddPost(thread.id)}
              />
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
  threadHeader: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  threadTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  threadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  reportButton: {
    marginTop: 4,
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
  imageBox: {
      width: 200,
      height: 200,
      marginVertical: 10,
      },
});

export default ColForum;