import React, { useState, useEffect, useContext, useRef } from 'react';
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
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
  getFirestore,
  where,
} from 'firebase/firestore';
import { UserContext } from '../components/UserContext';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleReport } from '../src/utils/reportUtils';
import { getStorage, ref, getDownloadURL } from '@react-native-firebase/storage';
import { handleBanUser, handleUnbanUser, fetchUserActivity } from './ModeratorScreen';

const firestore = getFirestore(db);
const { width, height } = Dimensions.get('window'); // Get device dimensions

const CommentPage = ({ route, navigation }) => {
  const { threadId, threadTitle, collegeName, forumName } = route.params;
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [postImages, setPostImages] = useState([]);
  const [uploadingPost, setUploadingPost] = useState(false);
  const [transferredPost, setTransferredPost] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddPostModalVisible, setIsAddPostModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [currentReportData, setCurrentReportData] = useState(null);
  const animationValue = useRef(new Animated.Value(0)).current;
  const [showAddPost, setShowAddPost] = useState(false);
  const flatListRef = useRef(null);

const toggleAddPost = () => {
        Animated.spring(animationValue, {
          toValue: showAddPost ? 0 : 1, // Toggle between 0 and 1
          friction: 5,
          useNativeDriver: true, // set false for layout animations
        }).start();
        setShowAddPost(!showAddPost);
        };

const resetAddPostForm = () => {
    setNewPostContent(''); // Clear post content
    setPostImages([]); // Clear selected post images
};
  useEffect(() => {
    if (user) {
      fetchUsernameAndRecruiterStatus(user.uid);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [threadId, isModerator]);

  // Fetch Username and Recruiter/Moderator status
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
        setIsModerator(userData.IsModerator || false);
      }
    } catch (error) {
      console.error('Error fetching username and status:', error);
    }
  };

  // Fetch all posts under the specific thread
  const fetchPosts = async () => {
    try {
      const postsRef = collection(firestore, 'Forums', collegeName, 'subgroups', forumName, 'threads', threadId, 'posts');
      const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
      const postsSnapshot = await getDocs(postsQuery);
      const postsList = [];

      for (const postDoc of postsSnapshot.docs) {
        const postData = postDoc.data();

        // Check if the post creator is banned
        const usersRef = collection(firestore, 'Users');
        const userQuery = query(usersRef, where('Username', '==', postData.createdBy));
        const userSnapshot = await getDocs(userQuery);
        const isUserBanned = !userSnapshot.empty && userSnapshot.docs[0].data().IsBanned;

        // Skip this post if user is banned
        if (isUserBanned) {
          continue;
        }

        // Get the user's profile picture from Firebase Storage
        const storage = getStorage();
        const profilePicRef = ref(storage, `images/${postData.createdBy}/profile`);

        let profilePicUrl = null;

        // Try to fetch the custom profile image
        await getDownloadURL(profilePicRef)
          .then((url) => {
            profilePicUrl = url;
          })
          .catch(async (error) => {
            // Fallback to the default profile picture if custom one is not found
            const defaultProfileRef = ref(storage, 'profile.jpg');
            profilePicUrl = await getDownloadURL(defaultProfileRef);
          });

        postsList.push({
          id: postDoc.id,
          ...postData,
          profilePicUrl: profilePicUrl,
        });
      }

      setPosts(postsList);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Image Picker for Post
  const selectPostImage = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
    };

    let result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setPostImages(selectedImages.slice(0, 4)); // Limit to 4 images
    }
  };

  // Upload post images to Firebase Storage
  const uploadPostImages = async () => {
    const imageUrls = [];
    for (const image of postImages) {
      const filename = image.substring(image.lastIndexOf('/') + 1);

      setUploadingPost(true);
      setTransferredPost(0);

      const task = storage()
        .ref(`forum_post_images/${auth().currentUser.uid}/${filename}`)
        .putFile(image);

      task.on('state_changed', (snapshot) => {
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

  // Add new post
  const handleAddPost = async () => {
    if (newPostContent.trim() && username) {
      let postImageUrls = [];
      if (postImages.length > 0) {
        postImageUrls = await uploadPostImages();
      }

      try {
        const postsRef = collection(firestore, 'Forums', collegeName, 'subgroups', forumName, 'threads', threadId, 'posts');
        const newPost = {
          content: newPostContent.trim(),
          createdBy: username,
          createdAt: Timestamp.now(),
          isRecruiter,
          imageUrls: postImageUrls,
        };
        await addDoc(postsRef, newPost);
        setNewPostContent('');
        setPostImages([]); // Clear selected images
        fetchPosts(); // Refresh posts after adding a new post
        toggleAddPost();
      } catch (error) {
        console.error('Error adding new post:', error);
      }
    }
  };

  // Open image modal
  const openImageModal = (imageIndex, postIndex) => {
    setSelectedImageIndex(imageIndex);
    setSelectedPostIndex(postIndex);
    setIsModalVisible(true);
  };

  // Render images in post
  const renderImages = (imageUrls, postIndex) => {
    if (imageUrls.length === 1) {
      return (
        <View style={styles.singleImageContainer}>
          <TouchableOpacity onPress={() => openImageModal(0, postIndex)}>
            <Image source={{ uri: imageUrls[0] }} style={styles.singleImage} />
          </TouchableOpacity>
        </View>
      );
    } else if (imageUrls.length === 2) {
      return (
        <View style={styles.twoImagesContainer}>
          {imageUrls.map((uri, index) => (
            <TouchableOpacity key={index} onPress={() => openImageModal(index, postIndex)}>
              <Image source={{ uri: uri }} style={styles.twoImageBox} />
            </TouchableOpacity>
          ))}
        </View>
      );
    } else if (imageUrls.length > 2) {
      return (
        <View style={styles.gridImageContainer}>
          {imageUrls.slice(0, 4).map((uri, index) => (
            <TouchableOpacity key={index} onPress={() => openImageModal(index, postIndex)}>
              <Image source={{ uri: uri }} style={styles.gridImageBox} />
            </TouchableOpacity>
          ))}
        </View>
      );
    }
  };

  // Report handling
  const handleReportSubmission = (reportType, threadId, postId = null, reportedUsername, content) => {
    if (reportedUsername === username) {
      Alert.alert('Error', 'You cannot report your own content.');
      return;
    }
    setCurrentReportData({ reportType, threadId, postId, reportedUsername, content });
    setIsReportModalVisible(true);
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

  const handleBanUserAction = async () => {
    if (currentReportData) {
      try {
        await handleBanUser(
          null,
          currentReportData.reportedUsername,
          currentReportData.reason,
          currentReportData.content
        );
        Alert.alert('User Banned', 'The user has been banned successfully.');
        fetchPosts(); // Refresh the posts list after banning
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

  return (
    <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
            {/* Display thread title */}
            <Text style={styles.threadTitle}>{threadTitle}</Text>

            {/* Render all posts */}
            {posts.map((post, postIndex) => (
              <View key={post.id} style={styles.postItem}>
                  <View style={styles.postHeader} >
                      <View style={styles.profileContainer}>
                          {post.profilePicUrl ? (
                              <Image source={{ uri: post.profilePicUrl }} style={styles.profilePic} />
                                ) : (
                              <Image source={require('../assets/profile.png')} style={styles.profilePic} />  // Default pic
                                )}

                                {/* Created by section next to profile pic */}
                                <Text style={styles.postCreatedBy}>
                                   {post.createdBy}
                                </Text>
                              </View>
                            </View>

                <Text style={styles.postContent}>{post.content}</Text>

                {/* Render images in posts */}
                {post.imageUrls && post.imageUrls.length > 0 && renderImages(post.imageUrls, postIndex)}

                <View style={styles.postInfoRow}>
                <Text style={styles.postCreatedAt}>
                    {post.createdAt.toDate().toLocaleString()}
                  </Text>
                  {post.createdBy !== username && (
                    <TouchableOpacity
                      style={styles.reportButton}
                      onPress={() => handleReportSubmission('post', threadId, post.id, post.createdBy, post.content)}
                    >
                      <Image source={require('../assets/reportFlag.png')} style={styles.iconButton} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </KeyboardAvoidingView>
        </ScrollView>

        {/* Image modal for posts */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <FlatList
              ref={flatListRef}
              data={posts[selectedPostIndex]?.imageUrls || []}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.fullscreenImageContainer}>
                  <Image source={{ uri: item }} style={{ width: 300, height: 300 }} resizeMode="contain" />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              initialScrollIndex={selectedImageIndex}
              getItemLayout={(data, index) => ({
                length: Dimensions.get('window').width,
                offset: Dimensions.get('window').width * index,
                index,
              })}
            />
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Image source={require('../assets/cancel.png')} style={styles.iconButton} />
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Report Modal */}
        <ReportModal
          isVisible={isReportModalVisible}
          onClose={() => setIsReportModalVisible(false)}
          onSubmit={async (reason) => {
            if (currentReportData) {
              const { reportType, postId, reportedUsername } = currentReportData;
              const reportData = {
                postId,
                reportedUser: reportedUsername,
                source: 'forum',
                type: reportType,
                reason: reason,
                content: currentReportData.content // Add this
              };
              setCurrentReportData({ ...currentReportData, reason }); // Add this
              const success = await handleReport(reportData);
              if (success) {
                Alert.alert('Report Submitted', 'Thank you for your report. Our moderators will review it shortly.');
              } else {
                Alert.alert('Error', 'Failed to submit report. Please try again.');
              }
            }
            setIsReportModalVisible(false);
          }}
          isModerator={isModerator}
          onBanUser={handleBanUserAction}
          onViewActivity={handleViewUserActivityAction}
        />

        {/* Add post section */}
       <Animated.View
         style={[ styles.newPostContainer,
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
           placeholder="Write your post here..."
           value={newPostContent}
           onChangeText={setNewPostContent}
           multiline={true}
         />
         <View style={styles.buttonContainer}>
             <TouchableOpacity  onPress={() => { toggleAddPost(); resetAddPostForm(); }}>
                 <Image source={require('../assets/cancel.png')} style={styles.iconButton} />
             </TouchableOpacity>

             <TouchableOpacity onPress={selectPostImage}>
                 <Image source={require('../assets/addphoto.png')} style={styles.iconButton} />
             </TouchableOpacity>

             <TouchableOpacity onPress={handleAddPost}>
                 <Image source={require('../assets/pencil.png')} style={styles.iconButton} />
             </TouchableOpacity>

         </View>

         {/* Display selected images */}
         {postImages.length > 0 && (
         <View style={styles.gridImageContainer}>
             {postImages.map((imageUri, index) => (
                 <Image key={index} source={{ uri: imageUri }} style={styles.imageBox} />
             ))}
             {uploadingPost ? <Progress.Bar progress={transferredPost} width={300} /> : null}
         </View>
         )}
       </Animated.View>
       <TouchableOpacity style={styles.floatingButton} onPress={toggleAddPost}>
             <Image source={require('../assets/pencil.png')} style={styles.floatingButtonImage} />
       </TouchableOpacity>

      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 16
      },
  background: {
      flex: 1,
      resizeMode: 'cover'
      },
  threadTitle: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#fff'
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
  postItem: {
      marginBottom: 16,
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: '#000033'
      },
  postContent: {
      fontSize: 20,
      color: '#fff'
      },
  postCreatedAt: {
      fontSize: 14,
      color: '#fff',
      marginTop: 4
      },
  postHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      },
  profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      },
  profilePic: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
      },
  postCreatedBy: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#fff',  // White text for "Created by"
      },
  postCreatedAt: {
      fontSize: 12,
      color: '#ccc',  // Lighter color for the creation date
      marginTop: 4,
      },
  newPostContainer: {
      position: 'absolute',
      left: '10%',
      right: '10%',
      top: '30%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 15,
      height: 100,
      fontSize: 18,
      marginBottom: 10,
      borderRadius: 8,
      textAlignVertical: 'top'
      },
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8
      },
  iconButton: {
      width: 24,
      height: 24,
      marginHorizontal: 8
      },
  imageBox: {
      width: 100,
      height: 100,
      marginRight: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'black'
      },
  modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center'
      },
  fullscreenImageContainer: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      justifyContent: 'center',
      alignItems: 'center'
      },
  recruiterHighlight: {
        fontWeight: 'bold',
        color: '#ff9900', // Highlight color for recruiters
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
  postInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      },
  reportButton: {
        marginLeft: 10,
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

export default CommentPage;
