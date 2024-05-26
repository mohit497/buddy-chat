import { useSupabase } from "@/context/supabaseProvider";
import { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import UserAPI from "../api/userApi";

export const UserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const { client } = useSupabase();

  const handleSubmit = async () => {
    const userAPI = new UserAPI(client);

    const user = {
      name,
      email,
      avatar,
      lastActive: new Date(),
    };

    // check if user already exists
    const existingUser = await userAPI.getUser(email);

    if (existingUser) {
      localStorage.setItem("user", JSON.stringify(existingUser));
      window.location.href = "/chats";
      return;
    }

    await userAPI.createUser(user).then((res) => {
      localStorage.setItem("user", JSON.stringify(res));
      window.location.href = "/chats";
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label>Name</label>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Email</label>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Avatar URL</label>
        <input
          placeholder="Avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </Form.Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
};
