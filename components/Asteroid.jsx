// components/Asteroid.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const Asteroid = ({ positionX, positionY }) => {
  // Animated styles for asteroid position
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value }
    ],
  }));

  return (
    <Animated.View style={[styles.asteroid, animatedStyle]} />
  );
};

const styles = StyleSheet.create({
  asteroid: {
    width: 30,
    height: 30,
    backgroundColor: 'gray',
    borderRadius: 15,
    position: 'absolute', // Make sure it can be positioned freely
  },
});

export default Asteroid;
