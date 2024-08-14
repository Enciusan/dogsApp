import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supa";
import { useRouter } from "expo-router";
import { CustomText } from "./CustomText";
import Avatar from "./Avatar";
import { useAccountStore } from "../store/account";
import Toast from "react-native-toast-message";

export default function Account({ session }: { session: Session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { accountInformation, updateAccountInformation } = useAccountStore((state) => state);

  const successToastShow = () => {
    Toast.show({
      type: "success",
      text1: "Profile Image Updated",
      text2: "Your profile image was successfully updated.",
      position: "top",
      visibilityTime: 3000,
    });
  };

  const failToastShow = () => {
    Toast.show({
      type: "error",
      text1: "Error on Profile Image Update",
      text2: "There was an error updating your profile image. Please try again.",
      position: "top",
      visibilityTime: 3000,
    });
  };

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`avatar_url, dog_name, username`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        updateAccountInformation({ username: data.username, avatarUrl: data.avatar_url, dogName: data.dog_name });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ avatar_url }: { avatar_url: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        failToastShow();
        throw error;
      } else {
        successToastShow();
        updateAccountInformation({ ...accountInformation, avatarUrl: avatar_url });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="bg-[#0E1514] justify-center p-10 h-screen text-slate-300">
      <ScrollView horizontal={false}>
        <View className="flex gap-5">
          <Avatar
            size={150}
            url={accountInformation.avatarUrl}
            onUpload={(url: string) => {
              updateProfile({ avatar_url: url });
            }}
          />
        </View>
        <View className="flex gap-5 justify-center items-center mt-3">
          <CustomText type={"bold"} className="text-lg text-center !text-slate-200">
            {accountInformation.dogName}
          </CustomText>
        </View>
        <View className="flex gap-5 justify-center items-center mt-3">
          <View className="bg-slate-100 rounded-full w-2/4">
            <Pressable onPress={() => router.navigate("/EditProfile")} disabled={loading}>
              <CustomText type={"bold"} className="text-lg text-center">
                Edit Profile
              </CustomText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
}
