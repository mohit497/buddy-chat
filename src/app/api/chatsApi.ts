// chatsAPI.ts

import { Chat, Message, User, ChatParticipants } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

class ChatsAPI {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async getChats(): Promise<Chat[] | null> {
    let { data: chats, error } = await this.supabase.from("chats").select("*");
    if (error) throw error;
    return chats;
  }

  async getChat(id: string): Promise<Chat> {
    let { data: chat, error } = await this.supabase
      .from("chats")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return chat;
  }

  async createChat(participants: User[]): Promise<Chat | null> {
    const chat: Chat = {
      id: "", // Generate an ID for the chat
      name: participants[0].name, // Name the chat after the first participant
      avatar: "", // Provide an avatar for the chat
      messages: [], // Initialize an empty messages array
      last_message: "", // Initialize an empty last message
    };

    let { data: newChat, error } = await this.supabase
      .from("chats")
      .insert([chat]);
    if (error) throw error;
    return newChat;
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
    userId: string
  ): Promise<ChatParticipants | null> {
    const participant: ChatParticipants = { chat_id: chatId, user_id: userId };
    let { data: newParticipant, error } = await this.supabase
      .from("chatParticipants")
      .insert([participant]);
    if (error) throw error;
    return newParticipant;
  }

  async removeParticipant(chatId: string, userId: string): Promise<void> {
    let { error } = await this.supabase
      .from("chatParticipants")
      .delete()
      .eq("chat_id", chatId)
      .eq("user_id", userId);
    if (error) throw error;
  }

  // get messages for a chat
  async getMessages(chatId: string): Promise<Message[] | null> {
    let { data: messages, error } = await this.supabase
      .from("messages")
      .select("*")
      .eq("chatId", chatId);
    if (error) throw error;
    return messages;
  }

  // get participants for a chat
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

  // send message in a chat
  async sendMessage(message: Message): Promise<Message | null> {
    let { data: newMessage, error } = await this.supabase
      .from("messages")
      .insert([message]);
    if (error) throw error;
    return newMessage;
  }
}

export default ChatsAPI;
