import { Link, Stack, Tabs } from "expo-router";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CustomText } from "../../components/CustomText";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabLayout() {
  return (
    <GestureHandlerRootView>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#6ee7b7",
          headerTitleStyle: { backgroundColor: "#0E1514", color: "white", fontFamily: "GreatMango", fontSize: 24 },
          headerTitleAlign: "left",
          headerStyle: { backgroundColor: "#0E1514", shadowColor: "transparent" },
          // headerTitle: () => <HeaderText className="text-slate-300 text-5xl "></HeaderText>,
          // tabBarShowLabel: false,
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
          name={"Account"}
          options={{
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
            headerRight: () => (
              <Link href={"/Settings"}>
                <FontAwesome5 name="cog" size={24} color="white" />
              </Link>
            ),
            headerRightContainerStyle: { paddingRight: 20 },
          }}
        />
        <Tabs.Screen
          name={"Dogs"}
          options={{
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="dog" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name={"Chat"}
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="chatbubble" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name={"EditProfile"}
          options={{
            href: null,
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
            headerRight: () => (
              <Link href={"/Account"}>
                <CustomText className="text-slate-100 text-lg">Done</CustomText>
              </Link>
            ),
            headerRightContainerStyle: { paddingRight: 20 },
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
