import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { supabase } from "../utils/supa";
import { CustomText } from "../components/CustomText";
import { useRouter } from "expo-router";

export default function Settings() {
  const router = useRouter();
  return (
    <View className="h-screen bg-[#0E1514]">
      <ScrollView horizontal={false}>
        <View className="flex h-[70vh] justify-end items-center w-full">
          <View className="flex justify-end items-end bg-gray-50 py-2 overflow-hidden rounded-3xl">
            <Pressable
              onPress={() => {
                supabase.auth.signOut();
                router.push("/");
              }}>
              <CustomText type={"bold"} className="flex text-lg w-[90vw] text-center items-center justify-center">
                Sign Out
              </CustomText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
