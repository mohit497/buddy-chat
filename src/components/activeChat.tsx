"use client";
import { useChat } from "@/context/chatProvider";
import { Message, User } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { Comment } from "semantic-ui-react";
import MessageEditor from "./messageEditor";
import { useAuth } from "@/context/authProvider";
import { Utils } from "@/utils/util";
import useGetMessages from "@/hooks/useGetMessages";
import moment from "moment";
import { HEIGHT_OFFSET } from "@/app/constants";

const ActiveChat: React.FC = () => {
  const { currentChat } = useChat();
  const { user } = useAuth();
  const { participants, getMessages, selectedUser, addChat, setCurrentChat } =
    useChat();

  const { messages, loading, hasMore, loadMore } = useGetMessages(
    currentChat?.id
  );
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  // Load more messages when the user scrolls to the top of the chat
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const scrollTop = (e.target as HTMLElement).scrollTop;
      if (scrollTop === 0) {
        loadMore();
      }
    };
    if (messageContainerRef.current) {
      messageContainerRef.current.addEventListener("scroll", handleScroll);
    }
    const cleanup = () => {
      if (messageContainerRef.current) {
        messageContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
    return () => {
      cleanup();
    };
  }, [loadMore]);

  const handleStartChat = async () => {
    if (selectedUser && user) {
      const chat = await addChat([user, selectedUser]);
      chat && setCurrentChat(chat);
    }
  };

  if (!currentChat) {
    return (
      <div className="h2">
        Start a new Chat with {selectedUser?.name}
        <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleStartChat}
        >
          Start Chat
        </button>
      </div>
    );
  }

  // get height of screen
  const height = window.innerHeight;

  return (
    <div
      className="p-4 flex flex-col "
      style={{ height: `${height - HEIGHT_OFFSET}px` }}
    >
      <div className="overflow-auto p-4 " ref={messageContainerRef}>
        {loading && <div>loading...</div>}
        {!hasMore && (
          <div className="text-center text-gray-500">No more messages</div>
        )}
        <Comment.Group style={{ minWidth: "100%" }} className="m-2">
          {messages &&
            messages.map((message: Message) => {
              // Find the user who sent the message from the participants array
              const sender = participants?.find(
                (participant) => participant.id === message.sender
              );

              const isOwnMessage = user?.id === message.sender;

              return (
                <div
                  key={message.id}
                  className={`flex items-center m-2 ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <img
                    src={
                      isOwnMessage
                        ? Utils.getAvatarUrl(user)
                        : Utils.getAvatarUrl(sender)
                    }
                    alt={sender?.name}
                    className="h-8 w-8 object-cover rounded-full mr-2"
                  />
                  <div
                    className={`p-3 rounded-lg ${
                      isOwnMessage ? "bg-green-100" : "bg-white"
                    }`}
                  >
                    <Comment>
                      <Comment.Content>
                        {/* <Comment.Author>{sender?.name}</Comment.Author> */}
                        <Comment.Text className="message floating">
                          {message.content}
                        </Comment.Text>
                        <Comment.Metadata>
                          <span
                            title={moment(message.timestamp).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
                          >
                            {moment(message.timestamp).format("MMMM D h:mm A")}
                          </span>
                        </Comment.Metadata>
                      </Comment.Content>
                    </Comment>
                  </div>
                </div>
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
