import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { useAccountStore } from "../../store/account";
import { getProfile } from "../../utils/function";
import { supabase } from "../../utils/supa";
import { Session } from "@supabase/supabase-js";
import SwipeableCard from "../../components/SwipeableCard";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { UserType } from "../../types/account";

export default function DogScreen() {
  const [session, setSession] = useState<Session | null>(null);
  // const { accountInformation, updateAccountInformation } = useAccountStore((state) => state);
  const [isAccountInformationLoaded, setIsAccountInformationLoaded] = useState<boolean>(false);
  const [dislikePressed, setDislikePressed] = useState<boolean>(false);
  const [likePressed, setLikePressed] = useState<boolean>(false);
  const [appUsers, setAppUsers] = useState<Array<Record<any, any>>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    getAllAccounts()
      .then((r) => r)
      .catch((e) => e);
  }, [session]);

  const handleDislikePressed = () => {
    setDislikePressed(true);
  };

  const handleLikePressed = () => {
    setLikePressed(true);
  };

  const getAllAccounts = useCallback(async () => {
    setIsAccountInformationLoaded(false);
    if (session) {
      await supabase
        .from("profiles")
        .select("*")
        .neq("id", session?.user?.id)
        .then(({ data, error }) => {
          if (error) {
            console.error("error fetching", error);
          } else {
            console.log("Fetched accounts:", data);
            setAppUsers(data);
            setIsAccountInformationLoaded(true);
          }
        });
    }
  }, [session]);

  return (
    <SafeAreaView className="h-screen bg-[#0E1514]">
      <View className="h-20"></View>
      {isAccountInformationLoaded && (
        <>
          {appUsers &&
            appUsers.map((user, id) => {
              return (
                <Fragment key={id}>
                  <SwipeableCard
                    url={user.avatar_url}
                    dislikePressed={dislikePressed}
                    likePressed={likePressed}
                    setLikePressed={setLikePressed}
                    setDislikePressed={setDislikePressed}
                    username={user.username}
                    dogName={user.dog_name}
                  />
                </Fragment>
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
