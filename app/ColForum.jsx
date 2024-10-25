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
  ImageBackground,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleBanUser, handleUnbanUser, fetchUserActivity } from './ModeratorScreen';

const firestore = getFirestore(db);
const { width, height } = Dimensions.get('window'); // Get device dimensions

const ColForum = ({route, navigation}) => {
    const {collegeName, forumName} = route.params;
    const [threads, setThreads] = useState([]);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState({});
    const {user} = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [isRecruiter, setIsRecruiter] = useState(false);
    const [isModerator, setIsModerator] = useState(false);
    const [images, setImages] = useState([]); // add state to store selected image
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [currentReportData, setCurrentReportData] = useState(null);
    const [showAddThread, setShowAddThread] = useState(false);     // add floating button & animation
    const animationValue = useRef(new Animated.Value(0)).current;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedThreadIndex, setSelectedThreadIndex] = useState(0);
    const [selectedThreadId, setSelectedThreadId] = useState(0);
    const [isAddPostModalVisible, setIsAddPostModalVisible] = useState(false);
    const [galleryPermission, setGalleryPermission] = useState(null);
    const flatListRef = useRef(null);

    //hide add thread from top
    const toggleAddThread = () => {
        Animated.spring(animationValue, {
          toValue: showAddThread ? 0 : 1, // Toggle between 0 and 1
          friction: 5,
          useNativeDriver: true, // set false for layout animations
        }).start();
        setShowAddThread(!showAddThread);
      };

    // Function to reset Add Thread form
    const resetAddThreadForm = () => {
        setNewThreadTitle('');
        setImages([]);
        };

    // permissions to access gallery
    useEffect(() => { checkSavedPermissions();}, []);

    const checkSavedPermissions = async () => {
        const savedPermission = await AsyncStorage.getItem('galleryPermission');
        if (savedPermission === 'granted') {
            setGalleryPermission('granted');
            }
        };

    // Function to handle image selection
    const selectImage = async () => {
        if (galleryPermission === 'granted') { openGallery(); return; }

        Alert.alert(
            "Permission Required",
            "We need access to your gallery to upload photos. Would you like to allow access?",
            [
               {text: "No", onPress: () => console.log("Permission denied"), style: "cancel",},
               {text: "Only This Time",
               onPress: async () => {
                   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                   if (status === 'granted') {
                       openGallery();
                       }
                   },
                   },
               {text: "Always",
               onPress: async () => {
                   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                   if (status === 'granted'); {
                       await AsyncStorage.setItem('galleryPermission', 'granted');
                       setGalleryPermission('granted');
                       openGallery();
                       }
                   },
               },
                ]
            );
        };

    const openGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            allowsMultipleSelection: true,
            quality: 1,
            });

        if (!result.canceled) {
            const selectedImages = result.assets.map(asset => asset.uri);
            setImages(selectedImages.slice(0, 4));
            }
        };

    /*const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
        });

        if (!result.canceled) {
          const selectedImages = result.assets.map((asset) => asset.uri);
          setImages(selectedImages.slice(0, 4)); // Limit to 4 images
        }
      };*/

   // scroll through images
   const openImageModal = (imageIndex, threadIndex) => {
     setSelectedImageIndex(imageIndex);
     setSelectedThreadIndex(threadIndex);
     setIsModalVisible(true);
   };

   //Render image display based on count
   const renderImages = (imageUrls, threadIndex) => {
          if (imageUrls.length === 1) {
              return (
                  <View style={styles.singleImageContainer}>
                      <TouchableOpacity onPress={() => openImageModal(0, threadIndex)}>
                          <Image source={{ uri: imageUrls[0] }} style={styles.singleImage} />
                      </TouchableOpacity>
                  </View>
              );
          } else if (imageUrls.length === 2) {
              return (
                  <View style={styles.twoImagesContainer}>
                      {imageUrls.map((uri, index) => (
                          <TouchableOpacity key={index} onPress={() => openImageModal(index, threadIndex)}>
                              <Image source={{ uri: uri }} style={styles.twoImageBox} />
                          </TouchableOpacity>
                      ))}
                  </View>
              );
          } else if (imageUrls.length > 2) {
              return (
                  <View style={styles.gridImageContainer}>
                      {imageUrls.slice(0, 4).map((uri, index) => (
                          <TouchableOpacity key={index} onPress={() => openImageModal(index, threadIndex)}>
                              <Image source={{ uri: uri }} style={styles.gridImageBox} />
                          </TouchableOpacity>
                      ))}
                  </View>
              );
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
            posts: [],
            profilePicUrl: '',
          });
        } else {
          const userDoc = userQuerySnapshot.docs[0];
          const userData = userDoc.data();
          console.log('Thread creator data:', userData);
          const isThreadCreatorBanned = userData.IsBanned || false;
          const profilePicUrl = userData.profilePicUrl || '';
          console.log(`Thread ${threadId} creator (${threadData.createdBy}) banned:`, isThreadCreatorBanned);

          if (!isThreadCreatorBanned) {
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

                if (!isPostCreatorBanned) {
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
              posts: postsList,
              profilePicUrl,
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
      Alert.alert('Error', 'Failed to load threads and posts. Please try again.');
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
        resetAddThreadForm();   // clear add thread form after adding
        toggleAddThread();      // hide pop up after thread is added
      } catch (error) {
        console.error('Error adding new thread:', error);
        Alert.alert('Error', 'Failed to add new thread. Please try again.');
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


  const handleAddPost = async (threadId) => {
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
        setIsAddPostModalVisible(false);
        setPostImages(prev => ({...prev, [threadId]: []})); //clear selected images
        fetchThreadsAndPosts(); // Refresh threads and posts after adding a new post
      } catch (error) {
        console.error('Error adding new post:', error);
        Alert.alert('Error', 'Failed to add new post. Please try again.');
      }
    }
  };

  const openAddPost = (threadId) => {
    setSelectedThreadId(threadId); // Keep track of which thread we're adding a post to
    setIsAddPostModalVisible(true); // Show the add post modal
  };

 const handleReportSubmission = (reportType, threadId, postId = null, reportedUsername, content) => {
   if (reportedUsername === username) {
     Alert.alert('Error', 'You cannot report your own content.');
     return;
   }
   setCurrentReportData({ reportType, threadId, postId, reportedUsername, content });
   setIsReportModalVisible(true);
 };

 const handleBanUserAction = async () => {
   if (currentReportData) {
     try {
       await handleBanUser(
         currentReportData.threadId,
         currentReportData.reportedUsername,
         currentReportData.reason,
         currentReportData.content
       );
       Alert.alert('User Banned', 'The user has been banned successfully.');
       fetchThreadsAndPosts(); // Refresh the threads list after banning
     } catch (error) {
       Alert.alert('Error', 'Failed to ban user. Please try again.');
     }
   }
   setIsReportModalVisible(false);
 };

 const handleViewUserActivityAction = async () => {
   if (currentReportData) {
     try {
       const userActivity = await fetchUserActivity(currentReportData.reportedUsername);
       if (userActivity) {
         navigation.navigate('UserActivityScreen', {
           userActivity,
           reportedUser: currentReportData.reportedUsername
         });
       }
     } catch (error) {
       Alert.alert('Error', 'Failed to fetch user activity. Please try again.');
     }
   }
   setIsReportModalVisible(false);
 };

 const ReportModal = ({ isVisible, onClose, onSubmit, isModerator, onBanUser, onViewActivity }) => {
   const [selectedReason, setSelectedReason] = useState('');
   const reasons = [
     'Inappropriate content',
     'Spam',
     'Harassment',
     'False information',
     'Other'
   ];

   return (
     <Modal
       visible={isVisible}
       transparent={true}
       animationType="slide"
       onRequestClose={onClose}
     >
       <View style={styles.modalBackground}>
         <View style={[styles.modalContent, { backgroundColor: '#fff' }]}>
           <Text style={styles.modalTitle}>
             Select a reason for reporting:
           </Text>
           {reasons.map((reason) => (
             <TouchableOpacity
               key={reason}
               style={[
                 styles.reasonButton,
                 selectedReason === reason && styles.selectedReasonButton
               ]}
               onPress={() => setSelectedReason(reason)}
             >
               <Text style={[
                 styles.reasonText,
                 selectedReason === reason && styles.selectedReasonText
               ]}>
                 {reason}
               </Text>
             </TouchableOpacity>
           ))}
           <View style={styles.modalButtons}>
             <TouchableOpacity
               onPress={onClose}
               style={styles.cancelButton}
             >
               <Text style={styles.cancelButtonText}>Cancel</Text>
             </TouchableOpacity>
             <TouchableOpacity
               onPress={() => onSubmit(selectedReason)}
               disabled={!selectedReason}
               style={[styles.submitButton, !selectedReason && styles.buttonDisabled]}
             >
               <Text style={styles.submitButtonText}>Submit</Text>
             </TouchableOpacity>
           </View>
           {isModerator && (
             <View style={styles.moderatorButtons}>
               <TouchableOpacity onPress={onBanUser} style={styles.banButton}>
                 <Text style={styles.banButtonText}>Ban User</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={onViewActivity} style={styles.viewActivityButton}>
                 <Text style={styles.viewActivityButtonText}>View Activity</Text>
               </TouchableOpacity>
             </View>
           )}
         </View>
       </View>
     </Modal>
   );
 };

   return (
        <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
            {/* Render all threads */}
            {threads.map((thread, threadIndex) => (
              <View key={thread.id} style={styles.threadItem}>
                  <View style={styles.threadHeader}>
                    <View style={styles.profileContainer}>
                      {/* Display Profile Picture */}
                      {thread.profilePicUrl ? (
                        <Image source={{ uri: thread.profilePicUrl }} style={styles.profilePic} />
                      ) : (
                        <Image source={require('../assets/profile.png')} style={styles.profilePic} />  // Default pic
                      )}

                      {/* Created by section next to profile pic */}
                      <Text style={styles.threadCreatedBy}>
                         {thread.createdBy}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.threadTitle}>{thread.title}</Text>

                  {/* Render images based on count */}
                  {thread.imageUrls && thread.imageUrls.length > 0 && renderImages(thread.imageUrls, threadIndex)}


                <View style={styles.threadInfoRow}>
                  <Text style={styles.threadCreatedAt}>
                    Created at: {thread.createdAt.toDate().toLocaleString()}
                  </Text>
                  {thread.createdBy !== username && (  // Only show report button if not the creator
                    <TouchableOpacity
                      style={styles.reportButton}
                      onPress={() => handleReportSubmission('thread', thread.id, null, thread.createdBy, thread.title)}
                    >
                      <Image source={require('../assets/reportFlag.png')} style={styles.iconButton} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                {/* Add Post Button */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('CommentPage', {
                      threadId: thread.id,
                      threadTitle: thread.title,
                      collegeName: collegeName,
                      forumName: forumName
                      })}
                >
                  <Image source={require('../assets/Chat.png')} style={styles.iconButton} />
                </TouchableOpacity>

                </View>

              </View>
            ))}
           </KeyboardAvoidingView>
          </ScrollView>

          {/*Modal to make images clickable */}
          <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsModalVisible(false)}
            >
              <View style={styles.modalBackground}>
                <FlatList
                  ref={flatListRef}
                  data={threads[selectedThreadIndex]?.imageUrls || []}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                          <View style={styles.fullscreenImageContainer}>
                              <Image source={{ uri: item }} style={{ width: 300, height: 300 }} resizeMode='contain' />
                          </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  initialScrollIndex={selectedImageIndex}  // Start with the selected image

                  getItemLayout={(data, index) => (
                      { length: Dimensions.get('window').width, offset: Dimensions.get('window').width * index, index }
                  )}

                  onScrollToIndexFailed={(info) => {
                      console.log("Scroll to index failed:", info);
                      setTimeout(() => {
                          flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                          }, 500);
                      }}
                />
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Image source={require('../assets/cancel.png')} style={styles.iconButton} />
                </TouchableOpacity>
              </View>
            </Modal>

          <ReportModal
        isVisible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        onSubmit={async (reason) => {
          setIsReportModalVisible(false);
          if (currentReportData) {
            const { reportType, threadId, postId, reportedUsername, content } = currentReportData;
            const reportData = {
              threadId,
              postId,
              reportedUser: reportedUsername,
              content: content,
              source: 'forum',
              type: reportType,
              reason: reason
            };
            const success = await handleReport(reportData);
            if (success) {
              Alert.alert('Report Submitted', 'Thank you for your report. Our moderators will review it shortly.');
            } else {
              Alert.alert('Error', 'Failed to submit report. Please try again.');
            }
          }
        }}
        isModerator={isModerator}
        onBanUser={handleBanUserAction}
        onViewActivity={handleViewUserActivityAction}
      />

        <Modal
          visible={isAddPostModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsAddPostModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <TextInput
              style={styles.input}
              placeholder="Write your post..."
              value={newPostContent[selectedThreadId] || ''}
              onChangeText={(text) => setNewPostContent(prev => ({ ...prev, [selectedThreadId]: text }))}
            />
            <Button title="Submit Post" onPress={() => handleAddPost(selectedThreadId)} />
            <Button title="Cancel" onPress={() => setIsAddPostModalVisible(false)} color="red" />
          </View>
        </Modal>


        {/* Animated Add Thread Section */}
        <Animated.View
          style={[ styles.newThreadContainer,
            { transform: [{
                  translateY: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height+200, 0], // Slide up the add thread section
                  }),
                },
              ],
            },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="What would you like to say?"
            value={newThreadTitle}
            onChangeText={setNewThreadTitle}
            multiline={true}
          />
          <View style={styles.buttonContainer}>
              <TouchableOpacity  onPress={() => { toggleAddThread(); resetAddThreadForm(); }}>
                  <Image source={require('../assets/cancel.png')} style={styles.iconButton} />
              </TouchableOpacity>

              <TouchableOpacity onPress={selectImage}>
                  <Image source={require('../assets/addphoto.png')} style={styles.iconButton} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleAddThread}>
                  <Image source={require('../assets/pencil.png')} style={styles.iconButton} />
              </TouchableOpacity>

          </View>

          {/* Display selected images */}
          {images.length > 0 && (
            <View style={styles.gridImageContainer}>
              {images.map((imageUri, index) => (
                <Image key={index} source={{ uri: imageUri }} style={styles.imageBox} />
              ))}
              {uploading ? <Progress.Bar progress={transferred} width={300} /> : null}
            </View>
          )}
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
      backgroundColor: 'rgba(0, 0, 0, 0.8)',  // Dimmed background
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
        textColor: 'black',
      },
      /*reportButton: {
        marginTop: 4,
      },*/
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
      padding: 15,
      height: 150,
      fontSize: 18,
      marginBottom: 10,
      borderRadius: 8,
      textAlignVertical: 'top',
    },
    threadItem: {
      marginBottom: 16,
      padding: 16,
      borderWidth: 1,
      backgroundColor: '#000033',
      borderRadius: 8,
    },
    threadTitle: {
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white',
    },
    threadCreatedBy: {
      fontSize: 14,
      marginTop: 4,
      color: 'white',
    },
    threadCreatedAt: {
      fontSize: 14,
      marginTop: 4,
      color: 'white',
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
        width: '48%',
        height: 100,
        borderWidth: 1,
        borderColor: 'black',
        resizeMode: 'cover',
        borderColor: 'black',
        borderRadius: 10,
        },
    singleImageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        },
    singleImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
      },
    twoImagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
      },
    twoImageBox: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
      },
    gridImageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gridImageBox: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 10,
    },
    background: {
        flex: 1,
        resizeMode: 'cover'
      },
  floatingButton: {
      position: 'absolute',
      bottom: 30,
      right: 16,
      backgroundColor: '#841584',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
    },
    floatingButtonImage: {
      width: 30,
      height: 30,
    },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  reasonButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedReasonButton: {
    backgroundColor: '#e0e0e0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  moderatorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  reportButton: {
    padding: 5,
  },
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'right',
      marginTop: 8,
    },
    iconButton: {
      width: 24,
      height: 24,
      marginHorizontal: 8, // Adjust space between icons
    },
    profileContainer: {
      flexDirection: 'row',  // Align profile picture and text horizontally
      alignItems: 'center',  // Vertically center the items
      marginBottom: 8,
    },
    profilePic: {
      width: 40,
      height: 40,
      borderRadius: 20,  // Make the image circular
      marginRight: 10,   // Add some space between image and text
    },
  keyboardAvoidingView: {
    flex: 1,
    },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  fullscreenImageContainer: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      justifyContent: 'center',
      alignItems: 'center',
    },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
  reasonButton: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedReasonButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  reasonText: {
    fontSize: 16,
    color: '#000',
  },
  selectedReasonText: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    minWidth: 100,
    alignItems: 'center',
  },
  submitButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2196f3',
    minWidth: 100,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  moderatorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  banButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ff1744',
    minWidth: 100,
    alignItems: 'center',
  },
  viewActivityButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4caf50',
    minWidth: 100,
    alignItems: 'center',
  },
  banButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  viewActivityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ColForum;
