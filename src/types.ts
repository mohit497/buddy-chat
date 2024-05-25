// types.ts

export interface Message {
  id?: string;
  chatId: string;
  sender: string;
  content: string;
  timestamp?: Date;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  last_message: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar: string;
}

export interface ChatParticipants {
  chat_id: string;
  user_id: string;
}
