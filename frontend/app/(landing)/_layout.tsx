import { Stack } from "expo-router";

export default function LandingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleStyle: { color: "#1b1b1b" },
        headerStyle: { backgroundColor: "#1b1b1b" },
      }}
    />
  );
}
