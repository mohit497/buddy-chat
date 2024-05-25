import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import UserAPI from "../api/userApi";
import { useSupabase } from "@/context/supabaseProvider";

export const UserForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { client } = useSupabase();
  const userAPI = new UserAPI(client);

  const handleSubmit = async () => {
    const user = {
      name,
      email,
      avatar: "https://placehold.co/600x400/000000/FFF",
    };

    await userAPI.createUser(user).then((res) => {
      localStorage.setItem("user", JSON.stringify(res));
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
      <Button type="submit">Submit</Button>
    </Form>
  );
};
