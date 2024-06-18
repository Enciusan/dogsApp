import React from "react";
import { ScrollView, View } from "react-native";
import CustomText from "../../components/CustomText";

export default function SignIn() {
  return (
    <View className="h-screen bg-[#1b1b1b]">
      <ScrollView horizontal={false}>
        <View className="flex h-screen justify-center items-center w-full">
          <CustomText className="text-xl text-slate-300">Here will be sign in</CustomText>
        </View>
      </ScrollView>
    </View>
  );
}
