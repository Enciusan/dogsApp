import React from "react";
import { ScrollView, View } from "react-native";
import { CustomText } from "../../components/CustomText";

export default function LandingPage() {
  return (
    <View className="h-svh bg-[#0E1514]">
      <ScrollView horizontal={false}>
        <View className="h-screen flex justify-center items-center ">
          <CustomText className="text-xl text-slate-300">Here will be create account</CustomText>
        </View>
      </ScrollView>
    </View>
  );
}
