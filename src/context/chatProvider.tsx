"use client";
import { Chat, User, ChatParticipants } from "@/types";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import { useSupabase } from "./supabaseProvider";
import ChatsAPI from "@/app/api/chatsApi";

interface ChatContextData {
  chats: Chat[] | null;
  currentChat: Chat | null;
  openChat: (chatId: string) => void;
  addChat: (chat: User) => Promise<void>;
  removeChat: (chatId: string) => void;
  setCurrentChat: (chat: Chat) => void;
  participants: User[] | null;
}

const ChatContext = createContext<ChatContextData | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<Chat[] | null>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [participants, setParticiapants] = useState<User[] | null>(null);

  const chatsAPIRef = useRef<ChatsAPI | null>(null);
  const { client } = useSupabase();

  useEffect(() => {
    const chatsAPI = new ChatsAPI(client);

    const fetchChats = async () => {
      try {
        const chats = await chatsAPI.getChats();
        setChats(chats);
      } catch (error) {
        console.log("Error fetching chats", error);
      }
    };

    fetchChats();
  }, [client]);

  const openChat = (chatId: string) => {
    const chat = chats?.find((chat) => chat.id === chatId);
    setCurrentChat(chat || null);
  };

  const addChat = async (chat: User) => {
    try {
      const newChat = await chatsAPIRef.current?.createChat([chat]);
    } catch (error) {
      console.log("Error adding chat", error);
    }
  };

  const removeChat = async (chatId: string) => {
    await chatsAPIRef.current?.deleteChat(chatId);
  };

  //  fetch current chat particiapants
  useEffect(() => {
    const chatsAPI = new ChatsAPI(client);

    currentChat &&
      chatsAPI.getParticipants(currentChat.id).then((data) => {
        setParticiapants(data);
      });
  }, [client, currentChat]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        openChat,
        addChat,
        removeChat,
        setCurrentChat,
        participants,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextData => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
