// This will be where liked posts will be shown and stored.

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

const firestore = getFirestore(db);

const ForumLikedDisliked ({navigation}) => {
    const {user} = useContext(UserContext);
    const theme = useContext(themeContext);

};