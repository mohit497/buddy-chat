"use client";
import ActiveChat from "@/components/activeChat";
import ActiveChatHeader from "@/components/activeChatHeader";
import ChatList from "@/components/chatList";
import UserList from "@/components/users";
import { useAuth } from "@/context/authProvider";
import { useChat } from "@/context/chatProvider";
import React, { useState } from "react";
import { Input, Image, Tab, Search } from "semantic-ui-react";

const ChatAppLayout: React.FC = () => {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const { chats } = useChat();
  const { user } = useAuth();

  const panes = [
    {
      menuItem: "Chats",
      render: () => (
        <Tab.Pane>
          <ChatList chats={chats} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Users",
      render: () => (
        <Tab.Pane>
          <UserList filterByName={filter}/>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div className="flex  bg-gray-100">
      <div className="w-1/3 bg-white border-r border-gray-200 p-4">
        <Input
          type="text"
          value={filter}
          fluid
          onChange={handleFilterChange}
          placeholder="Search chats..."
          className="mb-4 mx-2"
        />

        <div className="bg-gray-200 h-64 rounded p-2">
          <Tab panes={panes} />
        </div>
      </div>
      <div className="w-2/3 p-4 ">
        <ActiveChatHeader />

        <div className="bg-gray-200  rounded p-4">
          <ActiveChat />
        </div>
      </div>
    </div>
  );
};

export default ChatAppLayout;
