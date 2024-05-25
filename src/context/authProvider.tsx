"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { useModal } from "./modalProvider";
import { UserForm } from "@/app/forms/userForm";

interface AuthContextProps {
  user: User | null | undefined;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  });

  const { showModal } = useModal();

  useEffect(() => {
    !user && showModal(<UserForm />);
  }, [showModal, user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
