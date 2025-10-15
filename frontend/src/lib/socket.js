// src/lib/socket.js
import { io } from "socket.io-client";

// Get userId from localStorage (must be set after login)
const userId = localStorage.getItem("userId");

// Create ONE socket connection, with optional userId in query
export const socket = io("http://localhost:5001", {
  withCredentials: true,
  query: userId ? { userId } : {}, // Include userId only if it exists
});