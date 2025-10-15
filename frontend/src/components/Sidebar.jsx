import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, socket } = useAuthStore(); // ✅ Get socket from Zustand
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // ✅ Track who sent a new message
  const [newMessageFrom, setNewMessageFrom] = useState(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // ✅ Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      // Only show if not currently chatting
      if (message.senderId !== selectedUser?._id) {
        setNewMessageFrom(message.senderId);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser]);

  // ✅ When user selects a chat, remove the badge
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (user._id === newMessageFrom) {
      setNewMessageFrom(null);
    }
  };

  const filteredUsers = showOnlineOnly 
    ? users.filter(user => onlineUsers.includes(user._id)) 
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
      <div className='border-b border-base-300 w-full p-5'>
        <div className='flex items-center gap-2'>
          <Users className='size-6' />
          <span className='font-medium hidden lg:block'>Contacts</span>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className='overflow-y-auto w-full py-3'>
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleUserSelect(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            {/* Profile Image + Online Dot + Badge */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="w-12 h-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
                />
              )}
              {/* 🔖 Badge with "1" */}
              {newMessageFrom === user._id && (
                <span 
  className="absolute -top-1 -right-1 bg-primary text-primary-content 
             border-2 border-white text-sm font-bold 
             w-7 h-7 min-w-[24px] rounded-full flex items-center justify-center
             animate-pulse"
>
  💬
</span>
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {/* No users message */}
        {filteredUsers.length === 0 && (
          <div className='text-center text-zinc-500 py-4'>No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;