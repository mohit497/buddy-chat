import React from "react";
import { Button, List, Image, Icon } from "semantic-ui-react";
import { useAuth } from "@/context/authProvider";
import { User } from "@/types";
import moment from "moment";
import { useChat } from "@/context/chatProvider";
import { HEIGHT_OFFSET } from "@/app/constants";
import { Utils } from "@/utils/util";

interface UserListProps {
  filterByName?: string;
}

const UserList = (props: UserListProps) => {
  const { user: currentUser } = useAuth();
  const { addChat, setSelectedUser, users, selectedUser } = useChat();

  const { filterByName } = props;

  if (!currentUser) return null;

  const handleStartChat = async (user: User) => {
    setSelectedUser(user);
  };

  const isActive = (lastActive: Date) => {
    const nowUTC = moment().utc();
    const lastActiveUTC = moment.utc(lastActive);
    return nowUTC.diff(lastActiveUTC, "minutes") <= 5;
  };

  if (!users) return <>No Users Online</>;
  const height = window.innerHeight;

  return (
    <div style={{ height: "80vh", overflow: "auto" }}>
      <List divided relaxed>
        {users
          .filter((a) => a.name.includes(filterByName || ""))
          .map((user) => (
            <List.Item
              className={`border ${
                user.id === selectedUser?.id ? "bg-gray-100" : ""
              }`}
              key={user.id}
              style={{ padding: "10px", display: "flex", alignItems: "center" }}
              onClick={() => handleStartChat(user)}
            >
              <Image avatar src={Utils.getAvatarUrl(user)} alt={user.name} />
              <List.Content style={{ flexGrow: 1, marginLeft: "10px" }}>
                <List.Header>{user.name}</List.Header>
              </List.Content>
              <Icon
                name="circle"
                color={isActive(user.lastActive) ? "green" : "grey"}
                style={{ marginLeft: "auto" }}
              />
            </List.Item>
          ))}
      </List>
    </div>
  );
};

export default UserList;
