import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import PlayerShip from '../components/PlayerShip';
import Enemy from '../components/Enemy';
import Asteroid from '../components/Asteroid';

const Game = ({ navigation }) => {
  const playerPositionX = useSharedValue(150);
  const playerPositionY = useSharedValue(-100); // Ensure player Y position is a valid value within screen height
  const screenWidth = 400;
  const screenHeight = 800;
  const warningLineHeight = 100;
  const asteroidFallDuration = 3000;

  const gameIntervals = useRef([]); // Track all intervals to clear on quit

  // Enemy logic
  const enemies = [
    {
      positionX: useSharedValue(150),
      positionY: useSharedValue(100),
      active: useRef(true),
      swooping: useRef(false),
      originalY: 100,
      warning: useRef(false),
    },
    {
      positionX: useSharedValue(200),
      positionY: useSharedValue(200),
      active: useRef(true),
      swooping: useRef(false),
      originalY: 200,
      warning: useRef(false),
    },
    {
      positionX: useSharedValue(250),
      positionY: useSharedValue(300),
      active: useRef(true),
      swooping: useRef(false),
      originalY: 300,
      warning: useRef(false),
    },
  ];

  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);

  // Asteroid logic
  const asteroids = [
    { positionX: useSharedValue(0), positionY: useSharedValue(-900), warningLine: useRef(null), active: useRef(false) },
    { positionX: useSharedValue(0), positionY: useSharedValue(-900), warningLine: useRef(null), active: useRef(false) },
    { positionX: useSharedValue(0), positionY: useSharedValue(-900), warningLine: useRef(null), active: useRef(false) },
  ];

  // Movement logic for the player ship
  useEffect(() => {
    const movePlayer = () => {
      if (isMovingLeft && playerPositionX.value > 0) {
        playerPositionX.value = withTiming(playerPositionX.value - 20, {
          duration: 100,
          easing: Easing.linear,
        });
      }
      if (isMovingRight && playerPositionX.value < screenWidth - 50) { // Ensure player does not move off-screen
        playerPositionX.value = withTiming(playerPositionX.value + 20, {
          duration: 100,
          easing: Easing.linear,
        });
      }
    };

    const interval = setInterval(movePlayer, 200);
    gameIntervals.current.push(interval);

    return () => clearInterval(interval);
  }, [isMovingLeft, isMovingRight, playerPositionX]);

  // Improved Collision Detection Logic
  const checkBoundingBoxCollision = (source, target) => {
    const sourceWidth = 30; // Assuming width of source (asteroid or enemy)
    const sourceHeight = 30; // Assuming height of source
    const targetWidth = 50; // Assuming width of target (player or enemy)
    const targetHeight = 50; // Assuming height of target

    const sourceLeft = source.positionX.value;
    const sourceRight = source.positionX.value + sourceWidth;
    const sourceTop = source.positionY.value;
    const sourceBottom = source.positionY.value + sourceHeight;

    const targetLeft = target.positionX.value;
    const targetRight = target.positionX.value + targetWidth;
    const targetTop = target.positionY.value;
    const targetBottom = target.positionY.value + targetHeight;

    return (
      sourceLeft < targetRight &&
      sourceRight > targetLeft &&
      sourceTop < targetBottom &&
      sourceBottom > targetTop
    );
  };

  const handleAsteroidCollision = (asteroid) => {
    if (!asteroid.active.current) return; // Check if asteroid is active before checking collision

    // Check collision with player
    if (checkBoundingBoxCollision(asteroid, { positionX: playerPositionX, positionY: playerPositionY })) {
      console.log('Player hit by asteroid!');
      // Handle player hit (e.g., reduce health)
    }

    // Check collision with enemies
    enemies.forEach((enemy, index) => {
      if (enemy.active.current && checkBoundingBoxCollision(asteroid, enemy)) {
        console.log(`Enemy ${index + 1} hit by asteroid!`);
        enemy.active.current = false; // Deactivate enemy
      }
    });
  };

  // Handle enemy and player collision
  const handleEnemyPlayerCollision = () => {
    enemies.forEach((enemy, index) => {
      if (enemy.active.current && checkBoundingBoxCollision(enemy, { positionX: playerPositionX, positionY: playerPositionY })) {
        console.log(`Player collided with enemy ${index + 1}!`);
        // Handle collision logic (e.g., reduce player health, deactivate enemy)
      }
    });
  };

  // Enemy Movement Logic
  useEffect(() => {
    const moveEnemy = (enemy) => {
      const followPlayer = () => {
        if (!enemy.swooping.current && enemy.active.current) {
          enemy.positionX.value = withTiming(playerPositionX.value, {
            duration: 2000,
            easing: Easing.linear,
          });
        }
      };

      const swoopEnemy = () => {
        if (!enemy.swooping.current && !enemy.warning.current) {
          // Trigger the warning state
          enemy.warning.current = true;

          // Display warning and freeze for a moment before swooping
          setTimeout(() => {
            enemy.warning.current = false; // Hide warning
            enemy.swooping.current = true; // Start swooping

            // Move enemy downward toward the player
            enemy.positionY.value = withTiming(screenHeight - 100, { duration: 2000, easing: Easing.linear }); // Move down near player

            const newPositionX = Math.random() < 0.5 ? -50 : screenWidth + 50;

            setTimeout(() => {
              // Move enemy horizontally to side
              enemy.positionX.value = newPositionX;

              // Return to original position
              enemy.positionY.value = withTiming(enemy.originalY, { duration: 1000, easing: Easing.linear });
              enemy.positionX.value = withTiming(playerPositionX.value + Math.random() * 50 - 25, {
                duration: 2000,
                easing: Easing.linear,
              });

              enemy.swooping.current = false;
            }, 2000);
          }, 1000); // 1 second warning before swooping
        }
      };

      const swoopInterval = setInterval(swoopEnemy, 6000 + Math.random() * 3000);
      const followInterval = setInterval(followPlayer, 500);

      gameIntervals.current.push(swoopInterval, followInterval);

      return () => {
        clearInterval(swoopInterval);
        clearInterval(followInterval);
      };
    };

    enemies.forEach((enemy) => {
      if (enemy.active.current) moveEnemy(enemy);
    });
  }, []);

  // Falling asteroids logic
  useEffect(() => {
    const animateAsteroid = (asteroid) => {
      const randomXPosition = Math.random() * screenWidth;
      asteroid.active.current = true; // Set asteroid to active

      // Show warning line before fall
      asteroid.warningLine.current = randomXPosition;

      setTimeout(() => {
        asteroid.positionX.value = randomXPosition;
        asteroid.warningLine.current = null;

        asteroid.positionY.value = -1000;

        // Animate fall and handle collisions
        asteroid.positionY.value = withTiming(screenHeight + 50, {
          duration: asteroidFallDuration,
          easing: Easing.linear,
        });

        const checkForCollision = () => {
          handleAsteroidCollision(asteroid);
          if (asteroid.positionY.value < screenHeight + 50) {
            requestAnimationFrame(checkForCollision);
          } else {
            asteroid.active.current = false; // Deactivate asteroid when off-screen
          }
        };

        checkForCollision(); // Start checking collisions
      }, 1000);
    };

    // Start each asteroid fall with intervals
    asteroids.forEach((asteroid) => {
      const initialDelay = Math.random() * 5000;
      const repeatDelay = 7000;

      setTimeout(() => {
        animateAsteroid(asteroid);
        const interval = setInterval(() => animateAsteroid(asteroid), repeatDelay);
        gameIntervals.current.push(interval);
      }, initialDelay);
    });
  }, []);

  // Continuously check for enemy-player collision
  useEffect(() => {
    const checkCollisionInterval = setInterval(handleEnemyPlayerCollision, 200);
    gameIntervals.current.push(checkCollisionInterval);

    return () => clearInterval(checkCollisionInterval);
  }, []);

  // Quit button handler
  const handleQuit = () => {
    gameIntervals.current.forEach(clearInterval); // Clear all intervals
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <View style={styles.container}>
      {/* Quit Button */}
      <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
        <Text style={styles.quitText}>Quit</Text>
      </TouchableOpacity>

      <PlayerShip playerPositionX={playerPositionX} playerPositionY={playerPositionY} />

      {/* Render enemies and warnings */}
      {enemies.map((enemy, index) =>
        enemy.active.current ? (
          <Enemy
            key={index}
            enemyPositionX={enemy.positionX}
            enemyPositionY={enemy.positionY}
            warning={enemy.warning.current}
          />
        ) : null
      )}

      {/* Render warning lines before asteroids fall */}
      {asteroids.map((asteroid, index) =>
        asteroid.warningLine.current !== null ? (
          <View
            key={`warning-line-${index}`}
            style={[styles.warningLine, { left: asteroid.warningLine.current, height: warningLineHeight, top: 0 }]}
          />
        ) : null
      )}

      {/* Render the falling asteroids */}
      {asteroids.map((asteroid, index) => (
        <Asteroid key={`asteroid-${index}`} positionX={asteroid.positionX} positionY={asteroid.positionY} />
      ))}

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.leftControls}>
          <TouchableOpacity
            style={styles.buttonLarge}
            onPressIn={() => setIsMovingLeft(true)}
            onPressOut={() => setIsMovingLeft(false)}
          >
            <Text style={styles.buttonText}>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonLarge}
            onPressIn={() => setIsMovingRight(true)}
            onPressOut={() => setIsMovingRight(false)}
          >
            <Text style={styles.buttonText}>{">"}</Text>
          </TouchableOpacity>
        </View>
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
  quitButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    zIndex: 1, // Ensure the button is on top
  },
  quitText: {
    color: 'white',
    fontSize: 16,
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
  buttonLarge: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 10,
    width: 200,
    marginRight: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
  },
  warningLine: {
    position: 'absolute',
    width: 5,
    backgroundColor: 'red',
  },
});

export default Game;
