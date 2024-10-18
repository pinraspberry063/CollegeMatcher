import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const firestore = getFirestore(db);
const { width, height } = Dimensions.get('window'); // Get device dimensions

const EditCollege = ({ route, navigation }) => {
  const { collegeDocId } = route.params;  // Retrieve the document ID from the navigation parameters
  const [collegeData, setCollegeData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollegeData = async () => {
      if (collegeDocId) {
        const collegeDocRef = doc(firestore, 'CompleteColleges', collegeDocId);
        const docSnap = await getDoc(collegeDocRef);

        if (docSnap.exists()) {
          setCollegeData(docSnap.data());
        } else {
          // Create a new document with empty fields if it doesn't exist
          await setDoc(collegeDocRef, {
            shool_name: 'Your School Name',  // Set a default school name if needed
            SuperRec: '',  // Default to empty string for SuperRec
            RecruiterUIDs: [],  // Default empty array for RecruiterUIDs
            application_website: '',
            out_of_state_price23: null,
            address: '',
            admission_website: '',
            application_fee: null,
            city: '',
            degree_granting: '',
            disability_info_website: '',
            finc_aid_website: '',
            hex_color: '',
            housing: '',
            latitude: null,
            longitude: null,
            meal_plan: '',
            percent_asian: null,
            percent_black: null,
            percent_hispanic_latino: null,
            percent_male: null,
            percent_white: null,
            percent_women: null,
            phone: null,
            price_calculator_website: '',
            religious_affiliation: '',
            school_classification: '',
            school_id: null,
            size: '',
            state: '',
            student_to_faculty_ratio: null,
            total_enrollment23: null,
            tuition23: null,
            urbanization_level: '',
            undergrad_enrollment23: null,
            website: '',
            zip: ''
          });
          setCollegeData({});  // Treat it as a new document
        }
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [collegeDocId]);

  const handleSave = async () => {
    if (!collegeDocId) return;

    try {
      const collegeDocRef = doc(firestore, 'CompleteColleges', collegeDocId);

      // Filter out any undefined values from the collegeData
      const filteredData = Object.fromEntries(
        Object.entries(collegeData).filter(([_, value]) => value !== undefined)
      );

      // Update the document with all the filtered fields except "shool_name", "SuperRec", and "RecruiterUIDs"
      await updateDoc(collegeDocRef, filteredData);

      Alert.alert('Success', 'College details updated.');
    } catch (error) {
      console.error('Error updating college details:', error);
      Alert.alert('Error', 'Failed to update college details.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.label}>College Name: {collegeData.shool_name}</Text>
        <Text style={styles.label}>Super Recruiter: {collegeData.SuperRec}</Text>
        <Text style={styles.label}>Recruiter UIDs: {collegeData.RecruiterUIDs?.join(', ')}</Text>

        {/* Dynamically display and edit fields, excluding "shool_name", "SuperRec", and "RecruiterUIDs" */}
        {Object.keys(collegeData).map((key) => (
          key !== 'shool_name' &&
          key !== 'SuperRec' &&
          key !== 'RecruiterUIDs' && (
            <View key={key} style={styles.field}>
              <Text style={styles.label}>{key.replace(/_/g, ' ')}</Text>
              <TextInput
                style={styles.input}
                value={collegeData[key] !== null ? collegeData[key]?.toString() : ''}
                onChangeText={(text) => setCollegeData({ ...collegeData, [key]: text })}
              />
            </View>
          )
        ))}

        <Button title="Save" onPress={handleSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04, // Dynamic padding based on screen width
  },
  contentContainer: {
    paddingBottom: height * 0.1,  // Dynamic space at the bottom
  },
  field: {
    marginBottom: height * 0.02, // Dynamic margin between fields
  },
  label: {
    fontSize: height * 0.025,  // Dynamic font size for labels
    marginBottom: height * 0.01,  // Dynamic margin below label
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: height * 0.015,  // Dynamic padding inside text box
    color: '#fff',
    backgroundColor: '#666',
    borderRadius: 5,
  },
});

export default EditCollege;