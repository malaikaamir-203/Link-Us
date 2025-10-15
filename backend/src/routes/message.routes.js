import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessage,
  editMessage,
  deleteChat, //  Now imported
} from "../controllers/message.controller.js";

const router = express.Router();

// Get users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get messages with a specific user
router.get("/:id", protectRoute, getMessages);

// Send message to a specific user
router.post("/send/:id", protectRoute, sendMessage);

// Delete message by ID
router.delete("/delete/:id", protectRoute, deleteMessage);

// Edit message by ID
router.put("/edit/:id", protectRoute, editMessage);

// Delete entire chat
router.delete("/chat/:userId", protectRoute, deleteChat);

export default router;