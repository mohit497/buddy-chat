import { useSupabase } from "@/context/supabaseProvider";
import { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import UserAPI from "../api/userApi";

export const UserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const { client } = useSupabase();

  const validateForm = () => {
    let isValid = true;

    if (name.trim() === "") {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setEmailError("Email is not valid");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {

    if (!validateForm()) {
      return;
    }

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

  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label>Name</label>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {nameError && <div className="text-red-500">{nameError}</div>}
      </Form.Field>
      <Form.Field>
        <label>Email</label>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <div className="text-red-500">{emailError}</div>}
      </Form.Field>
      <Form.Field>
        <label>Avatar URL</label>
        <input
          placeholder="Avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </Form.Field>
      <Button type="submit" className="mx-auto">
        Submit
      </Button>
    </Form>
  );
};
