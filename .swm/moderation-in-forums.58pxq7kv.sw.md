---
title: Moderation in Forums
---
<SwmSnippet path="/app/ColForum.jsx" line="465">

---

### Overview

This code is part of **ColForum.jsx**, a forum component that enables moderators to manage user activities, including reporting content, viewing user activity, and banning users. The main functionalities provided by this code are:

- **User Reporting**: Allows users to report content, providing various reporting reasons.

- **Moderation Actions**: Provides moderators with tools to ban users and view a user’s activity for enhanced community management.

### `handleReportSubmission`

This function handles the submission of a report by a user.

- **Parameters**:

  - `reportType`: Specifies the type of report.

  - `threadId`: The ID of the thread related to the report.

  - `postId` (optional): The ID of the post related to the report.

  - `reportedUsername`: The username of the user being reported.

  - `content`: The content that’s being reported.

- **Functionality**:

  - Checks if the `reportedUsername` is the same as the current user's username. If so, it displays an alert and exits.

  - Sets the `currentReportData` with the report details.

  - Sets the report modal to visible, allowing the user to proceed with report actions.

---

### `handleBanUserAction`

This asynchronous function processes the banning of a user based on report data.

- **Functionality**:

  - If `currentReportData` exists, it attempts to ban the user by calling `handleBanUser`.

  - On successful banning, it alerts the user of success and refreshes the threads list with `fetchThreadsAndPosts`.

  - If there’s an error, it alerts the user of the failure.

  - Hides the report modal upon completion.

---

### `handleViewUserActivityAction`

This asynchronous function fetches and navigates to the reported user's activity screen.

- **Functionality**:

  - Checks if `currentReportData` is available, then attempts to fetch user activity by username.

  - If successful, navigates to the `UserActivityScreen`, passing in the user activity and username.

  - Alerts the user of an error if activity fetch fails.

  - Closes the report modal afterward.

---

### `ReportModal` Component

This is a modal component for reporting content, available to all users, with additional moderator actions (e.g., banning, viewing user activity) if the user is a moderator.

- **Props**:

  - `isVisible`: Boolean to toggle modal visibility.

  - `onClose`: Function to close the modal.

  - `onSubmit`: Callback function to submit the selected reason.

  - `isModerator`: Boolean to check if the user has moderator privileges.

  - `onBanUser`: Function to handle user banning.

  - `onViewActivity`: Function to view user activity.

- **Functionality**:

  - Presents a list of reasons for reporting content.

  - Displays moderator-only buttons for banning a user or viewing their activity if the user has moderator privileges.

  - Contains “Cancel” and “Submit” buttons; the Submit button is disabled until a reason is selected.

```javascript
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

```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
