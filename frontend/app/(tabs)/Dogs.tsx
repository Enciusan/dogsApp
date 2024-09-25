import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { supabase } from "../../utils/supa";
import { Session } from "@supabase/supabase-js";
import SwipeableCard from "../../components/SwipeableCard";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

export default function DogScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAccountInformationLoaded, setIsAccountInformationLoaded] = useState<boolean>(false);
  const [appUsers, setAppUsers] = useState<Array<Record<any, any>>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isWSConnected, setIsWSConnected] = useState<boolean>(false);
  const serveWSUrl = `ws://192.168.100.67:8080/ws?sessionId=39fba295-c9a3-41d8-be6b-191838057e3d`;
  const webSocket = useRef(null);
  // console.log("session", session);

  // TODO - connect multiple users.
  // const { data, error } = supabase.auth.signInWithPassword({

  // });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    // console.log("session", session.user.);
  }, []);

  useEffect(() => {
    getAllAccounts()
      .then((r) => r)
      .catch((e) => e);
  }, [session]);

  useEffect(() => {
    if (!webSocket.current) {
      webSocket.current = new WebSocket(serveWSUrl);

      webSocket.current.onopen = () => {
        console.log("WebSocket Connected");
        setIsWSConnected(true);
      };

      webSocket.current.onerror = (e) => {
        console.log("WebSocket Error: ", e);
      };

      webSocket.current.onclose = (e) => {
        console.log("WebSocket Disconnected: ", e.code, e.reason);
        setIsWSConnected(false);
      };
    }

    return () => {
      if (webSocket.current) {
        webSocket.current.close();
      }
    };
  }, [webSocket]);

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
            // console.log("Fetched accounts:", data);
            setAppUsers(data || []);
            setIsAccountInformationLoaded(true);
          }
        });
    }
  }, [session]);

  const handleSwipe = (direction: "left" | "right", user1Id?: string, user2Id?: string, username?: string) => {
    console.log(`Swiped ${direction} on ${appUsers[currentIndex].username}`);
    setCurrentIndex((prevIndex) => prevIndex + 1);
    if (direction === "right") {
      handleLike(user1Id, user2Id, username);
    }
  };

  const currentProfile = appUsers[currentIndex];

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (session) {
  //       const { data, error } = await supabase.auth.getUser();
  //       // Handle data and error as needed
  //       // console.log("Current profile", data);
  //     }
  //   };
  
  //   fetchUserData();
  // }, [session]);
  // console.log("Current profile", data);

  const handleLike = useCallback(
    (user1Id?: string, user2Id?: string, username?: string) => {
      console.group();
      console.log("ws", webSocket);
      console.log("session", session);
      console.log("currentProfile", currentProfile);
      console.groupEnd();
      if (webSocket) {
        const message = {
          type: "create_match",
          createMsg: {
            user1Id: user1Id,
            user2Id: user2Id,
            roomName: username,
          },
        };
        console.log("Sending message:", message);
        webSocket.current.send(JSON.stringify(message));
      }
    },
    [webSocket]
  );


  return (
    <SafeAreaView className="h-full bg-[#0E1514]">
      <View className="flex-1 items-center justify-center">
        {isAccountInformationLoaded && currentProfile ? (
          <SwipeableCard
            key={currentProfile.id}
            url={currentProfile.avatar_url}
            username={currentProfile.username}
            dogName={currentProfile.dog_name}
            onSwipe={handleSwipe}
          />
        ) : (
          <Text className="text-white">Loading profiles...</Text>
        )}
      </View>
      <View className="flex-row justify-center items-center gap-10 pb-40">
        <Pressable onPress={() => handleSwipe("left")}>
          <View className="w-16 h-16 rounded-full bg-[#263b44] flex justify-center items-center">
            <FontAwesome name="close" size={32} color="#f87171" />
          </View>
        </Pressable>
        <Pressable onPress={() => handleSwipe("right", session.user.id, currentProfile.id, `${session}-${currentProfile.username}`)}>
          <View className="w-16 h-16 rounded-full bg-[#263b44] flex justify-center items-center">
            <AntDesign name="heart" size={32} color="#34d399" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
