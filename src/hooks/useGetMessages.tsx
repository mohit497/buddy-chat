import { useState, useEffect, useCallback } from "react";
import { useChat } from "@/context/chatProvider";
import { Message } from "@/types";
import { useMessageSub } from "./useMessageSub";
import { PAGE_SIZE } from "@/app/constants";
import moment from "moment";
import { pages } from "next/dist/build/templates/app-page";

export default function useGetMessages(chatId: string | undefined) {
  const { getMessages, currentChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getMessages(chatId, 0, PAGE_SIZE - 1);
      setMessages(data?.reverse() as Message[]);
      setLoading(false);
    }
    fetchData();
  }, [chatId, getMessages]);

  // clear old messages when chat changes
  useEffect(() => {
    setMessages([]);
    setHasMore(true);
  }, [chatId]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;


    setLoading(true);
    const start = messages.length;
    const data = await getMessages(chatId, start, start + PAGE_SIZE - 1);
    if (data && data.length > 0) {
      setMessages((prevMessages) =>
        [ ...data, ...prevMessages]
      );
    } else {
      setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, messages, chatId, getMessages]);

  const onChange = (payload: { new: Message }) => {
    setMessages((prevMessages) =>
      [...prevMessages, payload.new]
    );
  };

  useMessageSub(currentChat?.id, onChange);

  // sort messages by timestamp and remove duplicates
    useEffect(() => {
        setMessages((prevMessages) =>
        prevMessages?.sort((a, b) => {
            return moment(a.timestamp).isBefore(b.timestamp) ? -1 : 1;
        })
        );
    }, [messages]);

  return { messages, loading, hasMore, loadMore };
}
