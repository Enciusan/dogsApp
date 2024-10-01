import { Session } from "@supabase/supabase-js";
import { supabase } from "./supa";
import { Alert } from "react-native";
import { useEffect, useState } from "react";

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

export const getRooms = async (session: Session) => {
  try {
    if (!session?.user) {
      console.log("No user on the session!");
      throw new Error("No user on the session!");
    }

    const { data, error, status } = await supabase.from("rooms").select(`id, name`).eq("created_by", session?.user.id);
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

export const extractSessionId = (session: Session | null): string | undefined => {
  if (session?.access_token) {
    try {
      const sessionTokenParts = session.access_token.split(".");
      if (sessionTokenParts.length >= 2) {
        const payload = sessionTokenParts[1];
        const decodedPayload = atob(payload);
        const token = JSON.parse(decodedPayload);
        
        return token.session_id;
      }
    } catch {
      return;
    }
  }
  return;
};
