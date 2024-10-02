// Bullet.jsx
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const Bullet = ({ bulletPositionX, bulletPositionY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: bulletPositionX.value },
        { translateY: bulletPositionY.value },
      ],
    };
  });

  return (
    <Animated.View style={[styles.circle, animatedStyle]} />
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 5,
    height: 5,
    backgroundColor: 'yellow',
    position: 'absolute', // Allow free movement on the screen
  },
});

export default Bullet;
