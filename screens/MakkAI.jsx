import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { collection, addDoc, getDocs, getFirestore } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import themeContext from '../theme/themeContext';

const firestore = getFirestore(db);

const MakkAI = () => {
  const theme = useContext(themeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('messages');
      if (storedMessages) setMessages(JSON.parse(storedMessages));
    } catch (error) {
      console.error(error);
    }
  };

  const saveMessages = async (newMessages) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
      await saveMessagesToFirestore(newMessages);
    } catch (error) {
      console.error(error);
    }
  };

  const saveMessagesToFirestore = async (newMessages) => {
    try {
      const collectionRef = collection(firestore, 'chatbot');
      for (let message of newMessages) {
        await addDoc(collectionRef, message);
      }
    } catch (error) {
      console.error("Error saving messages to Firestore: ", error);
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');

      await saveMessages(newMessages);

      const aiResponse = await getAIResponse(input);
      const aiMessage = { id: Date.now().toString(), text: aiResponse, sender: 'ai' };
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);

      await saveMessages(updatedMessages);
    }
  };

  const getAIResponse = async (message) => {
    // const API_KEY = 'API_KEY';
    const model = 'davinci';
    const apiUrl = `https://api.openai.com/v1/engines/${model}/completions`;

    try {
      const response = await axios.post(
        apiUrl,
        {
          prompt: message,
          max_tokens: 150,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
        }
      );
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error("Error fetching AI response: ", error);
      return "Sorry, I couldn't process your request.";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={[styles.message, item.sender === 'user' ? styles.user : styles.ai]}>
            {item.text}
          </Text>
        )}
        keyExtractor={item => item.id}
      />
      <TextInput
        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
        value={input}
        onChangeText={setInput}
        placeholder="Type your message"
        placeholderTextColor={theme.color}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#ADD8E6',
  },
  ai: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6E6FA',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default MakkAI;
