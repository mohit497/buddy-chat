import React, { useCallback, useEffect, useState } from "react";
import { Button, List, Image, Icon, SemanticCOLORS } from "semantic-ui-react";
import { useSupabase } from "@/context/supabaseProvider";
import UserAPI from "@/app/api/userApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "@/context/authProvider";
import { User } from "@/types";
import moment from "moment";
import { useChat } from "@/context/chatProvider";
import ChatsAPI from "@/app/api/chatsApi";

interface UserListProps {
  filterByName?: string;
}

const UserList = (props: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user: currentUser } = useAuth();
  const { addChat } = useChat();

  const { filterByName } = props;
  const { client } = useSupabase();

  const fetchUsers = useCallback(async () => {
    const userAPI = new UserAPI(client);
    const fetchedUsers = await userAPI.getUsers(page, 7, filterByName);
    if (fetchedUsers && fetchedUsers.length === 0) {
      setHasMore(false);
    } else {
      setUsers((prevUsers) => [
        ...prevUsers,
        ...fetchedUsers
          .filter((user) => user.id !== currentUser?.id)
          .sort(
            (a, b) =>
              moment(b.lastActive).valueOf() - moment(a.lastActive).valueOf()
          ),
      ]);
      setPage((prevPage) => prevPage + 1);
    }
  }, [page, filterByName, currentUser]);

  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
  }, [filterByName]);

  useEffect(() => {
    fetchUsers();
  }, [page, filterByName, fetchUsers]);

  if (!currentUser) return null;

  const handleStartChat = async (user: User) => {
    console.log(user);
    await addChat([currentUser, user]);
  };

  const isActive = (lastActive: Date) => {
    const format = "YYYY-MM-DD HH:mm:ss.SSS";
    const nowUTC = moment().utc();
    const lastActiveUTC = moment.utc(lastActive, format);
    return nowUTC.diff(lastActiveUTC, "minutes") <= 5;
  };

  return (
    <InfiniteScroll
      dataLength={users.length}
      next={fetchUsers}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      style={{ height: "70vh", overflow: "auto" }}
    >
      <List>
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
    </InfiniteScroll>
  );
};

export default UserList;
