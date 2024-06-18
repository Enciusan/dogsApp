import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleStyle: { backgroundColor: "#1b1b1b", color: "#1b1b1b" },
        headerStyle: { backgroundColor: "#1b1b1b", height: "7%" },
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
            tint="systemThickMaterialDark"
          />
        ),
      }}>
      <Tabs.Screen
        name={"index"}
        options={{
          tabBarIcon: ({ color }) => <AntDesign size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name={"about"}
        options={{ tabBarIcon: ({ color }) => <AntDesign size={28} name="user" color={color} /> }}
      />
    </Tabs>
  );
}
