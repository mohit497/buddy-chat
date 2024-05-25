"use client";
import ActiveChat from "@/components/activeChat";
import ActiveChatHeader from "@/components/activeChatHeader";
import ChatList from "@/components/chatList";
import { useAuth } from "@/context/authProvider";
import { useChat } from "@/context/chatProvider";
import React, { useState } from "react";
import { Input, Image } from "semantic-ui-react";

const ChatAppLayout: React.FC = () => {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const { chats } = useChat();
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <Image
            src={user?.avatar || "https://placehold.co/600x400/000000/FFF"}
            alt={user?.name || "User"}
            className="user-avatar mr-2 w-12 h-12 object-cover rounded-full"
          />
          <h2 className="font-semibold text-xl">{user?.name}</h2>
        </div>
        <Input
          type="text"
          value={filter}
          fluid
          onChange={handleFilterChange}
          placeholder="Search chats..."
          className="mb-4 mx-2"
        />

        <div className="bg-gray-200 h-64 rounded p-2">
          <ChatList chats={chats} />
        </div>
      </div>
      <div className="w-2/3 p-4 h-screen">
        <ActiveChatHeader />

        <div className="bg-gray-200 h-100 rounded p-4">
          <ActiveChat />
        </div>
      </div>
    </div>
  );
};

export default ChatAppLayout;
