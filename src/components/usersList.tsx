import React, { useCallback, useEffect, useState } from "react";
import { Button, List, Image, Icon } from "semantic-ui-react";
import { useSupabase } from "@/context/supabaseProvider";
import UserAPI from "@/app/api/userApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "@/context/authProvider";
import { User } from "@/types";
import moment from "moment";
import { useChat } from "@/context/chatProvider";
import { PAGE_SIZE } from "@/app/constants";
import { useGetUsers } from "@/hooks/useGetUsers";

interface UserListProps {
  filterByName?: string;
}

const UserList = (props: UserListProps) => {
  const { user: currentUser } = useAuth();
  const { addChat } = useChat();

  const { filterByName } = props;
  const { client } = useSupabase();

  const { users } = useGetUsers(client, filterByName, currentUser);

  if (!currentUser) return null;

  const handleStartChat = async (user: User) => {
    await addChat([currentUser, user]);
  };

  const isActive = (lastActive: Date) => {
    const nowUTC = moment().utc();
    const lastActiveUTC = moment.utc(lastActive);
    return nowUTC.diff(lastActiveUTC, "minutes") <= 5;
  };

  return (
    <div style={{ height: "70vh", overflow: "auto" }}>
      <List key={users.length}>
        {users.map((user) => (
          <List.Item key={user.id} className="flex items-center">
            <Image avatar src={user.avatar} alt="" />
            <span>{user.name}</span>
            <span>
              <Icon
                name="circle"
                color={isActive(user.lastActive) ? "green" : "grey"}
              />
            </span>
            <List.Content floated="right">
              <Button onClick={() => handleStartChat(user)}>+</Button>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default UserList;
