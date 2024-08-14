import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Image, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/supa";
import { Entypo, FontAwesome } from "@expo/vector-icons";

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from("avatars").download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 0,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from("avatars").upload(path, arraybuffer, {
        contentType: image.mimeType ?? "image/jpeg",
      });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View className="flex items-center justify-center ">
      {avatarUrl ? (
        <View className="!rounded-full !border-4 !border-white/20 p-0.5 !overflow-hidden">
          <Image source={{ uri: avatarUrl }} className="!rounded-full" style={[avatarSize, styles.image]} />
        </View>
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <View className="absolute bottom-28 right-[7rem] py-3">
        <Pressable
          onPress={uploadAvatar}
          disabled={uploading}
          className=" flex flex-row gap-1 border-2 border-[#0E1514] rounded-full">
          <View className="w-10 h-10 bg-[#1c2a28] flex justify-center items-center rounded-full ">
            {uploading ? (
              <Entypo name="dots-three-horizontal" size={16} color="white" />
            ) : (
              <FontAwesome name="pencil" size={16} color="white" />
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
  },
  image: {
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(255, 255, 255, 0.2)",
    borderRadius: 9999,
  },
});
