import { View } from "react-native";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supa";
import LandingPage from "./(landing)";
import Toast from "react-native-toast-message";

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session && session.user) {
    return (
      <>
        <Redirect href={"(tabs)/Dogs"} />
        <Toast />
      </>
    );
  } else {
    return (
      <View className="h-screen bg-[#0E1514] flex justify-end items-center pb-40 gap-4">
        <LandingPage />
        <Toast />
      </View>
    );
  }
}
