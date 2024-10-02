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
    <Animated.View style={[styles.bullet, animatedStyle]} />
  );
};

const styles = StyleSheet.create({
  bullet: {
    width: 10,
    height: 10,
    backgroundColor: 'yellow',
    position: 'absolute', // Allow free movement on the screen
  },
});

export default Bullet;
