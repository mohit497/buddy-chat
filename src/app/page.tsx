"use client";
import { UserForm } from "./forms/userForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Buddy Chat</h1>
      <p className="mt-4 text-lg">Start chatting with your buddies!</p>

      <div className="mt-8 w-1/3">
        <UserForm />
      </div>
    </main>
  );
}
