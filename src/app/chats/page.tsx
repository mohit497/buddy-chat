"use client";
import ActiveChat from "@/components/activeChat";
import ActiveChatHeader from "@/components/activeChatHeader";
import UserList from "@/components/usersList";
import React, { useState } from "react";
import { Input, Tab } from "semantic-ui-react";

const ChatAppLayout: React.FC = () => {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };


  return (
    <div className="flex  bg-gray-100">
      <div className="w-1/3 bg-white border-r border-gray-200 p-4">
        <Input
          type="text"
          value={filter}
          fluid
          onChange={handleFilterChange}
          placeholder="Search "
          className="mb-4 mx-2"
        />

        <div
          className="bg-gray-200  rounded "
        >
          <UserList filterByName={filter} />
        </div>
      </div>
      <div className="w-2/3 p-4  ">
        <ActiveChatHeader />
        <div className="bg-gray-200  rounded p-4">
          <ActiveChat />
        </div>
      </div>
    </div>
  );
};

export default ChatAppLayout;
