import { PropsWithChildren, useEffect, useState } from "react";
import { useAccountStore } from "./account";
import { supabase } from "../utils/supa";
import { Alert } from "react-native";
import { Session } from "@supabase/supabase-js";

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { accountInformation, isChanged, updateAccountInformation, updateIsChanged } = useAccountStore(
    (state) => state
  );

  const [session, setSession] = useState<Session | null>(null);

  // TODO: resolve the session error trigger
  const getProfile = async () => {
    try {
      updateIsChanged(true);
      if (!session?.user) {
        console.log("No user on the session! store");
        throw new Error("No user on the session!");
      }

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, dog_name, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        updateAccountInformation({ username: data.username, avatarUrl: data.avatar_url, dogName: data.dog_name });
        updateIsChanged(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      updateIsChanged(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    getProfile();
  }, []);

  return <>{children}</>;
};
