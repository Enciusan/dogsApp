import {
  Figtree_300Light,
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  useFonts,
} from "@expo-google-fonts/figtree";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Text, TextProps, StyleSheet, View } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "light" | "medium" | "semiBold" | "bold";
};

export function CustomText({ style, type = "default", ...rest }: ThemedTextProps) {
  let [fontsLoaded] = useFonts({
    "Figtree_Light": Figtree_300Light,
    "Figtree_Normal": Figtree_400Regular,
    "Figtree_Medium": Figtree_500Medium,
    "Figtree_Semibold": Figtree_600SemiBold,
    "Figtree_Bold": Figtree_700Bold,
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
    <Text
      style={[
        type === "default" ? styles.default : undefined,
        type === "light" ? styles.light : undefined,
        type === "medium" ? styles.medium : undefined,
        type === "semiBold" ? styles.semiBold : undefined,
        type === "bold" ? styles.bold : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "Figtree_Normal",
  },
  light: {
    fontFamily: "Figtree_Light",
  },
  medium: {
    fontFamily: "Figtree_Medium",
  },
  semiBold: {
    fontFamily: "Figtree_Semibold",
  },
  bold: {
    fontFamily: "Figtree_Bold",
  },
});
