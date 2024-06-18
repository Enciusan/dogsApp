import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function HomeScreen() {
  const bottomTabBarHeight = useBottomTabBarHeight();
  return (
    <View className="h-screen bg-[#1b1b1b]" style={{ paddingBottom: bottomTabBarHeight }}>
      <ScrollView horizontal={false}>
        <View className="flex h-screen justify-center items-center w-full">
          <Text className="text-slate-300">Here is Home</Text>
          <Text className="text-slate-300 mt-20">Here is Home</Text>
          <Text className="text-slate-300 mt-20">Here is Home</Text>
        </View>
      </ScrollView>
    </View>
  );
}
