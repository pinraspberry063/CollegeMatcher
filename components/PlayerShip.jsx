import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const PlayerShip = ({ playerPosition }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: playerPosition.value }],
    };
  });

  return (
    <Animated.View style={[styles.ship, animatedStyle]} />
  );
};

const styles = StyleSheet.create({
  ship: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
  },
});

export default PlayerShip;
