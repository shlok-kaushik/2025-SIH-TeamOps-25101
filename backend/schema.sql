CREATE DATABASE remote_classroom;

\c remote_classroom;

-- tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) NOT NULL
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  teacher_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  session_id INT REFERENCES sessions(id),
  user_id INT REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  uploader_id INT REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT now()
);
