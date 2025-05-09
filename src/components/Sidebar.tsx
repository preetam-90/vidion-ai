import React, { useRef, useEffect } from "react";
import { useChat } from "../contexts/ChatContext";
import { Chat } from "../types/chat";
import { formatDistanceToNow } from "date-fns";
import { PlusIcon, MessageSquareIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { chats, currentChat, setCurrentChat, createNewChat, deleteChat, hasEmptyChat } = useChat();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Use click outside hook to close sidebar on desktop
  useClickOutside(
    sidebarRef, 
    () => {
      if (isOpen && window.innerWidth >= 768) {
        setIsOpen(false);
      }
    },
    toggleBtnRef
  );

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleChatClick = (chat: Chat) => {
    if (currentChat?.id !== chat.id) {
      setCurrentChat(chat);
    }
    
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleCreateNewChat = () => {
    if (hasEmptyChat()) {
      return;
    }
    
    createNewChat();
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#202123] transform transition-all-medium ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-[50px]"
      } md:relative md:w-[260px] md:flex-shrink-0 flex flex-col`}
    >
      <div className="flex flex-col h-full max-h-screen overflow-hidden">
        <button 
          ref={toggleBtnRef}
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex absolute -right-4 top-4 bg-gray-800 rounded-full p-1 shadow-md z-10 hover:bg-gray-700 transition-all-medium"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeftIcon size={16} className="text-gray-300" /> : <ChevronRightIcon size={16} className="text-gray-300" />}
        </button>
        
        <div className="p-2 shrink-0">
          <button
            onClick={handleCreateNewChat}
            className={`w-full flex items-center gap-3 rounded-md border border-white/20 text-white px-3 py-3 text-sm hover:bg-gray-700 transition-all-medium ${!isOpen && "md:justify-center md:px-1"}`}
          >
            <PlusIcon size={16} />
            {isOpen && <span className="transition-opacity-medium">New chat</span>}
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto scrollbar-thin py-2 transition-opacity-medium ${!isOpen && "md:hidden"}`}>
          <div className="space-y-1 px-2">
            <h2 className="text-xs font-medium text-gray-400 px-2 mb-1">Today</h2>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-3 rounded-md px-3 py-3 text-sm cursor-pointer ${
                  currentChat?.id === chat.id
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-[#2A2B32]"
                }`}
                onClick={() => handleChatClick(chat)}
              >
                <MessageSquareIcon
                  size={16}
                  className="shrink-0 text-gray-400"
                />
                <div className="truncate flex-1">{chat.title}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded-sm transition-opacity"
                  aria-label="Delete chat"
                >
                  <TrashIcon size={14} className="text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-3 border-t border-gray-700 mt-auto shrink-0 transition-opacity-medium ${!isOpen && "md:hidden"}`}>
          <div className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-gray-300 hover:bg-[#2A2B32] cursor-pointer">
            <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold">V</span>
            </div>
            <div className="text-sm truncate">Vidion AI</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 