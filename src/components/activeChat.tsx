"use client";
import { useChat } from "@/context/chatProvider";
import { Message, User } from "@/types";
import React, { useEffect, useState } from "react";
import { Comment } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "tailwindcss/tailwind.css";
import { useSupabase } from "@/context/supabaseProvider";
import ChatsAPI from "@/app/api/chatsApi";
import MessageEditor from "./messageEditor";
import { useAuth } from "@/context/authProvider";
import { useMessageSub } from "@/hooks/useMessageSub";

const ActiveChat: React.FC = () => {
  const { currentChat } = useChat();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [participants, setparticipants] = useState<User[]>();
  const { client } = useSupabase();
  const { user } = useAuth();

  // get chat participants

  useEffect(() => {
    const chatsAPI = new ChatsAPI(client);

    currentChat &&
      chatsAPI.getMessages(currentChat.id).then((data) => {
        setMessages(data);
      });

    currentChat &&
      chatsAPI.getParticipants(currentChat.id).then((data) => {
        setparticipants(data || undefined);
      });
  }, [client, currentChat]);

  const onChange = (payload: { new: Message }) => {
    setMessages((prevMessages) => [
      ...(prevMessages as Message[]),
      payload.new,
    ]);
  };

  useMessageSub(currentChat?.id, onChange);

  if (!currentChat) {
    return <div className="h2">Select a chat to view messages</div>;
  }

  // get height of screen 
  const height = window.innerHeight;

  return (
    <div className="p-4 flex flex-col " style={{height: `${height-100}px`}}>
      <div className="overflow-auto ">
        <Comment.Group>
          {messages &&
            messages.map((message: Message) => {
              // Find the user who sent the message from the participants array
              const user = participants?.find(
                (participant) => participant.id === message.sender
              );

              return (
                <Comment key={message.id}>
                  <Comment.Avatar src={user?.avatar} />
                  <Comment.Content>
                    <Comment.Author>{user?.name}</Comment.Author>
                    <Comment.Text className="message  floating">
                      {message.content}
                    </Comment.Text>
                  </Comment.Content>
                </Comment>
              );
            })}
        </Comment.Group>
      </div>
      {currentChat && (
        <div className="mt-auto h-8">
          <MessageEditor chatId={currentChat.id} userId={user?.id || ""} />
        </div>
      )}
    </div>
  );
};

export default ActiveChat;
