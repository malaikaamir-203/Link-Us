// MessageItem.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const MessageItem = ({ message, authUserId, authToken, refreshMessages, selectedUserId }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const API_BASE = "http://localhost:5001"; // ✅ Backend base URL

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/api/messages/delete/${message._id}`, {
        withCredentials: true, // ✅ Sends cookies (JWT)
      });
      toast.success("Message deleted");
      refreshMessages(selectedUserId);
      setMenuOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error deleting message";
      toast.error(errorMsg);
      console.error("Delete error:", err.response?.data || err.message); // Debug log
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/messages/edit/${message._id}`,
        { text: editText },
        {
          withCredentials: true, // ✅ Sends cookies
        }
      );
      toast.success("Message edited");
      refreshMessages(selectedUserId);
      setIsEditing(false);
      setMenuOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error editing message";
      toast.error(errorMsg);
      console.error("Edit error:", err.response?.data || err.message); // Debug log
    }
  };

  return (
    <div className={`chat ${message.senderId === authUserId ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-10 h-10 rounded-full border">
          <img
            src={message.senderId === authUserId ? "/avatar.png" : "/avatar.png"}
            alt="profile pic"
          />
        </div>
      </div>

      <div className="chat-bubble flex flex-col relative">
        {message.image && (
          <img
            src={message.image}
            alt="Attachment"
            className="sm:max-w-[200px] rounded-md mb-2"
          />
        )}

        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="input input-sm flex-1"
            />
            <button onClick={handleEdit} className="btn btn-xs btn-primary">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-xs btn-ghost">
              Cancel
            </button>
          </div>
        ) : (
          <p>{message.text}</p>
        )}

        {message.senderId === authUserId && (
          <div className="absolute top-0 right-0">
            {/* 3 dots button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-gray-600 px-2"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-6 w-32 bg-white border rounded shadow-lg z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Unsend
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;