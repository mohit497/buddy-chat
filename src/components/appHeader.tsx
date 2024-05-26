"use client";
import { useAuth } from "@/context/authProvider";
import React from "react";
import { Menu, Image, Button } from "semantic-ui-react";

const AppHeader = () => {
  const { user, logout } = useAuth();
  return (
    <Menu style={{margin:'0px'}}>
      <Menu.Item>
        <Image size="mini" src="/chat.png" alt="Buddy Chat" />
        <span className="h2">Buddy Chat</span>
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item>
          <Image avatar src={user?.avatar} alt="" />
          <span>{user?.name}</span>
            
        </Menu.Item>
        <Menu.Item>
          <Button onClick={logout}>Logout</Button>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default AppHeader;
