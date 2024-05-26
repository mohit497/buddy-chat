import UserAPI from "@/app/api/userApi";
import { PAGE_SIZE } from "@/app/constants";
import { User } from "@/types";
import { useState, useCallback, useEffect } from "react";

export const useGetUsers = (
  client: any,
  filterByName: string,
  currentUser: User | null
) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    const userAPI = new UserAPI(client);
    const fetchedUsers = await userAPI.getUsers(filterByName);
    setUsers(
      fetchedUsers?.filter((user) => {
        return currentUser?.id !== user.id;
      }).sort((a,b)=>{
        // sort by last active
        return a.lastActive > b.lastActive ? -1 : 1;
      }) || []
    );
  },[client, filterByName, currentUser]);

  useEffect(() => {
    fetchUsers();
  }, [client, fetchUsers, filterByName]);

  return { users, fetchUsers };
};
