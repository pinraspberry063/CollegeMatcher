// Displays the threads and posts of the selected subgroup.

import React, {useState, useEffect, useContext, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  Animated,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground
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
    const [isModerator, setIsModerator] = useState(false);
    const [images, setImages] = useState([]); // add state to store selected image
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    // add floating button & animation
    const [showAddThread, setShowAddThread] = useState(false);
    const animationValue = useRef(new Animated.Value(0)).current;

    //hide add thread from top
    const toggleAddThread = () => {
        setShowAddThread(!showAddThread);
        Animated.spring(animationValue, {
          toValue: showAddThread ? 0 : 1, // Toggle between 0 and 1
          friction: 5,
          useNativeDriver: false, // set false for layout animations
        }).start();
        setShowAddThread(!showAddThread);
      };

    // Function to handle image selection
    const selectImage = async () => {
        const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 1,
      };

      let result = await ImagePicker.launchImageLibraryAsync(options);

      console.log(result);

      if (!result.canceled) {
          const images = result.assets.map(asset => asset.uri );
          setImages(images);
          }
    };

    // Upload image to Firebase
    const uploadImage = async () => {
          const imageUrls = [];

          for (const image of images) {
            const uploadUri = image;
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
  }, [collegeName, forumName, isModerator]);

  const fetchUsernameAndRecruiterStatus = async (uid) => {
    try {
      const usersRef = collection(firestore, 'Users');
      const q = query(usersRef, where('User_UID', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setUsername(userData.Username);
        setIsRecruiter(userData.IsRecruiter || false);
        setIsModerator(userData.IsModerator || false); // change function name later
      } else {
        console.error('No user found with the given UID.');
      }
    } catch (error) {
      console.error('Error fetching username and status:', error);
    }
  };

  const fetchThreadsAndPosts = async () => {
    try {
      console.log('Fetching threads and posts');
      const threadsRef = collection(firestore, 'Forums', collegeName, 'subgroups', forumName, 'threads');
      const threadsQuery = query(threadsRef, orderBy('createdAt', 'desc'));
      const threadsSnapshot = await getDocs(threadsQuery);
      const threadsList = [];

      console.log(`Found ${threadsSnapshot.size} threads`);

      for (const threadDoc of threadsSnapshot.docs) {
        const threadData = threadDoc.data();
        const threadId = threadDoc.id;

        // Check if the thread creator is banned
        console.log(`Checking ban status for thread creator: ${threadData.createdBy}`);
        const usersRef = collection(firestore, 'Users');
        const userQuery = query(usersRef, where('Username', '==', threadData.createdBy));
        const userQuerySnapshot = await getDocs(userQuery);

        if (userQuerySnapshot.empty) {
          console.log(`User document not found for: ${threadData.createdBy}`);
          // Decide how to handle threads with missing creator data
          // For now include them to avoid losing data
          threadsList.push({
            id: threadId,
            ...threadData,
            posts: []
          });
        } else {
          const userDoc = userQuerySnapshot.docs[0];
          const userData = userDoc.data();
          console.log('Thread creator data:', userData);
          const isThreadCreatorBanned = userData.IsBanned || false;
          console.log(`Thread ${threadId} creator (${threadData.createdBy}) banned:`, isThreadCreatorBanned);

          if (!isThreadCreatorBanned || isModerator) {
            console.log(`Including thread ${threadId}`);
            const postsRef = collection(firestore, 'Forums', collegeName, 'subgroups', forumName, 'threads', threadId, 'posts');
            const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
            const postsSnapshot = await getDocs(postsQuery);
            const postsList = [];

            for (const postDoc of postsSnapshot.docs) {
              const postData = postDoc.data();
              // Check if the post creator is banned
              const postCreatorQuery = query(usersRef, where('Username', '==', postData.createdBy));
              const postCreatorSnapshot = await getDocs(postCreatorQuery);

              if (!postCreatorSnapshot.empty) {
                const postCreatorData = postCreatorSnapshot.docs[0].data();
                const isPostCreatorBanned = postCreatorData.IsBanned || false;

                if (!isPostCreatorBanned || isModerator) {
                  postsList.push({
                    id: postDoc.id,
                    ...postData
                  });
                }
              } else {
                console.log(`Post creator not found: ${postData.createdBy}`);
                // Decide how to handle posts with missing creator data
                // For now, we'll include them to avoid losing data
                postsList.push({
                  id: postDoc.id,
                  ...postData
                });
              }
            }

            threadsList.push({
              id: threadId,
              ...threadData,
              posts: postsList
            });
          } else {
            console.log(`Excluding thread ${threadId} due to banned creator`);
          }
        }
      }

      console.log(`Setting ${threadsList.length} threads`);
      setThreads(threadsList);
    } catch (error) {
      console.error('Error fetching threads and posts:', error);
    }
  };
  const handleAddThread = async () => {
    if (newThreadTitle.trim() && username) {
        let imageUrls = [];
        if (images.length> 0) {
            imageUrls = await uploadImage();
            }
      try {
        const threadsRef = collection(firestore, 'Forums', collegeName, 'subgroups', forumName, 'threads');
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

    // Add image selection and uploading for posts
    const [postImages, setPostImages] = useState({}); // Store images per thread
    const [uploadingPost, setUploadingPost] = useState(false);
    const [transferredPost, setTransferredPost] = useState(0);

    const selectPostImage = async (threadId) => {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      };

      let result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled) {
        const images = result.assets.map(asset => asset.uri);
        setPostImages(prev => ({...prev, [threadId]: images}));
      }
    };

    const uploadPostImages = async (threadId) => {
      const imageUrls = [];
      const images = postImages[threadId] || [];

      for (const image of images) {
        const filename = image.substring(image.lastIndexOf('/') + 1);

        setUploadingPost(true);
        setTransferredPost(0);

        const task = storage()
          .ref(`forum_post_images/${auth().currentUser.uid}/${filename}`)
          .putFile(image);

        task.on('state_changed', snapshot => {
          setTransferredPost(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        });

        try {
          await task;
          const url = await storage().ref(`forum_post_images/${auth().currentUser.uid}/${filename}`).getDownloadURL();
          imageUrls.push(url); // Store uploaded image URLs
        } catch (e) {
          console.error(e);
        }
      }

      setUploadingPost(false);
      return imageUrls;
    };


  const handleAddPost = async threadId => {
    if (newPostContent[threadId]?.trim() && username) {
      let postImageUrls = []
      if (postImages[threadId]?.length > 0) {
          postImageUrls = await uploadPostImages(threadId);
          }

      try {
        const postsRef = collection(firestore, 'Forums', collegeName, 'subgroups', forumName, 'threads', threadId, 'posts');
        const newPost = {
          content: newPostContent[threadId].trim(),
          createdBy: username,
          createdAt: Timestamp.now(),
          isRecruiter,
          imageUrls: postImageUrls,
        };
        await addDoc(postsRef, newPost);
        setNewPostContent(prev => ({...prev, [threadId]: ''}));
        setPostImages(prev => ({...prev, [threadId]: []})); //clear selected images
        fetchThreadsAndPosts(); // Refresh threads and posts after adding a new post
      } catch (error) {
        console.error('Error adding new post:', error);
      }
    }
  };

 const handleReportSubmission = async (reportType, threadId, postId = null, reportedUsername) => {

   const reportData = {
     threadId,
     postId,
     reportedUser: reportedUsername,
     source: 'forum',
     type: reportType
   };

   const success = await handleReport(reportData);
   if (success) {
     Alert.alert('Report Submitted', 'Thank you for your report. Our moderators will review it shortly.');
   } else {
     Alert.alert('Error', 'Failed to submit report. Please try again.');
   }
 };

   return (
        <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            {/* Render all threads */}
            {threads.map((thread) => (
              <View key={thread.id} style={styles.threadItem}>
                <View style={styles.threadHeader}>
                  <Text style={[styles.threadTitle, { color: theme.textColor }]}>{thread.title}</Text>

                  {/* Render thread images */}
                  {thread.imageUrls && thread.imageUrls.length > 0 && (
                    <View style={styles.imageContainer}>
                      {thread.imageUrls.map((url, index) => (
                        <Image key={index} source={{ uri: url }} style={styles.imageBox} />
                      ))}
                    </View>
                  )}
                </View>

                <Text style={[styles.threadCreatedBy, { color: theme.textColor }]}>
                  Created by: {thread.createdBy}
                </Text>
                <Text style={[styles.threadCreatedAt, { color: theme.textColor }]}>
                  Created at: {thread.createdAt.toDate().toLocaleString()}
                </Text>
              </View>
            ))}


          </ScrollView>
          {/* Animated Add Thread Section */}
                    <Animated.View
                      style={[
                        styles.newThreadContainer,
                        {
                          transform: [
                            {
                              translateY: animationValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [300, 0], // Slide up the add thread section
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="Thread Title"
                        value={newThreadTitle}
                        onChangeText={setNewThreadTitle}
                      />
                      <Button title="Add Thread" onPress={handleAddThread} />

                      {/* Button to select images */}
                      <Button title="Select Images" onPress={selectImage} />

                      {/* Display selected images */}
                      {images.length > 0 && (
                        <View>
                          {images.map((imageUri, index) => (
                            <Image key={index} source={{ uri: imageUri }} style={styles.imageBox} />
                          ))}
                          {uploading ? <Progress.Bar progress={transferred} width={300} /> : null}
                        </View>
                      )}

                      {/* Cancel Buttonon */}
                      <Button title="Cancel" onPress={toggleAddThread} color="red" />
                    </Animated.View>

          {/* Floating button at bottom-right corner */}
          <TouchableOpacity style={styles.floatingButton} onPress={toggleAddThread}>
            <Image source={require('../assets/pencil.png')} style={styles.floatingButtonImage} />
          </TouchableOpacity>
        </SafeAreaView>
        </ImageBackground>
      );
    };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    newThreadContainer: {
      position: 'absolute',
      left: '10%',
      right: '10%',
      top: '30%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 3,
      elevation: 5,  // Shadow for Android
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
      backgroundColor: '#000080',
      borderRadius: 8,
    },
    threadTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
    },
    threadCreatedBy: {
      fontSize: 14,
      marginTop: 4,
      color: '#fff',
    },
    threadCreatedAt: {
      fontSize: 14,
      marginTop: 4,
      color: '#fff',
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
      color: '#fff',
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
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        },
    background: {
        flex: 1,
        resizeMode: 'cover'
      },
  floatingButton: {
      position: 'absolute',
      bottom: 30,
      right: 16,
      backgroundColor: '#ff9900',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
    },
    floatingButtonImage: {
      width: 24,
      height: 24,
    },
  });

  export default ColForum;