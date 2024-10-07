import React from 'react';
import { StyleSheet, Image } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import playerImage from '../assets/player.webp';

const PlayerShip = ({ playerPositionX, playerPositionY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
        position: 'absolute',
              left: playerPositionX.value - 35,
              top: playerPositionY.value,
              width: 70,
              height: 70,
            };
          });

  return (
    <Animated.Image
      source={playerImage}
      style={[styles.ship, animatedStyle]}
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