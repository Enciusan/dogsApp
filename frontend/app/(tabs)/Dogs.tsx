import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useAccountStore } from "../../store/account";
import { getProfile } from "../../utils/function";
import { supabase } from "../../utils/supa";
import { Session } from "@supabase/supabase-js";
import SwipeableCard from "../../components/SwipeableCard";

export default function DogScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const { accountInformation, updateAccountInformation } = useAccountStore((state) => state);
  const [isAccountInformationLoaded, setIsAccountInformationLoaded] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (session) {
        const userProfile = await getProfile(session);
        updateAccountInformation({
          username: userProfile.username,
          avatarUrl: userProfile.avatar_url,
          dogName: userProfile.dog_name,
        });
      }
    })();
  }, [session]);

  useEffect(() => {
    handleAccountInformation();
  }, [accountInformation.avatarUrl]);

  const handleAccountInformation = () => {
    if (
      accountInformation.avatarUrl === "" ||
      accountInformation.dogName === "" ||
      accountInformation.username === ""
    ) {
      setIsAccountInformationLoaded(false);
    } else {
      setIsAccountInformationLoaded(true);
    }
  };

  // console.log("Dogs", accountInformation);
  return (
    <SafeAreaView className="h-screen bg-[#0E1514]">
      <View className="h-28"></View>
      {isAccountInformationLoaded && <SwipeableCard url={accountInformation.avatarUrl} />}
    </SafeAreaView>
  );
}
