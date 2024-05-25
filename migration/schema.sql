-- Create the users table
CREATE TABLE users (
    id uuid PRIMARY KEY,
    name text,
    email text,
    avatar text
);

-- Create the chats table
CREATE TABLE chats (
    id uuid PRIMARY KEY,
    name text,
    avatar text,
    last_message text
);

-- Create the messages table
CREATE TABLE messages (
    id uuid PRIMARY KEY,
    chat_id uuid REFERENCES chats(id),
    sender uuid REFERENCES users(id),
    content text,
    timestamp timestamp with time zone
);

-- Create the chat_participants table
CREATE TABLE chat_participants (
    user_id uuid REFERENCES users(id),
    chat_id uuid REFERENCES chats(id),
    PRIMARY KEY (user_id, chat_id)
);