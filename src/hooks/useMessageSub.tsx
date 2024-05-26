import { useEffect } from "react";
import { useSupabase } from "@/context/supabaseProvider";

export const useMessageSub = (
  chatId: string | undefined,
  handleInserts: (payload: any) => void
) => {
  const { client } = useSupabase();
  console.log('chat Id', chatId)
  useEffect(() => {
    let sub;
    // Subscribe to new messages in the current chat
    sub =
      client
        .channel("supabase_realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chatId=eq.${chatId}`,
          },
          handleInserts
        )
        .subscribe();

    // Clean up the subscription when the component is unmounted or the chat changes
    return () => {
      sub && sub.unsubscribe();
    };
  }, [client, chatId, handleInserts]);
};
