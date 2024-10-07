// components/Asteroid.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const Asteroid = ({ positionX, positionY }) => {
  // Animated styles for asteroid position
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value - 35 },
      { translateY: positionY.value - 35 }
    ],
  }));

  return (
    <Animated.View style={[styles.asteroid, animatedStyle]} />
  );
};

const styles = StyleSheet.create({
  asteroid: {
    width: 70,
    height: 70,
    backgroundColor: 'gray',
    borderRadius: 15,
    position: 'absolute',
  },
});

export default Asteroid;
