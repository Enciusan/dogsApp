import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, View } from "react-native";
import { useAccountStore } from "../../store/account";
import { getProfile } from "../../utils/function";
import { supabase } from "../../utils/supa";
import { Session } from "@supabase/supabase-js";
import SwipeableCard from "../../components/SwipeableCard";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { UserType } from "../../types/account";

export default function DogScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const { accountInformation, updateAccountInformation } = useAccountStore((state) => state);
  const [isAccountInformationLoaded, setIsAccountInformationLoaded] = useState<boolean>(false);
  const [dislikePressed, setDislikePressed] = useState<boolean>(false);
  const [likePressed, setLikePressed] = useState<boolean>(false);
  const [appUsers, setAppUsers] = useState<Array<Record<any, UserType>>>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    getAllAccounts();
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
      console.log("App Users", appUsers);
    })();
  }, [session]);

  useEffect(() => {
    handleAccountInformation();
  }, [accountInformation.avatarUrl]);

  const handleDislikePressed = () => {
    setDislikePressed(true);
  };

  const handleLikePressed = () => {
    setLikePressed(true);
  };

  const getAllAccounts = () => {
    console.log("Session", session?.user?.id);
    supabase
      .from("profiles")
      .select("*")
      .neq("id", session?.user?.id)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Data", data);
          setAppUsers(data);
        }
      });
  };

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
      {isAccountInformationLoaded && (
        <>
          {appUsers.map((user) => {
            return (
              <SwipeableCard
                url={user.avatar_url}
                dislikePressed={dislikePressed}
                likePressed={likePressed}
                setLikePressed={setLikePressed}
                setDislikePressed={setDislikePressed}
                username={user.username}
                dogName={user.dog_name}
              />
            );
          })}
        </>
      )}
      <View className="flex flex-row justify-center items-center gap-10 pt-10">
        <Pressable onPress={() => handleDislikePressed()}>
          <View className="w-20 h-20 rounded-full bg-[#263b44] flex justify-center items-center">
            <FontAwesome name="close" size={40} className="!text-rose-400 " />
          </View>
        </Pressable>
        <Pressable onPress={() => handleLikePressed()}>
          <View className="w-20 h-20 rounded-full bg-[#263b44] flex justify-center items-center">
            <AntDesign name="heart" size={40} className="!text-emerald-400 pt-1" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
