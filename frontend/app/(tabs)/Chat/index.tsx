import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { supabase } from "../../../utils/supa";
import { Session } from "@supabase/supabase-js";
import { getRooms } from "../../../utils/function";
import WebSocketComponent from "../../../components/WebSocketConnect";

export default function ChatScreen() {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  // console.log("linia 21", sessionId);

  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // console.log(session?.user.id);

  const getRoomsFromAPI = async () => {
    if (session) {
      const getRoomsApi = await getRooms(session);
      // console.log(getRoomsApi);
      setRooms(getRoomsApi);
    }
  };

  useEffect(() => {
    getRoomsFromAPI();
  }, [session]);

  const joinRoom = (roomId) => {
    router.push(`/chat/${roomId}`);
  };

  const createRoom = async () => {
    if (newRoomName.trim()) {
      // Replace this with your actual API call to create a new room
      const newRoom = { id: Date.now().toString(), name: newRoomName.trim() };
      setRooms([...rooms, newRoom]);
      setNewRoomName("");
    }
  };

  const renderRoom = ({ item }) => (
    <TouchableOpacity className="p-4 border-b border-gray-200" onPress={() => joinRoom(item.id)}>
      <Text className="text-lg text-slate-300">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="h-screen bg-[#0E1514]" style={{ paddingBottom: bottomTabBarHeight }}>
      <SafeAreaView className="bg-[#0E1514]">
        <FlatList data={rooms} renderItem={renderRoom} keyExtractor={(item) => item.id} />
        <View className="p-4 border-t border-gray-200">
          <TextInput
            className="border border-gray-300 rounded-md p-2 mb-2"
            value={newRoomName}
            onChangeText={setNewRoomName}
            placeholder="New room name"
          />
          <TouchableOpacity className="bg-blue-500 p-3 rounded-md" onPress={createRoom}>
            <Text className="!text-slate-300 text-center font-bold">Create New Room</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-slate-300">{sessionId}</Text>
        <WebSocketComponent
          userId={session?.user.id}
          sessionId={"1c7856bd-4ee9-40dd-aac3-a27849030430"}
          roomId={"fff875f7-4072-4967-9fa5-f026d1d94332"}
        />
      </SafeAreaView>
    </View>
  );
}
