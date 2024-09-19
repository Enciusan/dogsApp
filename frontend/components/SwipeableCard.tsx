import { Dimensions, Image, Pressable, Text, View } from "react-native";
import React from "react";
import { useDownloadImage } from "../utils/hooks";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { CustomText } from "./CustomText";

type Props = {
  url: string | null;
  likePressed: boolean;
  setLikePressed: (value: boolean) => void;
  dislikePressed: boolean;
  setDislikePressed: (value: boolean) => void;
  username: string;
  dogName: string;
};

const mobileWidth = Dimensions.get("window").width;

export default function SwipeableCard({
  url,
  dislikePressed,
  setDislikePressed,
  likePressed,
  setLikePressed,
  dogName,
  username,
}: Props) {
  const { avatarUrl } = useDownloadImage(url);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleLikePressed = () => {
    translateX.value = withTiming(mobileWidth, { duration: 1500 });
    setTimeout(() => {
      setLikePressed(false);
    }, 1500);
  };

  const handleDislikePressed = () => {
    translateX.value = withTiming(-mobileWidth, { duration: 1500 });
    setTimeout(() => {
      setDislikePressed(false);
    }, 1500);
  };

  if (dislikePressed) {
    handleDislikePressed();
  } else if (likePressed) {
    handleLikePressed();
  }
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value * 2) }],
  }));

  // @ts-ignore
  return (
    <View className="flex items-center justify-center ">
      {avatarUrl ? (
        <>
          <Animated.View className="h-[500px] w-3/4 border-2 rounded-xl border-slate-500" style={[animatedStyles]}>
            <LinearGradient
              colors={["transparent", "#0E1514"]}
              style={{ width: "100%", height: 497, borderRadius: 10 }}
            />
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: "100%", height: 497 }}
              className="rounded-xl absolute !-z-10"
            />
            <CustomText type={"semiBold"} className="absolute bottom-6 left-5 text-lg text-center !text-slate-200">
              I&apos;m {dogName} and my owner is {username}
            </CustomText>
          </Animated.View>
        </>
      ) : (
        <View>
          <Text className="text-slate-300">Loading...</Text>
        </View>
      )}
    </View>
  );
}
