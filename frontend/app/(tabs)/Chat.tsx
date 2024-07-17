import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function ChatScreen() {
  const bottomTabBarHeight = useBottomTabBarHeight();
  return (
    <View className="h-screen bg-[#0E1514]" style={{ paddingBottom: bottomTabBarHeight }}>
      <ScrollView horizontal={false}>
        <View className="flex h-screen justify-center items-center w-full">
          <Text className="text-slate-300">Here will be Chat</Text>
        </View>
      </ScrollView>
    </View>
  );
}
