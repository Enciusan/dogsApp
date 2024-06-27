import "../global.css";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        gestureEnabled: false,
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="(landing)"
        options={{
          headerBackTitleVisible: false,
          headerLeft: () => {
            return (
              <Pressable onPress={() => router.back()}>
                <FontAwesome5 name="chevron-left" size={24} color="white" />
              </Pressable>
            );
          },
          headerStyle: { backgroundColor: "#0E1514" },
          headerTitleStyle: { color: "transparent" },
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
