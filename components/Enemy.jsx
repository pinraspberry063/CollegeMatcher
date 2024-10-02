import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const Enemy = ({ enemyPositionX, enemyPositionY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
          { translateX: enemyPositionX.value },
          { translateY: enemyPositionY.value },
          ],
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
    backgroundColor: 'red',
  },
});

export default Enemy;
