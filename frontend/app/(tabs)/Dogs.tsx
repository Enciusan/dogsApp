import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { supabase } from "../../utils/supa";
import { Session } from "@supabase/supabase-js";
import SwipeableCard from "../../components/SwipeableCard";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { extractSessionId } from "utils/function";

export default function DogScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAccountInformationLoaded, setIsAccountInformationLoaded] = useState<boolean>(false);
  const [appUsers, setAppUsers] = useState<Array<Record<any, any>>>([]);
  const [accountInfo, setAccountInfo] = useState<Record<any, any> | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isWSConnected, setIsWSConnected] = useState<boolean>(false);
  const serveWSUrl = `ws://192.168.100.67:8080/ws?sessionId=${sessionId}`;
  const webSocket = useRef(null);

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
  }, []);

  useEffect(() => {
    getAvailableProfiles();
    getCurrentAcountInformation()
      .then((r) => r)
      .catch((e) => console.error(e));
    console.log("Account info", appUsers);

    setSessionId(extractSessionId(session));
  }, [session]);

  useEffect(() => {
    if (!webSocket.current && sessionId !== null && sessionId !== undefined) {
      webSocket.current = new WebSocket(serveWSUrl);
      console.log("WebSocket URL:", serveWSUrl);

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
  }, [webSocket, sessionId]);

  const getCurrentAcountInformation = useCallback(async () => {
    if (session) {
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .then(({ data, error }) => {
          if (error) {
            console.error("error fetching", error);
          } else {
            // console.log("Fetched account:", user);

            setAccountInfo(data);
          }
        });
    }
  }, [session]);

  const getAvailableProfiles = useCallback(async () => {
    setIsAccountInformationLoaded(false);
    if (session) {
      try {
        // Fetch liked user IDs
        const { data: likeData, error: likeError } = await supabase
          .from("likes")
          .select("liked_user_id")
          .eq("user_id", session.user.id);

        if (likeError) throw likeError;

        // Extract liked user IDs and format them for the 'not in' clause
        const likedUserIds = likeData.map((item) => item.liked_user_id);
        const formattedLikedUserIds = likedUserIds.length > 0 ? `(${likedUserIds.join(",")})` : "(null)";
        console.log("Formatted liked user IDs:", formattedLikedUserIds);

        // Fetch available profiles
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .not("id", "in", formattedLikedUserIds)
          .not("id", "eq", session.user.id);

        if (profileError) throw profileError;

        console.log("Fetched accounts:", profiles);
        setAppUsers(profiles || []);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setIsAccountInformationLoaded(true);
      }
    }
  }, [session, appUsers]);

  const handleSwipe = (direction: "left" | "right", user2Id?: string, roomName?: string) => {
    console.log(`Swiped ${direction} on ${appUsers[currentIndex].username}`);
    setCurrentIndex((prevIndex) => prevIndex + 1);
    if (direction === "right") {
      handleLike(user2Id, roomName);
    }
  };

  const currentProfile = appUsers[currentIndex];

  const handleLike = useCallback(
    (user2Id?: string, roomName?: string) => {
      if (webSocket) {
        const message = {
          type: "like_person",
          content: {
            likedUserId: user2Id,
            roomName: roomName,
            action: "like",
          },
        };
        console.log("Sending message:", JSON.stringify(message));
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
        <Pressable
          onPress={() => handleSwipe("right", currentProfile.id, `${accountInfo.dog_name}-${currentProfile.dog_name}`)}>
          <View className="w-16 h-16 rounded-full bg-[#263b44] flex justify-center items-center">
            <AntDesign name="heart" size={32} color="#34d399" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
