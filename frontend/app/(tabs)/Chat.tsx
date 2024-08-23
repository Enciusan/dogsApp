import React, { useEffect, useRef } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { SocketMessage } from "../../types/socket";

export default function ChatScreen() {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const [serverState, setServerState] = React.useState<string>("Loading...");
  const [inputText, setInputText] = React.useState<string>("");
  const [messageText, setMessageText] = React.useState<SocketMessage>({ usernameID: "", content: "", chatRoomID: 0 });
  const [serverMessages, setServerMessages] = React.useState([]);
  const ws = useRef(new WebSocket("ws://192.168.100.21:8080/ws")).current;

  useEffect(() => {
    ws.onopen = (e) => {
      console.log("Connected to the server", e);
      setServerState("Connected to the server");
    };
    ws.onmessage = (e) => {
      const serverMessagesList: Array<string> = JSON.parse(e.data);
      // serverMessagesList.push(JSON.parse(e.data));
      setServerMessages((prevmsg) => [...prevmsg, serverMessagesList]);
    };
    ws.onclose = (e) => {
      console.log("Close the server", e);
      setServerState("Disconnected. Check internet or server.");
    };
    ws.onerror = (e) => {
      console.log("Error to the server");
      setServerState("Error: " + e);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && inputText.trim() !== "") {
      try {
        const message = {
          userId: "2236c152-f3e3-495b-ae2b-c771cfa0f7ec",
          content: inputText,
          chatRoomId: 1,
        };
        console.log("Sending message:", message);
        ws.send(JSON.stringify(message));
        setInputText("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.warn("WebSocket not connected or ready.");
    }
  };

  return (
    <View className="h-screen bg-[#0E1514]" style={{ paddingBottom: bottomTabBarHeight }}>
      <ScrollView horizontal={false}>
        <View className="flex h-screen justify-center items-center w-full">
          <Text className="text-slate-300">{serverState}</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "teal",
              padding: 5,
            }}
            className="text-slate-300 h-20 rounded-xl"
            placeholder={"Add Message"}
            onChangeText={setInputText}
            value={inputText}
          />
          <Button onPress={sendMessage} title={"Submit"} />
        </View>
      </ScrollView>
    </View>
  );
}
