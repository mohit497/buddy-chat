"use client";
import { Chat, User, ChatParticipants } from "@/types";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useSupabase } from "./supabaseProvider";
import ChatsAPI from "@/app/api/chatsApi";
import { useChatSub } from "@/hooks/useChatsSub";
import { useAuth } from "./authProvider";
import { Message } from "postcss";

interface ChatContextData {
  chats: Chat[] | null;
  currentChat: Chat | null;
  openChat: (chatId: string) => void;
  addChat: (chat: User[]) => Promise<void>;
  removeChat: (chatId: string) => void;
  setCurrentChat: (chat: Chat) => void;
  participants: User[] | null;
  getMessages: (chatId: string) => Message[] | null;
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
  const { user } = useAuth();

  const getChats = useCallback(async () => {
    chatsAPIRef.current = chatsAPIRef.current || new ChatsAPI(client);
    const chats = await chatsAPIRef.current.getUserChats(user?.id);
    setChats(chats);
  }, [client, user, setChats]);

  useEffect(() => {
    chatsAPIRef.current = new ChatsAPI(client);

    getChats();
  }, [client, getChats]);

  useChatSub(getChats);

  const openChat = (chatId: string) => {
    const chat = chats?.find((chat) => chat.id === chatId);
    setCurrentChat(chat || null);
  };

  const addChat = async (users: User[]) => {
    await chatsAPIRef.current?.createChat(users);
  };

  const removeChat = async (chatId: string) => {
    await chatsAPIRef.current?.deleteChat(chatId);
  };

  const getMessages = async (chatId: string) => {
   const messages =  await  chatsAPIRef.current?.getMessagesByChatId(chatId);

   return messages;
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
        getMessages
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
