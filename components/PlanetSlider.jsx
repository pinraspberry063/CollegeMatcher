import React from "react";
import { View, SafeAreaView, Text, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  Extrapolate,
  
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";


const { width, height } = Dimensions.get("screen");

const textColor = "white";
const gray = "#A0A0A0";
const planetWidth = (width/4) * 0.75;
const planetHeight = (height/4) * 0.5;

const slides = [
  {
    text: "1",
    icon: "rocket-sharp",
  },
  {
    text: "2",
    icon: "rocket-sharp",
  },
  {
    text: "3",
    icon: "rocket-sharp",
  },
  {
    text: "4",
    icon: "rocket-sharp",
  },
  {
    text: "4",
    icon: "rocket-sharp",
  },
  {
    text: "4",
    icon: "rocket-sharp",
  },
  {
    text: "4",
    icon: "rocket-sharp",
  },
  {
    text: "4",
    icon: "rocket-sharp",
  },
  {
    text: "4",
    icon: "rocket-sharp",
  },
  {
    text: "4",
    icon: "rocket-sharp",
  },
];

const Slide = ({ slide, scrollOffset, index }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollOffset.value / planetWidth;
    const inputRange = [index - 1, index, index + 1];
    const inputYRange = [index-3, index -2, index -1, index, index+1, index +2, index +3]

    return {
      transform: [
        {
          scale: interpolate(
            input,
            inputRange,
            [0.8, 0.8, 0.8],
            Extrapolate.CLAMP
          ),
        },
        {
            // TranslateY effect to move the focused slide lower
            translateY: interpolate(input, inputYRange, [-70,20,45, 60,45, 20, -70], Extrapolate.CLAMP),
        },
        {
            // TranslateY effect to move the most outer slides closer in for orbiting effect
            translateX: interpolate(input, inputYRange, [-100 ,0 ,0 ,0 ,0, 0, 100], Extrapolate.CLAMP),
        },
      ],
      // Change aopactiy of theslides as they dissappear behind the planet
      opacity: interpolate(input, inputYRange, [0, 0.75, 1, 1, 1, 0.75, 0], Extrapolate.CLAMP),
      
    };
  });

  return (
    <Animated.View
      key={index}
      style={[
        {
          flex: 1,
          width: planetWidth,
          height: planetHeight,
          paddingVertical: 10,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          padding: 5,
          alignItems: "center",
          backgroundColor: 'purple',
          borderRadius: 100,
          height: '80%',
          justifyContent: "center",
        }}
      >
        <Ionicons name={slide.icon} size={25} color={textColor} />
        <Text
          style={{
            color: textColor,
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          {slide.text}
        </Text>
      </View>
    </Animated.View>
  );
};

const Indicator = ({ scrollOffset, index }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollOffset.value / planetWidth;
    const inputRange = [index - 1, index, index + 1];
    const animatedColor = interpolateColor(input, inputRange, [
      gray,
      textColor,
      gray,
    ]);

    return {
      width: interpolate(input, inputRange, [20, 40, 20], Extrapolate.CLAMP),
      backgroundColor: animatedColor,
    };
  });

  return (
    <Animated.View
      style={[
        {
          marginHorizontal: 5,
          height: 20,
          borderRadius: 10,
          backgroundColor: textColor,
        },
        animatedStyle,
      ]}
    />
  );
};

const PlanetSwiper = () => {
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;

      
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-around" }}>
      <Animated.ScrollView
        scrollEventThrottle={1}
        horizontal
        snapToInterval={planetWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: ((width - planetWidth) / 2),
          justifyContent: "center",
        }}
        onScroll={scrollHandler}
      >
        {slides.map((slide, index) => {
          return (
            <Slide
              key={index}
              index={index}
              slide={slide}
              scrollOffset={scrollOffset}
            />
          );
        })}
      </Animated.ScrollView>
      {/* <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        {slides.map((_, index) => {
          return (
            <Indicator key={index} index={index} scrollOffset={scrollOffset} />
          );
        })}
      </View> */}
    </SafeAreaView>
  );
};

export default PlanetSwiper;