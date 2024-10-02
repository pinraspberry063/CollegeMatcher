import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const PlayerShip = ({ playerPositionX, playerPositionY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
          { translateX: playerPositionX.value },
          { translateY: playerPositionY.value}],
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
