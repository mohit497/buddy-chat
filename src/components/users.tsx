import React, { useEffect, useState } from "react";
import { Button, List, Image } from "semantic-ui-react";
import { useSupabase } from "@/context/supabaseProvider";
import UserAPI from "@/app/api/userApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "@/context/authProvider";
import { User } from "@/types";

interface UserListProps {
  filterByName?: string;
}

const UserList = (props: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { client } = useSupabase();
  const userAPI = new UserAPI(client);

  const { user: currentUser } = useAuth();

  const { filterByName } = props;

  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
  }, [filterByName]);


  useEffect(() => {
    fetchUsers();
  }, [page, filterByName]);
  

  if (!currentUser) return null;

  const fetchUsers = async () => {
    const fetchedUsers = await userAPI.getUsers(page, 7, filterByName);
    if (fetchedUsers && fetchedUsers.length === 0) {
      setHasMore(false);
    } else {
      setUsers((prevUsers) => [
        ...prevUsers,
        ...fetchedUsers.filter((user) => user.id !== currentUser.id),
      ]);
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleStartChat = (user) => {
    // Add your logic to start a new chat with the selected user
    console.log(`Start chat with ${user.name}`);
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
