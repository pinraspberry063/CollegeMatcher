import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Button, Image } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';

export default function ProfileImagePicker({navigation}) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  
  const navigateToAccountSettings = () => {
    navigation.pop();
  }
  const uploadImage = async () => {
    const { uri } = image;
    const filename = "profile";
    const uploadUri =  uri;
    setUploading(true);
    setTransferred(0);
    const task = storage()
      .ref(filename)
      .putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!'
    );
    setImage(null);
    
  };
  
  const selectImage = async() => {
    
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      quality: 1,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    
    let response = await ImagePicker.launchImageLibraryAsync(options);
    if (!response.canceled) {
      const source = { uri: response.assets[0].uri };
      console.log(source);
      setImage(source);
      
    }
   
  };
  return (
    <SafeAreaView style={styles.container}>
      <Button style={styles.selectButton} 
      onPress={selectImage}
      title= "Select Image"/>
       
      
      <View style={styles.imageContainer}>
        {image !== null ? (
          <Image source={{ uri: image.uri }} style={styles.imageBox} />
        ) : null}
        {uploading ? (
          <View style={styles.progressBarContainer}>
            <Progress.Bar progress={transferred} width={300} />
          </View>
        ) : (
          <Button 
          style={styles.uploadButton} 
          onPress={() => {uploadImage(), navigateToAccountSettings()}}
          title= "Save"/>
            
          
        )}
      </View>
    </SafeAreaView>
  );
  
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  selectButton: {
    //borderRadius: 5,
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadButton: {
    //borderRadius: 5,
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center'
  },
  progressBarContainer: {
    marginTop: 20
  },
  imageBox: {
    width: 300,
    height: 300
  }
});