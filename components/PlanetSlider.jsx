import React, {useRef, useEffect} from "react";
import { View, SafeAreaView, Text, ImageBackground, Dimensions, TouchableOpacity , Image, StyleSheet} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  Extrapolate,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FastImage from "react-native-fast-image";


// Imported planet images
const redImage = require('../assets/red.png');
const purImage = require('../assets/pur.png');
const pnkImage = require('../assets/pnk.png');
const bluImage = require('../assets/blu.png');
const brnImage = require('../assets/brn.png');
const greImage = require('../assets/gre.png');
const cynImage = require('../assets/cyn.png');

const { width, height } = Dimensions.get("screen");

const textColor = "white";
const gray = "#A0A0A0";
const planetWidth = (width / 4) * 1.3;
const planetHeight = (height / 4) * 1.3;

const slides = [
  {
    icon: "lead-pencil",
    page: 'QuizButton',
    image: redImage,
    iconColor: "yellow",
    label: 'Quiz', 
    txtColor: textColor
  },
  {
    icon: "magnify",
    page: 'QuizStack',
    image: purImage,
    iconColor: "yellow",
    label: 'Search',
    txtColor: textColor
  },
  {
    icon: "head",
    page: 'AI',
    image: greImage,
    iconColor: "orange",
    label: 'MAKK AI',
    txtColor: 'black'
  },
  {
    icon: "message",
    page: 'Messages',
    image: bluImage,
    iconColor: "yellow",
    label: 'Messages',
    txtColor: textColor
  },
  {
    icon: "earth",
    page: 'ColForumSelectorTab',
    image: brnImage,
    iconColor: "yellow",
    label: 'Forums',
    txtColor: textColor
  },
  {
    icon: "compare-vertical",
    page: 'CompareColleges',
    image: pnkImage,
    iconColor: "yellow",
    label: 'Compare',
    txtColor: textColor
  },
  {
    icon: "star-settings-outline",
    page: 'Settings',
    image: cynImage,
    iconColor: "orange",
    label: 'Settings',
    txtColor: 'black'
  },
];

const Slide = ({ slide, scrollOffset, index, navigation }) => {

  const txtCol = slide.txtColor;
  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollOffset.value / planetWidth;
    const inputRange = [index - 1, index, index + 1];
    const inputYRange = [index - 2, index - 1, index, index + 1, index + 2];
    

    return {
      transform: [
        {
          // Adjust scale for zoom in and out effect
          scale: interpolate(input, inputRange, [0.75, 0.95, 0.75], Extrapolate.CLAMP),
        },
        {
          // Planets will move vertically to simulate "revolving" around the sun
          translateY: interpolate(input, inputYRange, [-90, -25, 15, -25, -90], Extrapolate.CLAMP),
        },
        {
          // Horizontal translation for orbit effect
          translateX: interpolate(input, inputYRange, [-20, 0.05, 0, 0.05, -20], Extrapolate.CLAMP),
        },
      ],
      // Opacity to fade in and out as the planets "move"
      opacity: interpolate(input, inputYRange, [0.5, 0.75, 1, 0.75, 0.5], Extrapolate.CLAMP),
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
      <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate(slide.page)}>
        <View
          style={{
            padding: 5,
            alignItems: "center",
            borderRadius: 100,
            height: '80%',
            justifyContent: "center",
            position: 'relative',
          }}
        >
          <FastImage
            source={slide.image}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 100,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            resizeMode="contain"
          >
            <MaterialCommunityIcons name={slide.icon} size={50} color={slide.iconColor} />
            <Text style={{color: txtCol, fontSize: 23, fontWeight: 'bold'}}>{slide.label}</Text>
          </FastImage>
          
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PlanetSwiper = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const { width } = Dimensions.get('window');

  // Calculate the initial offset for the middle element
  const initialOffset = (planetWidth);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: initialOffset, animated: false });
    }
  }, []);

  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-around" }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={1}
        horizontal
        snapToInterval={planetWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: (width - planetWidth) / 2,
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
              navigation={navigation}
            />
          );
        })}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  tabIcon:{
    width:20, 
    height: 20, 
    borderRadius:10
  }
});
export default PlanetSwiper;
