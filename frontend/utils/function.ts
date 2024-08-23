import { Session } from "@supabase/supabase-js";
import { supabase } from "./supa";
import { Alert } from "react-native";

export const getProfile = async (session: Session) => {
  try {
    if (!session?.user) {
      console.log("No user on the session!");
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
      return data;
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  }
};
