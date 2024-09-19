import { Dimensions, Image, Pressable, Text, View } from "react-native";
import React, { useState } from "react";
import { useDownloadImage } from "../utils/hooks";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Animated, { withDelay, withTiming } from "react-native-reanimated";

type Props = {
  url: string | null;
};

const windowWidth = Dimensions.get("window").width;
console.log("windowWidth", windowWidth);
const customEntering = () => {
  "worklet";
  const animations = {
    originX: withTiming(50, { duration: 3000 }),
    opacity: withTiming(1, { duration: 2000 }),
  };
  const initialValues = {
    originX: 50,
    opacity: 0,
  };
  return {
    initialValues,
    animations,
  };
};

const customExiting = () => {
  "worklet";
  const animations = {
    originX: withTiming(2 * windowWidth, { duration: 3000 }),
    opacity: withTiming(0, { duration: 2000 }),
    transform: [{ scale: withTiming(0.2, { duration: 3500 }) }],
  };
  const initialValues = {
    originX: 50,
    opacity: 1,
    transform: [{ scale: 1 }],
  };
  return {
    initialValues,
    animations,
  };
};

export default function SwipeableCard({ url }: Props) {
  const { avatarUrl } = useDownloadImage(url);
  const [show, setShow] = useState<boolean>(false);

  // @ts-ignore
  return (
    <View className="flex items-center justify-center ">
      {avatarUrl ? (
        <>
          {show ? (
            <Animated.View
              className="h-[500px] w-3/4 border-2 rounded-xl border-slate-500"
              entering={customEntering}
              exiting={customExiting}>
              <Image source={{ uri: avatarUrl }} style={{ width: "100%", height: 497 }} className="rounded-xl" />
            </Animated.View>
          ) : (
            <View className="h-[500px]" />
          )}
        </>
      ) : (
        <View>
          <Text className="text-slate-300">Loading...</Text>
        </View>
      )}
      <View className="flex flex-row gap-10 pt-10">
        <Pressable onPress={() => setShow(false)}>
          <View className="w-20 h-20 rounded-full bg-[#263b44] flex justify-center items-center">
            <FontAwesome name="close" size={40} className="!text-rose-400 " />
          </View>
        </Pressable>
        <Pressable onPress={() => setShow(true)}>
          <View className="w-20 h-20 rounded-full bg-[#263b44] flex justify-center items-center">
            <AntDesign name="heart" size={40} className="!text-emerald-400 pt-1" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
