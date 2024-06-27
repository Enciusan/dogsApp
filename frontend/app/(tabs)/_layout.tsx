import { Tabs } from "expo-router";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#6ee7b7",
        headerTitleStyle: { backgroundColor: "#0E1514", color: "#0E1514" },
        headerStyle: { backgroundColor: "#0E1514", height: "7%" },
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          borderTopStartRadius: 20,
          borderTopEndRadius: 20,
          borderTopColor: "transparent",
        },
        tabBarBackground: () => (
          <BlurView
            style={{ flex: 1, overflow: "hidden", backgroundColor: "transparent" }}
            intensity={40}
            tint="prominent"
          />
        ),
      }}>
      <Tabs.Screen
        name={"index"}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name={"account"}
        options={{ tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} /> }}
      />
    </Tabs>
  );
}
