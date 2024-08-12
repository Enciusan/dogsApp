import { Alert, Pressable, ScrollView, View } from "react-native";
import { Input } from "@rneui/themed";
import { CustomText } from "../../components/CustomText";
import React, { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../utils/supa";
import Toast from "react-native-toast-message";

export default function EditProfile() {
  const [session, setSession] = useState<Session | null>(null);

  const successToastShow = () => {
    Toast.show({
      type: "success",
      text1: "Profile Updated",
      text2: "Your profile was successfully updated.",
      position: "top",
      visibilityTime: 3000,
    });
  };

  const failToastShow = () => {
    Toast.show({
      type: "error",
      text1: "Error on Profile Update",
      text2: "There was an error updating your profile. Please try again.",
      position: "top",
      visibilityTime: 3000,
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
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
        .select(`username, dog_name`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
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

  async function updateProfile({ username, dog_name }: { username: string; dog_name: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        dog_name,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        failToastShow();
        throw error;
      } else {
        successToastShow();
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
    <View className="bg-[#0E1514] justify-center p-5 h-screen text-slate-300">
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
            autoComplete={"given-name"}
            leftIcon={{ type: "font-awesome", name: "user", color: "white", size: 18 }}
            className="!text-slate-300"
            value={username || ""}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View className="py-2">
          <Input
            label="Dog's Name"
            leftIcon={{ type: "font-awesome-5", name: "dog", color: "white", size: 18 }}
            className="!text-slate-300"
            value={dogName || ""}
            onChangeText={(text) => setDogName(text)}
          />
        </View>
        <View className="flex gap-5 mb-6">
          <Pressable onPress={() => updateProfile({ username, dog_name: dogName })} disabled={loading}>
            <View className="flex justify-center items-center bg-gray-50 py-2 overflow-hidden rounded-xl">
              <CustomText type={"bold"} className="text-lg w-screen text-center">
                {loading ? "Loading ..." : "Update"}
              </CustomText>
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
}
