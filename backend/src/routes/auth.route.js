import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserToken,
  regenerateVerificationToken,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Email verification

router.get("/verify-email/:token", verifyEmail);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

// Dev routes
router.get("/get-token", getUserToken);
router.post("/regenerate-verification", regenerateVerificationToken);

export default router;