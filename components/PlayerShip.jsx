import React from 'react';
import { StyleSheet, Image } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import playerImage from '../assets/player.webp';

const PlayerShip = ({ playerPositionX, playerPositionY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
        position: "absolute",
      transform: [
        { translateX: playerPositionX.value - 25 }, // Center horizontally (50 width)
        { translateY: playerPositionY.value }, // No vertical adjustment needed
      ],
    };
  });

  return (
    <Animated.Image
      source={playerImage}
      style={[styles.ship, animatedStyle]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  ship: {
    width: 70,  // Set the actual image width
    height: 70, // Set the actual image height
  },
});

export default PlayerShip;