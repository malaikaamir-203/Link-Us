import React from 'react';
import { X } from "lucide-react";
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, refreshMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // ✅ Handle delete entire chat
  const handleDeleteChat = async () => {
    if (!selectedUser) return;

    const confirm = window.confirm(
      `Are you sure you want to delete the entire chat with ${selectedUser.fullName}?`
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5001/api/messages/chat/${selectedUser._id}`, {
        withCredentials: true,
      });

      toast.success("Chat deleted");
      refreshMessages(); // Clear messages in UI
    } catch (err) {
      toast.error("Failed to delete chat");
      console.error("Delete chat error:", err);
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-10 h-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
         {/* Delete Chat Button */}
<button
  type="button"
  onClick={handleDeleteChat}
  className="btn btn-ghost btn-xs text-error border border-error/30 
             hover:scale-105 hover:shadow-md 
             active:scale-95 
             transition-all duration-200 ease-out
             transform flex items-center gap-1"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
  Delete Chat
</button>
          {/* Close button */}
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;