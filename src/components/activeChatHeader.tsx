import { useChat } from "@/context/chatProvider";
import moment from "moment";
import React, { useEffect } from "react";
import { Image } from "semantic-ui-react";

export default function ActiveChatHeader() {
  const { participants, currentChat } = useChat();

  if (!participants) return null;

  return (
    <h2 className="flex items-center mb-4">
      <Image
        src={currentChat?.avatar || "/chat.png"}
        alt={currentChat?.name}
        className="mr-2 w-12 h-12 object-cover rounded-full"
      />
      <div>
        <h2 className="font-semibold text-xl">{currentChat?.name}</h2>
        <p className="text-sm text-gray-500">
          {participants.map((participant) => participant.name).join(", ")}
        </p>
      </div>
    </h2>
  );
}
