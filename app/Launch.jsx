import {StyleSheet, Text, View, Button, ImageBackground, Animated} from 'react-native';
import React, {useRef, useEffect} from 'react';

//test background
//const backgroundImage = { uri: 'file:./assets/universe.jpeg' };

const Launch = ({navigation}) => {
    // animation value for opacity
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // fade-in effect
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000, //in ms
            useNativeDriver: true,
            }).start();
        }, [fadeAnim]);

  return (
    <Animated.View style={{...styles.container, opacity: fadeAnim}}>
     <ImageBackground source={require('../assets/galaxy.webp')} style={styles.background}>
       <View style={styles.buttonContainer2}>
          <Button
            title="Login"
            onPress={() => {
              navigation.navigate('Login');
            }}
            buttonStyle={styles.button2}
          />
          <Button
            title="Create Account"
            onPress={() => {
              navigation.navigate('CreateAccount');
            }}
            buttonStyle={styles.button2}
          />
        </View>
      </ImageBackground>
    </Animated.View>
  );
};


export default Launch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        },
  buttonContainer2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2: {
    marginVertical: 10,
    width: 200,
    },
})