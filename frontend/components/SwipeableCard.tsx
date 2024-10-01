import { Dimensions, Image, Text, View } from "react-native";
import React from "react";
import { useDownloadImage } from "../utils/hooks";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { CustomText } from "./CustomText";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import HeaderText from "./HeaderText";

type Props = {
  url: string | null;
  username: string;
  dogName: string;
  onSwipe: (direction: "left" | "right") => void;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.1;

export default function SwipeableCard({ url, onSwipe, dogName, username }: Props) {
  const { avatarUrl } = useDownloadImage(url);
  const translateX = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        translateX.value = withSpring(translateX.value > 0 ? Math.sign(translateX.value) * SCREEN_WIDTH + 50 : Math.sign(translateX.value) * SCREEN_WIDTH - 50, {}, () =>
          runOnJS(onSwipe)(translateX.value > 0 ? "right" : "left")
        );
      } else {
        translateX.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotate: `${(translateX.value / SCREEN_WIDTH) * 15}deg` }] as any,
  }));

  // @ts-ignore
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        className="absolute h-[550px] w-5/6 rounded-xl overflow-hidden shadow-lg border-2 border-[#0A2514]"
        style={cardStyle}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="w-full h-full absolute" />
        ) : (
          <View className="flex-1 justify-center items-center bg-gray-200">
            <Text className="text-gray-500">Loading...</Text>
          </View>
        )}
        <LinearGradient
          colors={["transparent", "#0E1514"]}
          style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}
          locations={[0.65, 1]}
        />
        <View className="flex justify-end items-start h-full">
          <HeaderText className="text-3xl text-center text-emerald-300 !z-30 pb-12 pl-5">{dogName}</HeaderText>
        </View>

        <CustomText type="semiBold" className="absolute bottom-6 left-5 text-lg text-center text-slate-300 z-20">
          I'm {dogName} and my owner is {username}
        </CustomText>
      </Animated.View>
    </GestureDetector>
  );
}
