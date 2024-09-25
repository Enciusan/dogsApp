import { useEffect, useState } from "react";
import { supabase } from "./supa";

export function useDownloadImage(path: string | null) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function downloadImage() {
      if (!path) {
        setAvatarUrl(null);
        return;
      }

      setIsLoading(true);
      setError(null);

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
      } catch (e) {
        setError(e instanceof Error ? e : new Error("An unknown error occurred"));
        console.log("Error downloading image: ", e);
      } finally {
        setIsLoading(false);
      }
    }

    downloadImage();
  }, [path]);

  return { avatarUrl, isLoading, error };
}
