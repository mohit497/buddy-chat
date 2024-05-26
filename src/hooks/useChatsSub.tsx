import { useAuth } from "@/context/authProvider";
import { useSupabase } from "@/context/supabaseProvider";
import { useEffect } from "react";

export const useChatSub = (handleInserts: (payload: any) => void) => {
  const { client } = useSupabase();
  const { user } = useAuth();
  useEffect(() => {
    let sub;
    // Subscribe to new chats
    sub = client
      .channel("supabase_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_participants",
          filter: `user_id=eq${user?.id}` 
        },
        handleInserts
      )
      .subscribe();

    // Clean up the subscription when the component is unmounted
    return () => {
      sub && sub.unsubscribe();
    };
  }, [client, handleInserts]);
};
