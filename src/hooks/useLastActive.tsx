import UserAPI from "@/app/api/userApi";
import { useSupabase } from "@/context/supabaseProvider";
import { useEffect } from "react";

export default function useLastActive(userId: string | undefined) {
  const { client } = useSupabase();

  useEffect(() => {
    const userAPI = new UserAPI(client);
    if (!userId) return;

    const intervalId = setInterval(async () => {
      await userAPI.updateLastActive(userId);
    }, 60 * 1000); // Update every minute

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
}
