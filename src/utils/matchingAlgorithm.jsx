import { collection, addDoc, getDocs, doc, setDoc , getFirestore, query, where} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import axios from 'axios';
import { useState, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import majorData from '../../assets/major_data';
import { CollegesContext } from '../../components/CollegeContext';



const findDist= (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const lat1 = coords1.lat;
    const lon1 = coords1.lng;
    const lat2 = coords2.lat;
    const lon2 = coords2.lng;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

const geoCodeAddress = async (address) => {
    const apiKey = 'AIzaSyB_0VYgSr15VoeppmqLur_6LeHHxU0q0NI'
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
            address: address,
            key: apiKey
        }
    });
    if (response.data.status === 'OK'){
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
    } else {
        throw new Error('Geocoding not found');
    }
};

// Importance Multiplier Function
const importanceMultiplier = (importance) => {
    if (importance < 0.8) {
      return 0.75;
    }
    return importance;
  };

const matchColleges = async (studentPreferences, colleges) => {
    const firestore = getFirestore(db);
    // const collegeDataRef = collection(firestore, 'CompleteColleges');
    // const querySnapshot = await getDocs(collegeDataRef);
    // const colleges = querySnapshot.docs.map(doc => doc.data());

    const maxScore = 165;
  
    const userCoords = await geoCodeAddress(studentPreferences.address);
  
    // Tuition ranges for scoring
    const tuitionRanges = {
      '$0 - $10,000': [0, 10000],
      '$10,000 - $20,000': [10000, 20000],
      '$20,000 - $30,000': [20000, 30000],
      '$30,000 - $40,000': [30000, 40000],
      '$40,000+': [40000, Infinity],
    };
  
    const sizeRanges = {
      Small: ['Under 1,000', '1,000-4,999'],
      Medium: ['5,000-9,999', '10,000-19,999'],
      Large: ['20,000 and above'],
    };
  
    const satScoreRanges = {
      '800-899': [800, 899],
      '900-999': [900, 999],
      '1000-1099': [1000, 1099],
      '1100-1199': [1100, 1199],
      '1200-1299': [1200, 1299],
      '1300-1399': [1300, 1399],
      '1400-1449': [1400, 1449],
      '1450-1499': [1450, 1499],
      '1500-1549': [1500, 1549],
      '1550-1600': [1550, 1600],
    };
  
    const rangeOrder = [
      '$0 - $10,000',
      '$10,000 - $20,000',
      '$20,000 - $30,000',
      '$30,000 - $40,000',
      '$40,000+',
    ];
    const selectedTuitionRangeIndex = rangeOrder.indexOf(
      studentPreferences.tuition_cost,
    );
  
    const scores = colleges.map(college => {
      let score = 0;
  
      // GPA Matching
      const gpa = parseFloat(studentPreferences.gpa);
      const acceptanceRate = parseFloat(college.adm_rate);
      if (isNaN(acceptanceRate)) {
        if (gpa < 3.0) {
          score += 25;
        } else {
          score += 10;
        }
      } else if (gpa >= 4.0 && acceptanceRate >= 0 && acceptanceRate <= 15) {
        score += 25;
      } else if (
        gpa >= 3.75 &&
        gpa < 4.0 &&
        acceptanceRate >= 15 &&
        acceptanceRate <= 35
      ) {
        score += 25;
      } else if (
        gpa >= 3.5 &&
        gpa < 3.75 &&
        acceptanceRate >= 35 &&
        acceptanceRate <= 49
      ) {
        score += 25;
      } else if (
        gpa >= 3.0 &&
        gpa < 3.5 &&
        acceptanceRate >= 50 &&
        acceptanceRate <= 75
      ) {
        score += 25;
      } else if (gpa < 3.0 && acceptanceRate >= 76) {
        score += 25;
      } else if (gpa >= 4.0 && acceptanceRate > 15) {
        score += 25;
      } else if (gpa >= 3.75 && gpa < 4.0 && acceptanceRate > 35) {
        score += 25;
      } else if (gpa >= 3.5 && gpa < 3.75 && acceptanceRate > 49) {
        score += 25;
      } else if (gpa >= 3.0 && gpa < 3.5 && acceptanceRate > 75) {
        score += 25;
      }
  
      // Tuition Cost Matching
      const tuition = parseFloat(college.tuition23);
      const [minTuition, maxTuition] = tuitionRanges[studentPreferences.tuition_cost] || [0, Infinity];
      const tuitionImportance = importanceMultiplier(studentPreferences.tuition_importance); // Apply importance multiplier
      if (tuition >= minTuition && tuition <= maxTuition) {
          score += 25 * tuitionImportance;
      } else {
          score += 10 * tuitionImportance;
      }
  
      // Major Offered Matching
      if (studentPreferences.major.length > 0) {
          const userSelectedMajors = studentPreferences.major;
          let majorMatch = false;
  
          userSelectedMajors.forEach((major) => {
              const majorInfo = majorData.find((m) => m.value === major);
  
              if (majorInfo && majorInfo.categories && college[majorInfo.categories]) {
                const majorPercentage = parseFloat(college[majorInfo.categories]);
  
                if (majorPercentage > 4) {
                  score += 25 * studentPreferences.major_importance;
                  majorMatch = true;
                }
                else if (majorPercentage >= 0.1 && majorPercentage <= 3.99) {
                  score += 10 * studentPreferences.major_importance;
                  majorMatch = true;
                }
              }
          });
          if (!majorMatch) {
              score += 0 * studentPreferences.major_importance;
          }
      }
  
      // Religious Affiliation Matching
      if (studentPreferences.religious_affiliation === 'N/A') {
          if (college.religious_affiliation === 'Not applicable') {
              score += 25 * studentPreferences.religious_affiliation_importance;
          }
      } else if (
          college.religious_affiliation === studentPreferences.religious_affiliation
      ) {
          score += 25 * studentPreferences.religious_affiliation_importance;
      }
  
      // Size Matching
      if (studentPreferences.size === 'N/A') {
          score += 25;
      } else {
          const selectedSizeRange = Object.keys(sizeRanges).find(size =>
              sizeRanges[size].includes(studentPreferences.size),
          );
          const selectedSizeRangeIndex =
              Object.keys(sizeRanges).indexOf(selectedSizeRange);
          const collegeSizeRange = Object.keys(sizeRanges).find(size =>
              sizeRanges[size].includes(college.size),
          );
          const collegeSizeRangeIndex =
              Object.keys(sizeRanges).indexOf(collegeSizeRange);
          if (selectedSizeRange === collegeSizeRange) {
              score += 25 * studentPreferences.size_importance;
          } else if (
              Math.abs(selectedSizeRangeIndex - collegeSizeRangeIndex) === 1
          ) {
              score += 10 * studentPreferences.size_importance;
          }
      }
  
      // Type of Institution Matching
      if (studentPreferences.school_classification === 'Private') {
          if (
              college.school_classification === 'Private not-for-profit' ||
              college.school_classification === 'Private for-profit'
          ) {
              score += 25 * studentPreferences.school_classification_importance;
          }
      } else if (
          college.school_classification === studentPreferences.school_classification
      ) {
          score += 25 * studentPreferences.school_classification_importance;
      }
  
      // Urbanization Level Matching
      if (studentPreferences.urbanization_level === 'N/A') {
          score += 25;
      } else if (
          college.ubanization_level === studentPreferences.urbanization_level
      ) {
          score += 25 * studentPreferences.urbanization_importance;
      }
  
      // Distance from Home Matching
      const distanceRanges = {
        '0-50 miles': [0, 50 * 1.60934],
        '50-200 miles': [50 * 1.60934, 200 * 1.60934],
        '200-500 miles': [200 * 1.60934, 500 * 1.60934],
        '500+ miles': [500 * 1.60934, Infinity],
      };
  
      const collegeCoords = {
          lat: parseFloat(college.latitude),
          lng: parseFloat(college.longitude),
      };
      const distance = findDist(userCoords, collegeCoords);
      const [minDistance, maxDistance] = distanceRanges[studentPreferences.distance_from_college] || [0, Infinity];
      const distanceImportance = importanceMultiplier(studentPreferences.distance_importance); // Apply importance multiplier
      if (distance >= minDistance && distance <= maxDistance) {
          score += 25 * distanceImportance;
      }
  
      // Diversity Matching (logic can be expanded later)
      score += 25;
  
      // Specific State Matching
      const userSelectedStates = studentPreferences.state_choice; // This is an array if the user selected multiple states
  
      if (userSelectedStates.includes('N/A')) {
          score += 10;
      } else if (userSelectedStates.length > 0 && userSelectedStates.includes(college.state)) {
          score += 25 * studentPreferences.state_choice_importance;
      }
  
      // Sport College Matching
      const sportCollegeImportance = importanceMultiplier(studentPreferences.sport_college_importance); // Apply importance multiplier
      if (studentPreferences.sport_college === 'Yes') {
          if (
              college.school_NCAA === 'Yes' ||
              college.school_NAIA === 'Yes' ||
              college.school_NJCAA === 'Yes'
          ) {
              score += 25 * sportCollegeImportance;
          }
      } else if (studentPreferences.sport_college === 'No') {
          if (
              college.school_NCAA === 'No' &&
              college.school_NAIA === 'No' &&
              college.school_NJCAA === 'No'
          ) {
              score += 25 * sportCollegeImportance;
          }
      }
  
      // ACT Score Matching
      const actScore = parseFloat(studentPreferences.act);
      const actComposite25 = parseFloat(college.act_Composite25);
      const actComposite50 = parseFloat(college.act_Composite50);
      const actComposite75 = parseFloat(college.act_Composite75);
      let actScoreMatched = false;
      if (!isNaN(actComposite75) && actScore === actComposite75) {
        score += 25;
        actScoreMatched = true;
      } else if (
        !isNaN(actComposite50) &&
        !isNaN(actComposite75) &&
        actScore > actComposite50 &&
        actScore < actComposite75
      ) {
        score += 15;
        actScoreMatched = true;
      } else if (
        !isNaN(actComposite25) &&
        !isNaN(actComposite50) &&
        actScore > actComposite25 &&
        actScore < actComposite50
      ) {
        score += 15;
        actScoreMatched = true;
      } else if (
        !isNaN(actComposite25) &&
        !isNaN(actComposite75) &&
        isNaN(actComposite50) &&
        actScore > actComposite25 &&
        actScore < actComposite25 + 2
      ) {
        score += 25;
        actScoreMatched = true;
      } else if (
        !isNaN(actComposite50) &&
        isNaN(actComposite75) &&
        actScore > actComposite50 &&
        actScore < actComposite50 + 2
      ) {
        score += 15;
        actScoreMatched = true;
      } else if (
        !isNaN(actComposite75) &&
        isNaN(actComposite50) &&
        actScore > actComposite75 - 2 &&
        actScore < actComposite75
      ) {
        score += 15;
        actScoreMatched = true;
      } else if (
        !isNaN(actComposite50) &&
        isNaN(actComposite25) &&
        actScore > actComposite50 - 2 &&
        actScore < actComposite50
      ) {
        score += 15;
        actScoreMatched = true;
      }
      if (!actScoreMatched) {
        if (
          isNaN(actComposite25) &&
          isNaN(actComposite50) &&
          isNaN(actComposite75)
        ) {
          score += 10;
        }
      }
  
      // SAT Score Matching
      const satScore = parseFloat(studentPreferences.sat);
      const satTotal = parseFloat(college.sat_Total);
      if (isNaN(satTotal)) {
        score += 5;
      } else {
        for (const range in satScoreRanges) {
          const [min, max] = satScoreRanges[range];
          if (satScore >= min && satScore <= max) {
            score += 25;
            break;
          }
        }
      }
  
      const finalScore = Math.round((score / maxScore) * 100);
      return {college, score: finalScore};
    });
  
    scores.sort((a, b) => b.score - a.score);

    const top100Colleges = scores.slice(0,100)
      .map(s => ({
        name: s.college.shool_name,
        score: s.score,
        id: s.college.school_id,
      }));
    // const resultsRef = collection(firestore, 'Users');
    // const resultDoc = query(
    //   resultsRef,
    //   where('User_UID', '==', auth().currentUser.uid),
    // );
    // const docID = (await getDocs(resultDoc)).docs[0].ref;
  
    try {
      await setDoc(
        doc(collection(firestore, "Users"), auth().currentUser.uid),
        {
          userPreferences: studentPreferences,
          top100Colleges: top100Colleges,
        },
        {merge: true},
      );
  
      alert('Algo submitted successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    const top100 = top100Colleges.slice(0, 50);
    return {top100};
  };
  
  export default matchColleges;
  