import React from 'react';
import { Image } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

// Create an animated version of the Image component
const AnimatedImage = Animated.createAnimatedComponent(Image);

const Enemy = ({ enemyPositionX, enemyPositionY, warning }) => {
  // Use an animated style hook to connect shared values to the style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: enemyPositionX.value,
      top: enemyPositionY.value,
      width: 50,
      height: 50,
    };
  });

  return (
    <AnimatedImage
      source={warning ? require('../assets/enemy-warning.png') : require('../assets/enemy.png')}
      style={animatedStyle}
      resizeMode="contain"
    />
  );
};

export default Enemy;
