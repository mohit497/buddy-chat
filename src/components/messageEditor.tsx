import React, { useState } from "react";
import { Button, Form, Grid, Input } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "tailwindcss/tailwind.css";
import ChatsAPI from "@/app/api/chatsApi";
import { useSupabase } from "@/context/supabaseProvider";
import { Message } from "@/types";

interface MessageEditorProps {
  chatId: string;
  userId: string;
}

const MessageEditor: React.FC<MessageEditorProps> = ({ chatId, userId }) => {
  const [message, setMessage] = useState<string>();
  const { client } = useSupabase();



  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const chatsAPI = new ChatsAPI(client);


    const newMessage: Message = {
      content: message || "",
      chatId: chatId,
      sender: userId,
    };

    await chatsAPI.sendMessage(newMessage);
    setMessage("");
  };
  return (
    <Grid>
      <Grid.Row columns={2}>
        <Grid.Column width={13}>
          <Input
            fluid
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
        </Grid.Column>
        <Grid.Column width={3}>
          <Button type="submit" color="blue" fluid onClick={handleSubmit}>
            Send
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default MessageEditor;
