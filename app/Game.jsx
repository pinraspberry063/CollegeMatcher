import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import PlayerShip from '../components/PlayerShip';
import Bullet from '../components/Bullet';
import Enemy from '../components/Enemy';

const Game = ({ navigation }) => {
  const playerPositionX = useSharedValue(0);
  const playerPositionY = useSharedValue(50); // Fixed Y position for the player
  const bulletPositionX = useSharedValue(-100); // Initialize off-screen
  const bulletPositionY = useSharedValue(-130); // Initial position above the screen
  const [isBulletFired, setIsBulletFired] = useState(false);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const [isFiring, setIsFiring] = useState(false); // Track if firing

  // Enemy logic
  const enemyPositionX = useSharedValue(100); // Enemy horizontal position
  const enemyPositionY = useSharedValue(-700); // Enemy vertical position
  const originalEnemyPositionY = -800; // Store the original Y position
  const [enemyActive, setEnemyActive] = useState(true); // Track if enemy is active

  // Movement logic for the player ship
  useEffect(() => {
    let moveInterval;

    if (isMovingLeft || isMovingRight) {
      moveInterval = setInterval(() => {
        if (isMovingLeft) {
          playerPositionX.value -= 10; // Continuous move left
        }
        if (isMovingRight) {
          playerPositionX.value += 10; // Continuous move right
        }
      }, 100); // Adjust speed as needed
    }

    return () => clearInterval(moveInterval); // Cleanup on unmount
  }, [isMovingLeft, isMovingRight]);

  const moveShip = (direction) => {
    if (direction === 'left') {
      playerPositionX.value -= 10; // Move left once
    } else if (direction === 'right') {
      playerPositionX.value += 10; // Move right once
    }
  };

  // Fire bullets continuously
  useEffect(() => {
    let fireInterval;

    if (isFiring) {
      fireInterval = setInterval(() => {
        if (!isBulletFired) { // Only fire if no bullet is currently active
          bulletPositionX.value = playerPositionX.value + 17; // Teleport bullet to player's position
          bulletPositionY.value = withTiming(-1000, { duration: 300 }); // Animate bullet upward
          setIsBulletFired(true); // Mark bullet as fired
        }
      }, 300); // Adjust fire rate as needed
    }

    return () => clearInterval(fireInterval); // Cleanup on unmount
  }, [isFiring, isBulletFired, bulletPositionX, bulletPositionY]);

  // Monitor bullet position to reset firing state
  useEffect(() => {
    const checkBulletPosition = () => {
      // Check if bullet has moved off-screen
      if (bulletPositionY.value < -800) {
        setIsBulletFired(false); // Allow firing again
        bulletPositionY.value = -130; // Reset bullet position
      }
    };

    const interval = setInterval(checkBulletPosition, 100); // Check every 100 ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, [bulletPositionY]);

  // Enemy Movement Logic
  useEffect(() => {
    const swoopEnemy = () => {
      if (enemyActive) {
        // Randomly determine when to swoop
        if (Math.random() < 0.02) { // Adjust probability as needed
          enemyPositionY.value = withTiming(playerPositionY.value, { duration: 500 }); // Move to player's Y position

          // Move back to original position after a delay
          setTimeout(() => {
            enemyPositionY.value = withTiming(originalEnemyPositionY, { duration: 500 }); // Reset to original Y position
          }, 1500); // Time to stay at player's Y position before returning
        }
      }
    };

    const enemyInterval = setInterval(swoopEnemy, 100); // Check for swooping every 100 ms

    return () => clearInterval(enemyInterval); // Cleanup on unmount
  }, [enemyActive, enemyPositionY, playerPositionY]); // Use playerPositionY

  // Check for bullet collision with the enemy
  useEffect(() => {
    const checkCollision = () => {
      if (isBulletFired && enemyActive) {
        // Simple collision detection logic
        if (
          bulletPositionX.value > enemyPositionX.value &&
          bulletPositionX.value < enemyPositionX.value + 50 &&
          bulletPositionY.value < enemyPositionY.value + 25 && // Adjust for enemy height
          bulletPositionY.value > enemyPositionY.value - 25 // Adjust for enemy height
        ) {
          setIsBulletFired(false); // Reset bullet
          bulletPositionY.value = -130; // Reset bullet position
          setEnemyActive(false); // Deactivate enemy
        }
      }
    };

    const collisionInterval = setInterval(checkCollision, 100); // Check for collisions

    return () => clearInterval(collisionInterval); // Cleanup on unmount
  }, [isBulletFired, enemyActive, bulletPositionX, bulletPositionY, enemyPositionX, enemyPositionY]);

  return (
    <View style={styles.container}>
      <PlayerShip playerPositionX={playerPositionX} playerPositionY={playerPositionY} />

      {isBulletFired && (
        <Bullet bulletPositionX={bulletPositionX} bulletPositionY={bulletPositionY} />
      )}

      {/* Render the enemy if active */}
      {enemyActive && <Enemy enemyPositionX={enemyPositionX} enemyPositionY={enemyPositionY} />}

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.leftControls}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => moveShip('left')} // Single tap move left
            onPressIn={() => setIsMovingLeft(true)} // Start continuous move left
            onPressOut={() => setIsMovingLeft(false)} // Stop continuous move
          >
            <Text style={styles.buttonText}>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => moveShip('right')} // Single tap move right
            onPressIn={() => setIsMovingRight(true)} // Start continuous move right
            onPressOut={() => setIsMovingRight(false)} // Stop continuous move
          >
            <Text style={styles.buttonText}>{">"}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.fireButton}
          onPressIn={() => setIsFiring(true)} // Start continuous firing
          onPressOut={() => setIsFiring(false)} // Stop firing
        >
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
