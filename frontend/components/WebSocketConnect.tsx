import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";

const WebSocketComponent = ({ sessionId, roomId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const serveWSUrl = `ws://192.168.100.67:8080/ws?sessionId=${sessionId}`;
  const webSocket = useRef(null);

  useEffect(() => {
    if (!webSocket.current) {
      webSocket.current = new WebSocket(serveWSUrl);

      webSocket.current.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnected(true);
      };

      webSocket.current.onmessage = (e) => {
        const message = JSON.parse(e.data);
        console.log("Received message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      webSocket.current.onerror = (e) => {
        console.log("WebSocket Error: ", e);
      };

      webSocket.current.onclose = (e) => {
        console.log("WebSocket Disconnected: ", e.code, e.reason);
        setIsConnected(false);
      };
    }

    return () => {
      if (webSocket.current) {
        webSocket.current.close();
      }
    };
  }, [serveWSUrl]);

  const sendMessage = useCallback(() => {
    console.group();
    console.log("inputMessage", inputMessage);
    console.log("isConnected", isConnected);
    console.log("ws", webSocket);
    console.groupEnd();
    if (inputMessage && isConnected && webSocket) {
      const message = {
        type: "chat",
        content: inputMessage,
        roomId: roomId,
        sessionId: sessionId,
      };
      console.log("Sending message:", message);
      webSocket.current.send(JSON.stringify(message));
      setInputMessage("");
    }
  }, [inputMessage, isConnected, webSocket]);

  return (
    <View>
      <Text className="text-slate-300">{isConnected ? "Connected" : "Disconnected"}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text className="text-slate-300">{item.type === "chat" ? `${item.content}` : `System: ${item.content}`}</Text>
        )}
      />
      <TextInput
        value={inputMessage}
        onChangeText={setInputMessage}
        placeholder="Type a message..."
        className="!text-slate-300"
      />
      <Button title="Send" onPress={() => sendMessage()} disabled={!isConnected} />
    </View>
  );
};

export default WebSocketComponent;
