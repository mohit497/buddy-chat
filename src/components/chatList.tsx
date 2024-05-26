import ChatsAPI from "@/app/api/chatsApi";
import { useChat } from "@/context/chatProvider";
import { useSupabase } from "@/context/supabaseProvider";
import { useChatSub } from "@/hooks/useChatsSub";
import { Chat } from "@/types";
import React from "react";
import { List, Image } from "semantic-ui-react";

interface ChatListProps {
  chats: Chat[] | null;
}

const ChatList: React.FC<ChatListProps> = (props) => {
  const { chats } = props;
  const { setCurrentChat } = useChat(); 

  const handleChatClick = (chat: Chat) => {
    console.log(chat);
    setCurrentChat(chat); // Set the current chat when a chat item is clicked
  };



  return (
    <List divided relaxed>
      {chats &&
        chats.map((chat) => (
          <List.Item
            className="border"
            key={chat.id}
            style={{ padding: "10px" }}
            onClick={() => handleChatClick(chat)}
          >
            <Image avatar src={chat.avatar} alt={chat.name}   />
            <List.Content>
              <List.Header>{chat.name}</List.Header>
              <List.Description>{chat.last_message}</List.Description>
            </List.Content>
          </List.Item>
        ))}
    </List>
  );
};

export default ChatList;
