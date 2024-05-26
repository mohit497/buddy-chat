import { useEffect, useRef } from "react";
import { useSupabase } from "@/context/supabaseProvider";
import { useChat } from "@/context/chatProvider";

export const useUpdateLastSeen = () => {
  const { client } = useSupabase();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { currentChat, setChats } = useChat();

  useEffect(() => {
    // Function to update last_seen
    const updateLastSeen = async () => {
      if (currentChat) {
        await client
          .from("chat_participants")
          .update({ last_seen: new Date() })
          .eq("chat_id", currentChat.id);

        // Update the last_seen in the chats state as well
        setChats((prevChats) => {
          if (!prevChats) return prevChats;
          return prevChats.map((chat) => {
            if (chat.id === currentChat.id) {
              return { ...chat, last_seen: new Date() };
            }
            return chat;
          });
        });
      }
    };

    // Update last_seen immediately when chat changes
    updateLastSeen();

    intervalRef.current = setInterval(updateLastSeen, 30000);

    // Clean up the interval when the component is unmounted or the chat changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [client, currentChat, setChats]);
};
