import { User } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

class UserAPI {
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await this.client
      .from("users")
      .select("*")
      .eq("id", userId)
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
    const { data, error } = await this.client.from("users").insert([user]).select("*");
    console.log("data", data, error);

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return data[0] as User;
  }
}

export default UserAPI;
