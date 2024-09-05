import React, { useState } from "react";
import { Alert, AppState, Pressable, View } from "react-native";
import { Input } from "@rneui/themed";
import { supabase } from "../../utils/supa";
import { useRouter } from "expo-router";
import { CustomText } from "../../components/CustomText";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace("/(tabs)/Dogs");
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View className="bg-[#0E1514] justify-center p-10 h-screen text-slate-300">
      <View className="py-2 mt-10">
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope", color: "white" }}
          className="!text-slate-300"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View className="py-2">
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock", color: "white" }}
          className="!text-slate-300"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View className="flex gap-5">
        <View className="flex justify-center items-center bg-gray-50 py-2 overflow-hidden rounded-xl">
          <Pressable onPress={() => signInWithEmail()} disabled={loading}>
            <CustomText type={"bold"} className="text-lg w-screen text-center">
              Sign in
            </CustomText>
          </Pressable>
        </View>
        <View className="flex justify-center items-center bg-gray-50 py-2 overflow-hidden rounded-xl">
          <Pressable onPress={() => signUpWithEmail()} disabled={loading}>
            <CustomText type={"bold"} className="text-lg w-screen text-center">
              Sign up
            </CustomText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
