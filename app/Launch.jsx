import {StyleSheet, Text, View, Button, ImageBackground, Animated, Dimensions} from 'react-native';
import React, {useRef, useEffect} from 'react';

const {width, height} = Dimensions.get('window'); // Get the dimensions of the device

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
        width: '100%', // Scale to the full width of the device
        height: '100%', // Scale to the full height of the device
    },
    buttonContainer2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button2: {
        marginVertical: height * 0.02, // Dynamic vertical margin based on screen height
        width: width * 0.5, // Button width is 50% of the device width
    },
});
