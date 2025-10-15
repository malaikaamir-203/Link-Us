import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import Cookies from "js-cookie"; 

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ✅ NEW: Initialize auth by reading token from cookie
  initializeAuth: async () => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        // Optional: decode JWT to get userId
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId || payload.user?.id;

        // Set temporary auth state while checking
        set({ isCheckingAuth: true });

        // Now call /auth/check — it will validate the token via cookie
        const res = await axiosInstance.get("/auth/check");
        const user = res.data;

        if (user.isVerified) {
          set({ authUser: user });
          get().connectSocket();
        } else {
          Cookies.remove("jwt");
          set({ authUser: null });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        Cookies.remove("jwt");
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    } else {
      // No token → set no user
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  // Check if user is authenticated and verified
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      const user = res.data;

      if (user.isVerified) {
        set({ authUser: user });
        get().connectSocket();
      } else {
        set({ authUser: null });
      }
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Sign up → don't log in until verified
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("✅ Check your inbox to verify your account!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign up failed");
      return { success: false };
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login → only if verified
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ Verify email token
  verifyEmail: async (token) => {
    try {
      const res = await axiosInstance.get(`/auth/verify-email/${token}`);
      set({ authUser: res.data.user || res.data });
      toast.success("✅ Email verified! Welcome!");
      get().connectSocket();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
      return { success: false };
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // Update profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Socket connection
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));