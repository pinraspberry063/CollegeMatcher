import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import PlayerShip from '../components/PlayerShip';
import Enemy from '../components/Enemy';
import Asteroid from '../components/Asteroid';

const Game = ({ navigation }) => {
  const { width: screenWidth } = Dimensions.get('window');
  const { height: screenHeight } = Dimensions.get('window');

  // Sizes based on screen dimensions
  const playerWidth = screenWidth * 0.1;
  const playerHeight = screenHeight * 0.1;

  // Initial player position based on screen size
  const playerPositionX = useSharedValue(screenWidth / 2 - playerWidth / 2);
  const playerPositionY = useSharedValue(screenHeight - playerHeight - 20);

  const warningLineHeight = screenHeight * 0.1; // 10% of screen height
  const asteroidFallDuration = 6000;

  const gameIntervals = useRef([]); // Track all intervals to clear on quit

  // Store a separate ref for swooping state
  const swoopRefs = useRef({});

  // State to track enemies and their statuses
  const [enemies, setEnemies] = useState([
    {
      id: 1,
      positionX: useSharedValue(screenWidth * 0.3),
      positionY: useSharedValue(screenHeight * 0.1), // Fixed Y position for enemy 1
      originalY: screenHeight * 0.1, // Save original Y position
      speed: Math.random() * 1000 + 500,
      active: true,
      warning: false,
    },
    {
      id: 2,
      positionX: useSharedValue(screenWidth * 0.5),
      positionY: useSharedValue(screenHeight * 0.2), // Fixed Y position for enemy 2
      originalY: screenHeight * 0.2, // Save original Y position
      speed: Math.random() * 300 + 1500,
      active: true,
      warning: false,
    },
    {
      id: 3,
      positionX: useSharedValue(screenWidth * 0.7),
      positionY: useSharedValue(screenHeight * 0.3), // Fixed Y position for enemy 3
      originalY: screenHeight * 0.3, // Save original Y position
      speed: Math.random() * 1000 + 1200,
      active: true,
      warning: false,
    },
  ]);

  // Asteroid logic with positions relative to screen
  const asteroids = [
    { positionX: useSharedValue(-screenWidth), positionY: useSharedValue(-screenHeight), warningLine: useRef(null), active: useRef(false) },
    { positionX: useSharedValue(-screenWidth), positionY: useSharedValue(-screenHeight), warningLine: useRef(null), active: useRef(false) },
    { positionX: useSharedValue(-screenWidth), positionY: useSharedValue(-screenHeight), warningLine: useRef(null), active: useRef(false) },
  ];

  useEffect(() => {
    enemies.forEach((enemy) => {
      swoopRefs.current[enemy.id] = { swooping: false };
    });
  }, [enemies]);

  // Collision Detection Logic
  const checkBoundingBoxCollision = (source, target) => {
    const sourceWidth = 70;
    const sourceHeight = 70;
    const targetWidth = 70;
    const targetHeight = 70;

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
    if (!asteroid.active.current) return;

    // Check collision with player
    if (checkBoundingBoxCollision(asteroid, { positionX: playerPositionX, positionY: playerPositionY })) {
      console.log('Player hit by asteroid!');
      // Handle player hit (e.g., reduce health)
    }

    // Check collision with enemies
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        if (enemy.active && checkBoundingBoxCollision(asteroid, enemy)) {
          console.log(`Enemy hit by asteroid!`);
          return { ...enemy, active: false }; // Deactivate enemy
        }
        return enemy;
      })
    );
  };

  const handleEnemyPlayerCollision = () => {
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        if (swoopRefs.current[enemy.id].swooping && checkBoundingBoxCollision(enemy, { positionX: playerPositionX, positionY: playerPositionY })) {
          console.log('Player collided with enemy!');
          // Handle collision logic (e.g., reduce player health)
        }
        return enemy;
      })
    );
  };

  // Movement logic for the player ship
  const movePlayer = (direction) => {
    if (direction === 'left' && playerPositionX.value > 0) {
      playerPositionX.value = withTiming(playerPositionX.value - screenWidth * 0.1, {
        duration: 50,
        easing: Easing.linear,
      });
    } else if (direction === 'right' && playerPositionX.value < screenWidth - playerWidth) {
      playerPositionX.value = withTiming(playerPositionX.value + screenWidth * 0.1, {
        duration: 50,
        easing: Easing.linear,
      });
    }
  };

  useEffect(() => {
    const moveEnemy = (enemy) => {
      const followPlayer = () => {
        if (!swoopRefs.current[enemy.id].swooping && enemy.active) {
          enemy.positionX.value = withTiming(playerPositionX.value, {
            duration: enemy.speed,
            easing: Easing.linear,
          });
        }
      };

      const swoopEnemy = () => {
        if (swoopRefs.current[enemy.id].swooping || !enemy.active) return;

        // Log when the swoop starts
        console.log(`Enemy ${enemy.id} is starting to swoop`);

        // Set swooping to true
        swoopRefs.current[enemy.id].swooping = true;

        // Start swooping process with a warning delay
        setEnemies((prevEnemies) =>
          prevEnemies.map((e) => (e.id === enemy.id ? { ...e, warning: true } : e))
        );

        setTimeout(() => {
          setEnemies((prevEnemies) =>
            prevEnemies.map((e) => (e.id === enemy.id ? { ...e, warning: false } : e))
          );

          // Move down toward the player
          enemy.positionY.value = withTiming(playerPositionY.value, {
            duration: enemy.speed,
            easing: Easing.linear,
          });

          // Move enemy horizontally off-screen
          const newPositionX = Math.random() < 0.5 ? -50 : screenWidth + 50;

          setTimeout(() => {
            enemy.positionX.value = withTiming(newPositionX, { duration: 1500, easing: Easing.linear });

            setTimeout(() => {
              enemy.positionY.value = withTiming(enemy.originalY, { duration: 1000, easing: Easing.linear });

              // Mark swoop as finished after cooldown
              const swoopCooldown = 5000 + Math.random() * 4000;
              setTimeout(() => {
                swoopRefs.current[enemy.id].swooping = false;
                console.log(`Enemy ${enemy.id} finished swooping`);
              }, swoopCooldown);
            }, 1500); // Wait for the enemy to move fully off-screen
          }, enemy.speed);
        }, 1000); // Warning duration before swoop
      };

      const swoopInterval = setInterval(swoopEnemy, 10000 + Math.random() * 5000); // Delay between swoops
      const followInterval = setInterval(followPlayer, 500);

      gameIntervals.current.push(swoopInterval, followInterval);

      return () => {
        clearInterval(swoopInterval);
        clearInterval(followInterval);
      };
    };

    enemies.forEach((enemy) => {
      if (enemy.active) moveEnemy(enemy);
    });
  }, []);


  // Falling asteroids logic
  useEffect(() => {
    const animateAsteroid = (asteroid) => {
      const randomXPosition = Math.random() * screenWidth;
      asteroid.active.current = true;

      asteroid.warningLine.current = randomXPosition;

      setTimeout(() => {
        asteroid.positionX.value = randomXPosition;
        asteroid.warningLine.current = null;

        asteroid.positionY.value = -1000;

        asteroid.positionY.value = withTiming(screenHeight + 50, {
          duration: asteroidFallDuration,
          easing: Easing.linear,
        });

        const checkForCollision = () => {
          handleAsteroidCollision(asteroid);
          if (asteroid.positionY.value < screenHeight + 50) {
            requestAnimationFrame(checkForCollision);
          } else {
            asteroid.active.current = false;
          }
        };

        checkForCollision();
      }, 1000);
    };

    const startAsteroidFall = () => {
      const numAsteroids = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numAsteroids; i++) {
        const asteroid = asteroids[Math.floor(Math.random() * asteroids.length)];
        if (!asteroid.active.current) {
          animateAsteroid(asteroid);
        }
      }
    };

    const asteroidInterval = setInterval(() => {
      startAsteroidFall();
    }, Math.random() * 5000 + 3000);

    gameIntervals.current.push(asteroidInterval);

    return () => clearInterval(asteroidInterval);
  }, []);

  // Continuously check for enemy-player collision
  useEffect(() => {
    const checkCollisionInterval = setInterval(handleEnemyPlayerCollision, 200);
    gameIntervals.current.push(checkCollisionInterval);

    return () => clearInterval(checkCollisionInterval);
  }, []);

  // Quit button handler
  const handleQuit = () => {
    gameIntervals.current.forEach(clearInterval);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
        <Text style={styles.quitText}>Quit</Text>
      </TouchableOpacity>

      <PlayerShip playerPositionX={playerPositionX} playerPositionY={playerPositionY} />

      {enemies.map((enemy, index) =>
        enemy.active ? (
          <Enemy
            key={index}
            enemyPositionX={enemy.positionX}
            enemyPositionY={enemy.positionY}
            warning={enemy.warning}
          />
        ) : null
      )}

      {asteroids.map((asteroid, index) =>
        asteroid.warningLine.current !== null ? (
          <View
            key={`warning-line-${index}`}
            style={[styles.warningLine, { left: asteroid.warningLine.current, height: warningLineHeight, top: 0 }]}
          />
        ) : null
      )}

      {asteroids.map((asteroid, index) => (
        <Asteroid key={`asteroid-${index}`} positionX={asteroid.positionX} positionY={asteroid.positionY} />
      ))}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.buttonLarge} onPressIn={() => movePlayer('left')}>
          <Text style={styles.buttonText}>{"<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLarge} onPressIn={() => movePlayer('right')}>
          <Text style={styles.buttonText}>{">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  quitButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    zIndex: 1,
  },
  quitText: { color: 'white', fontSize: 16 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 30,
    padding: 20,
  },
  buttonLarge: { backgroundColor: 'gray', borderRadius: 10, padding: 10, width: '20%' },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 24 },
  warningLine: { position: 'absolute', width: 5, backgroundColor: 'red' },
});

export default Game;
