import { Text, View } from "react-native";
import { Figtree_400Regular, Figtree_500Medium, useFonts } from "@expo-google-fonts/figtree";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";

export default function HeaderText(props) {
  let [fontsLoaded] = useFonts({
    Figtree_500Medium,
    "GreatMango": require("../assets/fonts/GreatMango.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View onLayout={onLayoutRootView}>
      <Text style={{ fontFamily: "GreatMango", fontSize: 28 }} className={props.className}>
        {props.children}
      </Text>
    </View>
  );
}
