---
title: >-
  How we implemented user reporting, reported user activity viewing, and
  reported user banning for the forums.
---
# Introduction

This document will walk you through the implementation of the user reporting, reported user activity viewing, and reported user banning features for the forums.

We will cover:

1. How user reports are submitted.
2. How moderators view and handle reports.
3. How user activity is fetched and displayed.
4. How reported users are banned and their tokens revoked.

# User report submission

<SwmSnippet path="/src/utils/reportUtils.jsx" line="1">

---

We start by defining the <SwmToken path="/src/utils/reportUtils.jsx" pos="7:4:4" line-data="export const handleReport = async (reportData) =&gt; {">`handleReport`</SwmToken> function in <SwmPath>[src/utils/reportUtils.jsx](/src/utils/reportUtils.jsx)</SwmPath>. This function handles the submission of user reports to the Firestore database.

```
import { getFirestore, collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import auth from '@react-native-firebase/auth';

const firestore = getFirestore(db);

export const handleReport = async (reportData) => {
  try {
    const reportRef = collection(firestore, 'Reports');
    const currentUser = auth().currentUser;
```

---

</SwmSnippet>

<SwmSnippet path="/src/utils/reportUtils.jsx" line="11">

---

First, we check if the current user is authenticated. If not, an error is thrown.

```

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Fetch the reported user's User_UID
    const usersRef = collection(firestore, 'Users');
    const q = query(usersRef, where('Username', '==', reportData.reportedUser));
    const querySnapshot = await getDocs(q);
```

---

</SwmSnippet>

<SwmSnippet path="/src/utils/reportUtils.jsx" line="20">

---

Next, we fetch the reported user's UID from the Firestore database. If the user is not found, an error is thrown.

```

    if (querySnapshot.empty) {
      throw new Error('Reported user not found');
    }

    const reportedUserDoc = querySnapshot.docs[0];
    const reportedUserUID = reportedUserDoc.data().User_UID;
```

---

</SwmSnippet>

<SwmSnippet path="/src/utils/reportUtils.jsx" line="27">

---

We then construct the report object, including the reported user's UID, the reporting user's UID, and the current timestamp.

```

    const report = {
      ...reportData,
      reportedUser: reportedUserUID,
      reportedBy: currentUser.uid,
      createdAt: Timestamp.now(),
      status: 'pending'
    };
```

---

</SwmSnippet>

<SwmSnippet path="/src/utils/reportUtils.jsx" line="35">

---

Finally, we add the report to the Firestore collection and log the success or failure of the operation.

```

    await addDoc(reportRef, report);
    console.log('Report submitted successfully');
    return true;
  } catch (error) {
    console.error('Error submitting report: ', error);
    return false;
```

---

</SwmSnippet>

# Viewing and handling reports

<SwmSnippet path="/app/ModeratorScreen.jsx" line="1">

---

In <SwmPath>[app/ModeratorScreen.jsx](/app/ModeratorScreen.jsx)</SwmPath>, we define the <SwmToken path="/app/ModeratorScreen.jsx" pos="9:2:2" line-data="const ModeratorScreen = ({ navigation }) =&gt; {">`ModeratorScreen`</SwmToken> component, which fetches and displays pending reports for moderators to review.

```
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const firestore = getFirestore(db);
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="8">

---

We use the <SwmToken path="/app/ModeratorScreen.jsx" pos="12:1:1" line-data="  useEffect(() =&gt; {">`useEffect`</SwmToken> hook to fetch reports when the component mounts.

```

const ModeratorScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="15">

---

The <SwmToken path="/app/ModeratorScreen.jsx" pos="16:3:3" line-data="  const fetchReports = async () =&gt; {">`fetchReports`</SwmToken> function queries the Firestore database for reports with a status of 'pending' and updates the state with the fetched reports.

```

  const fetchReports = async () => {
    const reportsRef = collection(firestore, 'Reports');
    const q = query(reportsRef, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    const reportsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReports(reportsList);
  };
```

---

</SwmSnippet>

# Banning reported users

<SwmSnippet path="/app/ModeratorScreen.jsx" line="23">

---

The <SwmToken path="/app/ModeratorScreen.jsx" pos="24:3:3" line-data="  const handleBanUser = async (reportId, reportedUser) =&gt; {">`handleBanUser`</SwmToken> function is responsible for banning a reported user. It first fetches the user's document from Firestore.

```

  const handleBanUser = async (reportId, reportedUser) => {
    try {
      // First, find the user document using the User_UID
      const usersRef = collection(firestore, 'Users');
      const q = query(usersRef, where('User_UID', '==', reportedUser));
      const querySnapshot = await getDocs(q);
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="30">

---

If the user is found, their status is updated to 'banned'.

```

      if (querySnapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = querySnapshot.docs[0];

      // Update user's status in Firestore
      await updateDoc(userDoc.ref, { status: 'banned' });
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="39">

---

The report's status is then updated to 'resolved', and the reports list is refreshed.

```

      // Update report status
      const reportRef = doc(firestore, 'Reports', reportId);
      await updateDoc(reportRef, { status: 'resolved' });

      // Refresh reports list
      fetchReports();
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="46">

---

An alert is shown to confirm the user has been banned, or an error message is displayed if the operation fails.

```

      Alert.alert('User Banned', 'The user has been banned successfully.');
    } catch (error) {
      console.error('Error banning user: ', error);
      Alert.alert('Error', 'Failed to ban user. Please try again.');
    }
  };
```

---

</SwmSnippet>

# Fetching and displaying user activity

<SwmSnippet path="/app/ModeratorScreen.jsx" line="53">

---

The <SwmToken path="/app/ModeratorScreen.jsx" pos="54:2:2" line-data="const fetchUserActivity = async (reportedUser) =&gt; {">`fetchUserActivity`</SwmToken> function retrieves the activity of a reported user, including their threads and posts in specific subgroups.

```

const fetchUserActivity = async (reportedUser) => {
  try {
    const usersRef = collection(firestore, 'Users');
    let userQuery = query(usersRef, where('Username', '==', reportedUser));
    let querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      userQuery = query(usersRef, where('User_UID', '==', reportedUser));
      querySnapshot = await getDocs(userQuery);
    }
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="64">

---

If the user is found, their username and UID are logged.

```

    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const userDoc = querySnapshot.docs[0];
    const username = userDoc.data().Username;
    const userUID = userDoc.data().User_UID;
    console.log('Found user:', username, 'UID:', userUID);
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="73">

---

We initialize an object to store the user's activity and iterate over specified subgroups to fetch threads and posts created by the user.

```

    const userActivity = { threads: [], posts: [] };

    const collegeName = 'Louisiana Tech University';
    const subgroupsToCheck = ['Recruiter Check', 'Test General'];

    for (const subgroupName of subgroupsToCheck) {
      console.log('Checking subgroup:', subgroupName);
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="81">

---

We fetch threads created by the user in each subgroup.

```

      const threadsRef = collection(firestore, 'Forums', collegeName, 'subgroups', subgroupName, 'threads');
      const threadsSnapshot = await getDocs(threadsRef);

      console.log('Threads found:', threadsSnapshot.size);

      // Fetch threads created by the user
      const userThreadsQuery = query(threadsRef, where('createdBy', '==', username));
      const userThreadsSnapshot = await getDocs(userThreadsQuery);
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="90">

---

The threads are added to the user's activity object.

```

      userThreadsSnapshot.forEach(threadDoc => {
        userActivity.threads.push({
          id: threadDoc.id,
          collegeName,
          subgroupName,
          ...threadDoc.data()
        });
      });
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="99">

---

We then fetch posts created by the user in each thread and add them to the user's activity object.

```

      // Fetch posts for each thread in the subgroup
      for (const threadDoc of threadsSnapshot.docs) {
        const postsRef = collection(threadsRef, threadDoc.id, 'posts');
        const postsQuery = query(postsRef, where('createdBy', '==', username));
        const postsSnapshot = await getDocs(postsQuery);

        console.log('Posts found in thread', threadDoc.id, ':', postsSnapshot.size);
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="107">

---

The complete user activity is logged and returned.

```

        postsSnapshot.forEach(postDoc => {
          userActivity.posts.push({
            id: postDoc.id,
            threadId: threadDoc.id,
            collegeName,
            subgroupName,
            ...postDoc.data()
          });
        });
      }
    }
```

---

</SwmSnippet>

<SwmSnippet path="/app/ModeratorScreen.jsx" line="127">

---

The <SwmToken path="/app/ModeratorScreen.jsx" pos="128:3:3" line-data="  const handleViewUserActivity = async (reportedUser) =&gt; {">`handleViewUserActivity`</SwmToken> function navigates to the <SwmToken path="/app/ModeratorScreen.jsx" pos="131:6:6" line-data="      navigation.navigate(&#39;UserActivityScreen&#39;, { userActivity, reportedUser });">`UserActivityScreen`</SwmToken> with the fetched user activity data.

```

  const handleViewUserActivity = async (reportedUser) => {
    const userActivity = await fetchUserActivity(reportedUser);
    if (userActivity) {
      navigation.navigate('UserActivityScreen', { userActivity, reportedUser });
    } else {
      Alert.alert('Error', 'Failed to fetch user activity. Please try again.');
    }
  };
```

---

</SwmSnippet>

# Rendering report items

<SwmSnippet path="/app/ModeratorScreen.jsx" line="136">

---

The <SwmToken path="/app/ModeratorScreen.jsx" pos="137:3:3" line-data="  const renderReportItem = ({ item }) =&gt; (">`renderReportItem`</SwmToken> function renders each report item in the <SwmToken path="/app/ModeratorScreen.jsx" pos="9:2:2" line-data="const ModeratorScreen = ({ navigation }) =&gt; {">`ModeratorScreen`</SwmToken> component, including buttons to ban the user and view their activity.

```

  const renderReportItem = ({ item }) => (
    <View style={styles.reportItem}>
      <Text>Reported User: {item.reportedUser}</Text>
      <Text>Reported By: {item.reportedBy}</Text>
      <Text>Created At: {item.createdAt.toDate().toLocaleString()}</Text>
      <Button title="Ban User" onPress={() => handleBanUser(item.id, item.reportedUser)} />
      <Button title="View User Activity" onPress={() => handleViewUserActivity(item.reportedUser)} />
    </View>
  );
```

---

</SwmSnippet>

# Displaying user activity

<SwmSnippet path="/app/UserActivityScreen.jsx" line="1">

---

In <SwmPath>[app/UserActivityScreen.jsx](/app/UserActivityScreen.jsx)</SwmPath>, we define the <SwmToken path="/app/UserActivityScreen.jsx" pos="4:2:2" line-data="const UserActivityScreen = ({ route }) =&gt; {">`UserActivityScreen`</SwmToken> component, which displays the fetched user activity.

```
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const UserActivityScreen = ({ route }) => {
  const { userActivity, reportedUser } = route.params;

  const renderItem = ({ item, type }) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{type === 'thread' ? item.title : item.content}</Text>
      <Text>Created At: {item.createdAt.toDate().toLocaleString()}</Text>
    </View>
  );
```

---

</SwmSnippet>

# Revoking user tokens

<SwmSnippet path="/functions/index.js" line="27">

---

In <SwmPath>[functions/index.js](/functions/index.js)</SwmPath>, we define a Cloud Function to revoke user tokens when their status is updated to 'banned'.

```

// Add our new function to revoke user tokens
exports.revokeUserTokens = functions.firestore
    .document("Users/{userId}")
    .onUpdate((change, context) => {
      const newValue = change.after.data();
      const previousValue = change.before.data();
```

---

</SwmSnippet>

<SwmSnippet path="/functions/index.js" line="34">

---

If the user's status changes to 'banned', their refresh tokens are revoked, and a log message is recorded.

```

      if (newValue.status === "banned" && previousValue.status !== "banned") {
        return admin.auth().revokeRefreshTokens(context.params.userId)
            .then(() => {
              logger.info("Tokens revoked for user", context.params.userId);
              return null;
            })
            .catch((error) => {
              logger.error("Error revoking tokens:", error);
            });
      }
      return null;
    });
```

---

</SwmSnippet>

# Submitting reports from the forum

<SwmSnippet path="/app/ColForum.jsx" line="122">

---

The `handleReportSubmission` function in <SwmPath>[app/ColForum.jsx](/app/ColForum.jsx)</SwmPath> handles the submission of reports from the forum interface.

```
 const handleReportSubmission = async (reportType, threadId, postId = null, reportedUsername) => {
   const reportData = {
     threadId,
     postId,
     reportedUser: reportedUsername,
     source: 'forum',
     type: reportType
   };
```

---

</SwmSnippet>

<SwmSnippet path="/app/ColForum.jsx" line="130">

---

If the report submission is successful, an alert is shown to thank the user. Otherwise, an error alert is displayed.

```

   const success = await handleReport(reportData);
   if (success) {
     Alert.alert('Report Submitted', 'Thank you for your report. Our moderators will review it shortly.');
   } else {
     Alert.alert('Error', 'Failed to submit report. Please try again.');
   }
 };
```

---

</SwmSnippet>

This concludes the walkthrough of the user reporting, reported user activity viewing, and reported user banning features.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
