import { Button, Pressable, View } from "react-native";
import { Link } from "expo-router";
import React from "react";
import HeaderText from "../components/HeaderText";
import { CustomText } from "../components/CustomText";

export default function LandingPage() {
  return (
    <View className="h-screen bg-[#0E1514] flex justify-end items-center pb-40 gap-4">
      <HeaderText className="text-4xl text-slate-300">Welcome to DogsApp</HeaderText>

      <View className="gap-4">
        <Link
          asChild
          className="flex items-center justify-center overflow-hidden rounded-full min-w-80 py-2 text-sm font-medium text-gray-50 web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          href="/(landing)/createaccount">
          <Pressable>
            <CustomText type={"bold"} className="text-lg">
              Create account
            </CustomText>
          </Pressable>
        </Link>

        <Link
          asChild
          className="flex items-center justify-center overflow-hidden rounded-full min-w-80 py-2 text-sm font-medium text-gray-50 web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          href="/(landing)/signin">
          <Pressable>
            <CustomText type={"bold"} className="text-lg">
              Sign in
            </CustomText>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
