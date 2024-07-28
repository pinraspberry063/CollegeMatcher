import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { UserContext } from '../components/UserContext';

const RecConvs = ({ navigation }) => {
  const theme = useContext(themeContext);
  const { user } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchConversations = async () => {
      if (user) {
        const firestore = getFirestore(db);
        const messagingRef = collection(firestore, 'Messaging');
        const recruiterQuery = query(messagingRef, where('Recruiter_UID', '==', user.uid));

        console.log('Fetching conversations for recruiter:', user.uid); // Debugging log
        const querySnapshot = await getDocs(recruiterQuery);
        console.log('Query snapshot size:', querySnapshot.size); // Debugging log

        const convs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched conversations:', convs); // Debugging log
        setConversations(convs);

        // Fetch usernames for User_UIDs
        const userUIDs = convs.map(conv => conv.User_UID);
        fetchUsernames(userUIDs);
      }
    };

    const fetchUsernames = async (userUIDs) => {
      const firestore = getFirestore(db);
      const usersRef = collection(firestore, 'Users');
      const usernameMap = {};

      for (const uid of userUIDs) {
        const userQuery = query(usersRef, where('User_UID', '==', uid));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          usernameMap[uid] = userDoc.data().Username;
        }
      }

      setUsernames(usernameMap);
    };

    fetchConversations();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { color: theme.color }]}>Conversations</Text>
      <ScrollView style={styles.conversationsContainer}>
        {conversations.map(conv => (
          <View key={conv.id} style={styles.conversation}>
            <Text style={styles.conversationText}>Conversation with: {usernames[conv.User_UID] || conv.User_UID}</Text>
            <Button title="Open" onPress={() => navigation.navigate('Message', { conversationId: conv.id })} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  conversationsContainer: {
    flex: 1,
  },
  conversation: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
  },
  conversationText: {
    fontSize: 16,
  },
});

export default RecConvs;
