import React, { useEffect, useState } from "react";
import { Alert, Button, Pressable, ScrollView, View } from "react-native";
import { Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supa";
import { useRouter } from "expo-router";
import { CustomText } from "./CustomText";
import Avatar from "./Avatar";

export default function Account({ session }: { session: Session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [dogName, setDogName] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`avatar_url, dog_name`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setAvatarUrl(data.avatar_url);
        setDogName(data.dog_name);
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
        throw error;
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
            url={avatarUrl}
            onUpload={(url: string) => {
              setAvatarUrl(url);
              updateProfile({ avatar_url: url });
            }}
          />
        </View>
        <View className="flex gap-5 justify-center items-center mt-3">
          <CustomText type={"bold"} className="text-lg text-center text-slate-200">
            {dogName}
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
    </View>
  );
}
