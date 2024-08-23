import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useAccountStore } from "../../store/account";
import { getProfile } from "../../utils/function";
import { supabase } from "../../utils/supa";
import { Session } from "@supabase/supabase-js";

export default function DogScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { accountInformation, updateAccountInformation } = useAccountStore((state) => state);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    (async () => {
      if (session) {
        const userProfile = await getProfile(session);
        updateAccountInformation({
          username: userProfile.username,
          avatarUrl: userProfile.avatar_url,
          dogName: userProfile.dog_name,
        });
        console.log(userProfile);
      }
      if (accountInformation.avatarUrl) {
        downloadImage(accountInformation.avatarUrl);
      }
    })();
  }, []);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from("avatars").download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  return (
    <View className="h-screen bg-[#0E1514]" style={{ paddingBottom: bottomTabBarHeight }}>
      <ScrollView horizontal={false}>
        <View className="h-28"></View>
        <View className="flex justify-center items-center w-full">
          <View className="h-[500px] w-3/4 border-2 rounded-xl border-slate-500">
            {accountInformation ? (
              <Image source={{ uri: avatarUrl }} style={{ width: "100%", height: 497 }} className="rounded-xl" />
            ) : (
              <Text className="text-rose-400 text-lg">Loading...</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
