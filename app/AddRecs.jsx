import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert, Dimensions } from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { UserContext } from '../components/UserContext';
import { db } from '../config/firebaseConfig';

const firestore = getFirestore(db);
const { width, height } = Dimensions.get('window'); // Get device dimensions

const AddRecs = () => {
  const { user } = useContext(UserContext);  // Get the current logged-in user
  const [recruiterEmails, setRecruiterEmails] = useState([]);  // State to store the recruiter emails
  const [newEmail, setNewEmail] = useState('');  // State to store the new email input
  const [loading, setLoading] = useState(true);  // Loading state
  const [collegeDocId, setCollegeDocId] = useState('');  // Store the document ID of the CompleteColleges document
  const [showAddRecruiterInput, setShowAddRecruiterInput] = useState(false);  // State to show/hide the add recruiter input

  useEffect(() => {
    const fetchRecruiters = async () => {
      if (!user || !user.uid) {
        Alert.alert('Error', 'User not logged in.');
        setLoading(false);
        return;
      }

      try {
        // Query Firestore for the document in CompleteColleges where SuperRec matches the logged-in user's UID
        const q = query(
          collection(firestore, 'CompleteColleges'),
          where('SuperRec', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const collegeDoc = querySnapshot.docs[0];  // Renamed to 'collegeDoc'
          setCollegeDocId(collegeDoc.id);  // Store the document ID
          const collegeData = collegeDoc.data();  // Get the document data

          // Check if RecruiterUIDs exists, if not, add an empty array
          if (!collegeData.RecruiterUIDs) {
            const collegeDocRef = doc(firestore, 'CompleteColleges', collegeDoc.id);
            await updateDoc(collegeDocRef, {
              RecruiterUIDs: []  // Initialize RecruiterUIDs if it doesn't exist
            });
            collegeData.RecruiterUIDs = [];  // Set it as an empty array in the local state
          }

          // Fetch the emails for each RecruiterUID from the Users collection
          const emails = await Promise.all(
            collegeData.RecruiterUIDs.map(async (recruiterUID) => {
              try {
                const userQuery = query(
                  collection(firestore, 'Users'),
                  where('User_UID', '==', recruiterUID)
                );
                const userSnapshot = await getDocs(userQuery);

                if (!userSnapshot.empty) {
                  const userDoc = userSnapshot.docs[0];  // Get the first matching document
                  const { Email } = userDoc.data();  // Retrieve the email field
                  return Email;  // Return the email
                } else {
                  return null;  // No matching user found
                }
              } catch (error) {
                console.error(`Error fetching user with UID ${recruiterUID}:`, error);
                return null;
              }
            })
          );

          // Filter out any null values and update state with the fetched emails
          setRecruiterEmails(emails.filter(Boolean));
        } else {
          Alert.alert('No Recruiters Found', 'No recruiters found for this Super Recruiter.');
        }
      } catch (error) {
        console.error('Error fetching recruiters:', error);
        Alert.alert('Error', 'Something went wrong while fetching recruiters.');
      }

      setLoading(false);
    };

    fetchRecruiters();
  }, [user]);

  // Function to add a new email to the recruiter list
  const addRecruiter = async () => {
    if (!newEmail) {
      Alert.alert('Input Error', 'Please enter a valid email.');
      return;
    }

    try {
      // Find the user with the entered email in the Users collection
      const userQuery = query(collection(firestore, 'Users'), where('Email', '==', newEmail));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];  // Get the matching user document
        const { User_UID } = userDoc.data();  // Retrieve the UID

        // Update the CompleteColleges document to add the User_UID to the RecruiterUIDs array
        const collegeDocRef = doc(firestore, 'CompleteColleges', collegeDocId);
        await updateDoc(collegeDocRef, {
          RecruiterUIDs: arrayUnion(User_UID)  // Add UID to RecruiterUIDs array
        });

        // Update the Users document to set IsRecruiter to true
        const userDocRef = doc(firestore, 'Users', userDoc.id);
        await updateDoc(userDocRef, {
          IsRecruiter: true
        });

        // Update the UI with the new recruiter email
        setRecruiterEmails((prevEmails) => [...prevEmails, newEmail]);
        setNewEmail('');  // Clear the input field
        setShowAddRecruiterInput(false);  // Hide the input after adding

        Alert.alert('Success', 'Recruiter added successfully.');
      } else {
        // Email not found, show an alert
        Alert.alert('Email Not Found', 'The email entered does not exist in the system. Please try again.');
      }
    } catch (error) {
      console.error('Error adding recruiter:', error);
      Alert.alert('Error', 'Something went wrong while adding the recruiter.');
    }
  };

  // Function to remove a user from the recruiter list via email.
  const removeRecruiter = async (emailToRemove) => {
    try {
      // Find the user with the entered email in the Users collection
      const userQuery = query(collection(firestore, 'Users'), where('Email', '==', emailToRemove));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];  // Get the matching user document
        const { User_UID } = userDoc.data();  // Retrieve the UID

        // Update the CompleteColleges document to remove the User_UID from the RecruiterUIDs array
        const collegeDocRef = doc(firestore, 'CompleteColleges', collegeDocId);
        await updateDoc(collegeDocRef, {
          RecruiterUIDs: arrayRemove(User_UID)  // Remove UID from RecruiterUIDs array
        });

        // Update the Users document to set IsRecruiter to false
        const userDocRef = doc(firestore, 'Users', userDoc.id);
        await updateDoc(userDocRef, {
          IsRecruiter: false
        });

        // Update the UI by removing the email
        setRecruiterEmails((prevEmails) => prevEmails.filter(email => email !== emailToRemove));

        Alert.alert('Success', 'Recruiter removed successfully.');
      } else {
        Alert.alert('Error', 'No user found with that email.');
      }
    } catch (error) {
      console.error('Error removing recruiter:', error);
      Alert.alert('Error', 'Something went wrong while removing the recruiter.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {/* Add New Recruiter Button */}
          <View style={styles.addRecruiterContainer}>
            <Button
              title="Add New Recruiter"
              onPress={() => setShowAddRecruiterInput(!showAddRecruiterInput)}
            />
          </View>

          {/* Show input field if "Add New Recruiter" button is clicked */}
          {showAddRecruiterInput && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter recruiter's email"
                value={newEmail}
                onChangeText={setNewEmail}
              />
              <Button title="Submit" onPress={addRecruiter} />
            </View>
          )}

          <FlatList
            data={recruiterEmails}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.emailText}>{item}</Text>
                <Button title="Remove" onPress={() => removeRecruiter(item)} />
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04, // Dynamic padding
  },
  listItem: {
    padding: height * 0.02, // Dynamic padding
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emailText: {
    fontSize: height * 0.025, // Dynamic font size
    color: '#fff',
  },
  addRecruiterContainer: {
    marginBottom: height * 0.03, // Dynamic margin
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: height * 0.03, // Dynamic margin
  },
  input: {
    height: height * 0.06, // Dynamic height
    borderColor: '#888',
    borderWidth: 1,
    marginBottom: height * 0.02, // Dynamic margin
    paddingHorizontal: width * 0.02, // Dynamic padding
    backgroundColor: '#444',
    color: '#fff',
  },
});

export default AddRecs;
