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
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
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
        <View className="py-2">
          <Input
            label="Email"
            value={session?.user?.email}
            disabled
            leftIcon={{ type: "font-awesome", name: "envelope", color: "white", size: 18 }}
            className="!text-slate-300"
          />
        </View>
        <View className="py-2">
          <Input
            label="Username"
            leftIcon={{ type: "font-awesome", name: "user", color: "white", size: 18 }}
            className="!text-slate-300"
            value={username || ""}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View className="py-2">
          <Input
            label="Website"
            leftIcon={{ type: "font-awesome", name: "globe", color: "white", size: 18 }}
            className="!text-slate-300"
            value={website || ""}
            onChangeText={(text) => setWebsite(text)}
          />
        </View>
        <View className="flex gap-5 mb-6">
          <View className="flex justify-center items-center bg-gray-50 py-2 overflow-hidden rounded-xl">
            <Pressable onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })} disabled={loading}>
              <CustomText type={"bold"} className="text-lg w-screen text-center">
                {loading ? "Loading ..." : "Update"}
              </CustomText>
            </Pressable>
          </View>
        </View>
        <View className="flex gap-5">
          <Avatar
            size={150}
            url={avatarUrl}
            onUpload={(url: string) => {
              setAvatarUrl(url);
              updateProfile({ username, website, avatar_url: url });
            }}
          />
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
