import { User } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

class UserAPI {
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getUser(email: string): Promise<User | null> {
    const { data, error } = await this.client
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data;
  }

  async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<User | null> {
    const { data, error } = await this.client
      .from("users")
      .update(updates)
      .eq("id", userId);

    if (error) {
      console.error("Error updating user:", error);
      return null;
    }

    return data;
  }

  // create a new user
  async createUser(user: User): Promise<User | null> {
    const { data, error } = await this.client
      .from("users")
      .insert([user])
      .select("*");
    console.log("data", data, error);

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return data[0] as User;
  }

  // get all users  and filter by name
  async getUsers(name?: string): Promise<User[] | null> {
    let query = this.client.from("users").select("*");

    if (name) {
      query = query.ilike("name", `%${name}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return null;
    }

    return data;
  }

  // udpate last Active when user is active
  async updateLastActive(userId: string): Promise<User | null> {
    const { data, error } = await this.client
      .from("users")
      .update({ lastActive: new Date() })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user last active:", error);
      return null;
    }

    return data;
  }
}

export default UserAPI;
