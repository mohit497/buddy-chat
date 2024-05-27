// chatsAPI.ts

import { Chat, Message, User, ChatParticipants } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

class ChatsAPI {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async getUserChats(userId: string | undefined): Promise<Chat[] | null> {
    if (!userId) return null;

    let { data: chatParticipants, error: error1 } = await this.supabase
      .from("chat_participants")
      .select("chat_id, last_seen")
      .eq("user_id", userId);

    if (error1) throw error1;

    const chatIds = chatParticipants?.map((cp) => cp.chat_id) || [];

    let { data: chats, error: error2 } = await this.supabase
      .from("chats")
      .select("*")
      .in("id", chatIds);

    if (error2) throw error2;
    return chats;
  }

  async getChatById(id: string): Promise<Chat> {
    let { data: chat, error } = await this.supabase
      .from("chats")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return chat;
  }

  async createChat(participants: User[]): Promise<Chat | null> {
    const chat = {
      name: participants.map((participant) => participant.name).join(", "),
      avatar: participants[0].avatar || "",
      last_message: "",
    };

    let { data: newChat, error } = await this.supabase
      .from("chats")
      .insert([chat])
      .select("*");
    if (error) throw error;

    if (newChat) {
      const chatId = newChat[0].id as string;
      await this.addParticipant(newChat[0].id, participants);

      return newChat[0];
    }

    return null;
  }

  async updateChat(id: string, chat: Partial<Chat>): Promise<Chat | null> {
    let { data: updatedChat, error } = await this.supabase
      .from("chats")
      .update(chat)
      .eq("id", id);
    if (error) throw error;
    return updatedChat;
  }

  async deleteChat(id: string): Promise<void> {
    let { error } = await this.supabase.from("chats").delete().eq("id", id);
    if (error) throw error;
  }

  async addParticipant(
    chatId: string,
    users: User[]
  ): Promise<ChatParticipants | null> {
    const participants = users.map((user) => ({
      chat_id: chatId,
      user_id: user.id,
    }));

    let { data: newParticipants, error } = await this.supabase
      .from("chat_participants")
      .insert(participants);
    if (error) throw error;
    return newParticipants;
  }

  async removeParticipant(chatId: string, userId: string): Promise<void> {
    let { error } = await this.supabase
      .from("chatParticipants")
      .delete()
      .eq("chat_id", chatId)
      .order("timestamp", { ascending: false });
    if (error) throw error;
  }

  async getMessagesByChatId(
    chatId: string,
    start: number,
    end: number
  ): Promise<Message[] | null> {
    let { data: messages, error } = await this.supabase
      .from("messages")
      .select("*")
      .eq("chatId", chatId)
      .range(start, end)
      .order("timestamp", { ascending: false });
    if (error) throw error;
    return messages;
  }
  async getParticipants(chatId: string): Promise<User[] | null> {
    let { data: participants, error } = await this.supabase
      .from("chat_participants")
      .select("user_id")
      .eq("chat_id", chatId);
    if (error) throw error;

    const userIds = participants?.map(
      (participant: { user_id: string }) => participant.user_id
    );
    let { data: users, error: userError } = await this.supabase
      .from("users")
      .select("*")
      .in("id", userIds || []);
    if (userError) throw userError;

    return users;
  }

  async sendMessage(message: Message): Promise<Message | null> {
    let { data: newMessage, error } = await this.supabase
      .from("messages")
      .insert([message]);
    if (error) throw error;
    return newMessage;
  }

  async updateLastSeen(chatId: string, userId: string): Promise<void> {
    let { error } = await this.supabase
      .from("chat_participants")
      .update({ last_seen: new Date() })
      .eq("chat_id", chatId)
      .eq("user_id", userId);
    if (error) throw error;
  }

  async getLastSeen(chatId: string, userId: string): Promise<number | null> {
    let { data: participants, error } = await this.supabase
      .from("chat_participants")
      .select("last_seen")
      .eq("chat_id", chatId)
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return participants?.last_seen;
  }

  async findChatByParticipants(participants: User[]): Promise<Chat | null> {
    const participantIds = participants.map((p) => p.id);

    // Fetch all chat IDs where the specified participants are present
    let { data: chatParticipants, error } = await this.supabase
      .from("chat_participants")
      .select("chat_id")
      .in("user_id", participantIds);

    if (error) throw error;

    const chatIdCounts = chatParticipants?.reduce((acc, cp) => {
      acc[cp.chat_id] = (acc[cp.chat_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Filter chat IDs that have exactly the number of specified participants
    const validChatIds = Object.keys(chatIdCounts ?? {}).filter(
      (chatId) => chatIdCounts?.[chatId] === participantIds.length
    );

    if (validChatIds.length === 0) {
      return null; // No chats found with the exact participants
    }

    // Fetch the chat data
    let { data: chats, error: error2 } = await this.supabase
      .from("chats")
      .select("*")
      .in("id", validChatIds);

    if (error2) throw error2;

    return chats?.[0] || null;
  }
}

export default ChatsAPI;
