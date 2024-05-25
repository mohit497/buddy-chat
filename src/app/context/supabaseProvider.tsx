"use client";

import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

interface SupabaseProviderProps {
  children: React.ReactNode;
  supabaseUrl: string;
  supabaseKey: string;
}

const SupabaseContext = createContext<SupabaseClient | null>(null);

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
  children,
  supabaseUrl,
  supabaseKey,
}) => {
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(
    null
  );

  useEffect(() => {
    const client = createClient(supabaseUrl, supabaseKey);
    setSupabaseClient(client);
  }, [supabaseUrl, supabaseKey]);

  useEffect(() => {
    if (supabaseClient) {
      console.log("Supabase is connected");
    } else {
      console.log("Supabase is not connected");
    }
  }, [supabaseClient]);

  return (
    <SupabaseContext.Provider value={supabaseClient}>
      {children}
    </SupabaseContext.Provider>
  );
};

export function useSupabase() {
  const supabase = useContext(SupabaseContext);
  if (supabase === null) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return supabase;
}
