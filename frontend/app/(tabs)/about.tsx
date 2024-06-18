import { SafeAreaView, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function TabTwoScreen() {
  return (
    <SafeAreaView className="bg-[#1b1b1b]">
      <View className="flex flex-col items-center gap-4 text-center h-screen">
        <Text
          role="heading"
          className="text-3xl text-center text-slate-100 native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          YEYE
        </Text>
        <Text className="mx-auto max-w-[700px] text-lg text-center text-gray-500 md:text-xl dark:text-gray-400">
          WOHO
        </Text>

        <View className="gap-4">
          <Link
            suppressHighlighting
            className="flex h-9 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="/">
            Back
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
