import { Figtree_500Medium, useFonts } from "@expo-google-fonts/figtree";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Text, View } from "react-native";

export default function CustomText(props) {
  let [fontsLoaded] = useFonts({
    "Figtree_Medium": Figtree_500Medium,
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
      <Text style={{ fontFamily: "Figtree_Medium" }} className={props.className}>
        {props.children}
      </Text>
    </View>
  );
}
