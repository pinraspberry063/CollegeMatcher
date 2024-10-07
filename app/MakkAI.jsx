import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
// import { collection, addDoc, getFirestore } from 'firebase/firestore';
// import { getFirestore } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import themeContext from '../theme/themeContext';

import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
// import { getVertexAI, getGenerativeModel, startChat, sendMessageStream } from "firebase/vertexai-preview";

// const firestore = getFirestore(db);

// Initialize the Vertex AI service
const vertexAI = getVertexAI(db);

// Initializes the generative model

// system instructions text
const si = {
    role: "system",
    parts: [
        {
            text:
`You are a friendly and helpful assistant for a college matching app.
You are tasked with helping high school graduates find information about colleges and universities.
You are playing the role of a college recruiter and advisor.
Ensure your answers are complete, unless the user requests a more concise approach.
When presented with inquiries seeking information, provide answers that reflect a deep understanding of the field, guaranteeing their correctness.
For any non-english queries, respond in the same language as the prompt unless otherwise specified by the user.
For prompts involving reasoning, provide a clear explanation of each step in the reasoning process before presenting the final answer.
Ground your responses about university facts and figures using data from the internet.
Provide users links to university websites when appropriate.
Limit your responses to an amount appropriate for a mobile app screen.`,
        }
    ]
}
const model = getGenerativeModel(vertexAI, {model: "gemini-1.5-flash", systemInstruction: si});

const MakkAI = () => {
  const theme = useContext(themeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatSession, setchatSession] = useState(null);

  useEffect(() => {
    const initializeChatSession = () => {
      try {
        const chat =  model.startChat({ generationConfig: {maxOutputTokens: 500 } });
        console.log("model started chat: ", chat);
        setchatSession(chat);
      } catch (error) {
        console.error("error starting chat session: ", error);
      }
    };

    initializeChatSession();

    return () => {
      if (chatSession) {
        console.log("something something? cleanup?");
      }
    }
  }, []);

  const sendMessage = async () => {
    const userMessage = { sender: 'user', text: input, id: Date.now().toString() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    console.log("here is the user message sent: ", userMessage.text);
    console.log("and here is the whole thing: ", userMessage);
    await getAIResponse(userMessage.text);
  };

  const getAIResponse = async (userText) => {
    if (!chatSession) {
      console.error("Chat session not initialized.");
    }

    try {
      // streaming response type chat (didn't work, come back and fix later)

      // const { stream, response } = chatSession.sendMessageStream(userText);
      // if (!stream.text()) {
      //   console.error("stream is undefined.");
      //   return;
      // }
      // for await (const partials of stream) {
      //   if (!partials) {
      //     console.error('rx undefined partials.');
      //     // continue;
      //   }
      //   const aiMessage = {
      //     sender: 'ai',
      //     text: partials.text() || "No response text",
      //     id: Date.now().toString(),
      //   };
      //   setMessages(prevMessages => [...prevMessages, aiMessage]);
      // }
      // const finalResponse = await response;
      // if (!finalResponse) {
      //   console.error("Final response is undefined.")
        // return;
      // }

      const result = await chatSession.sendMessage(userText);
      const response = result.response;
      const aiMessage = {
        sender: "ai",
        text: response.text(),
        id: Date.now().toString(),
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
      // console.log("final Ai Response: ", finalResponse.text());
    } catch (error) {
      console.error('Error getAIResponse:', error);
    }
  };

  // noinspection JSValidateTypes
  return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === "ios" ? "padding" : null}>

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
            <View style={styles.inputContainer}>
              <TextInput
                  style={[styles.input, { color: theme.color, borderColor: theme.color }]}
                  value={input}
                  onChangeText={setInput}
                  placeholder="Chat with an AI assistant about your college questions!"
                  placeholderTextColor={theme.color}
              />
              <Button title="Send" onPress={sendMessage} />
              {/*<Button title="Send" onPress={run} />*/}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingBottom: 40,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default MakkAI;