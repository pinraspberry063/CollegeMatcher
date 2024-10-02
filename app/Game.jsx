import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import PlayerShip from '../components/PlayerShip';
import Bullet from '../components/Bullet';

const Game = ({ navigation }) => {
  const playerPosition = useSharedValue(0);
  const [bullets, setBullets] = useState([]);

  const moveLeft = () => {
    playerPosition.value -= 10; // Move left
  };

  const moveRight = () => {
    playerPosition.value += 10; // Move right
  };

  const fire = () => {
    const newBulletPositionX = useSharedValue(playerPosition.value); // Start at the player's position
    const newBulletPositionY = useSharedValue(0); // Start at the bottom of the screen

    // Create a new bullet with its position values
    setBullets((prev) => [
      ...prev,
      { positionX: newBulletPositionX, positionY: newBulletPositionY },
    ]);
  };

  // Effect to move bullets upwards over time
  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prevBullets) =>
        prevBullets.map((bullet) => {
          bullet.positionY.value += 5; // Move bullet upward
          return bullet;
        })
      );
    }, 100); // Adjust speed as needed

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <View style={styles.container}>
      <PlayerShip playerPosition={playerPosition} />

      {bullets.map((bullet, index) => (
        <Bullet key={index} bulletPositionX={bullet.positionX} bulletPositionY={bullet.positionY} />
      ))}

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.leftControls}>
          <TouchableOpacity style={styles.button} onPress={moveLeft}>
            <Text style={styles.buttonText}>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={moveRight}>
            <Text style={styles.buttonText}>{">"}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.fireButton} onPress={fire}>
          <Text style={styles.buttonText}>Fire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
  },
  leftControls: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 5,
    width: 50,
    marginRight: 10,
  },
  fireButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
    width: '30%',
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Game;
