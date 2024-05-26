"use client";
import { Chat, User, Message } from "@/types";
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
import UserAPI from "@/app/api/userApi";

interface ChatContextData {
  chats: Chat[] | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[] | null>>;
  currentChat: Chat | null;
  openChat: (chatId: string) => void;
  addChat: (chat: User[]) => Promise<void>;
  removeChat: (chatId: string) => void;
  setCurrentChat: (chat: Chat) => void;
  participants: User[] | null;
  getMessages: (
    chatId: string | undefined
  ) => Promise<Message[] | null | undefined>;
  users: User[] | null | undefined;
  chatsApi: ChatsAPI | null;
}

const ChatContext = createContext<ChatContextData | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<Chat[] | null>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [participants, setParticiapants] = useState<User[] | null>(null);
  const chatsAPIRef = useRef<ChatsAPI | null>(null);
  const usersApiRef = useRef<UserAPI | null>(null);
  const { client } = useSupabase();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[] | null | undefined>(null);

  const getChats = useCallback(async () => {
    chatsAPIRef.current = chatsAPIRef.current || new ChatsAPI(client);
    const chats = await chatsAPIRef.current.getUserChats(user?.id);
    setChats(chats);
  }, [client, user, setChats]);

  useEffect(() => {
    chatsAPIRef.current = new ChatsAPI(client);
    usersApiRef.current = new UserAPI(client);

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

  const getMessages = async (chatId: string | undefined) => {
    if (!chatId) return;
    const messages = await chatsAPIRef.current?.getMessagesByChatId(chatId);

    return messages;
  };


  const getUsers = async () => {
    const users = await usersApiRef.current?.getUsers();
    setUsers(
      users
        ?.filter((u) => u.id !== user?.id)
        .sort((a, b) => {
          return a.lastActive > b.lastActive ? -1 : 1;
        })
    );
  };


  useEffect(() => {
    currentChat &&
      chatsAPIRef.current?.getParticipants(currentChat.id).then((data) => {
        setParticiapants(data);
      });

    getUsers();
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
        getMessages,
        users,
        setChats,
        chatsApi: chatsAPIRef.current,
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
