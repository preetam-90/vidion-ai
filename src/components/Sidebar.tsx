import React, { useRef, useEffect, useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { Chat } from "../types/chat";
import { formatDistanceToNow } from "date-fns";
import { 
  PlusIcon, 
  MessageSquareIcon, 
  TrashIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  SearchIcon,
  StarIcon,
  BarChart2,
  Settings
} from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { chats, currentChat, setCurrentChat, createNewChat, deleteChat, hasEmptyChat } = useChat();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Use click outside hook to close sidebar on desktop
  useClickOutside(
    sidebarRef, 
    () => {
      // Only close on click outside for mobile/tablet screens
      if (isOpen && window.innerWidth < 1024) {
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
    
    // Close sidebar on smaller screens after selection
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleCreateNewChat = () => {
    if (hasEmptyChat()) {
      return;
    }
    
    createNewChat();
    
    // Close sidebar on smaller screens after creating new chat
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    (chat.title || "New Chat").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 bg-[#0D1117] transform transition-all duration-300 ease-in-out 
        ${isOpen 
          ? "translate-x-0 w-[280px] sm:w-[300px]" 
          : "translate-x-[-100%] lg:translate-x-0 w-[70px]"
        } 
        ${!isOpen && "lg:flex hidden"}
        h-full flex flex-col shadow-lg border-r border-[#1E293B]`}
    >
      <div className="flex flex-col h-full max-h-screen overflow-hidden">
        {/* In collapsed mode, show the vertical bar with buttons - DESKTOP ONLY */}
        {!isOpen && (
          <div className="flex flex-col items-center space-y-5 pt-6">
            {/* First button: Expand sidebar */}
            <button 
              ref={toggleBtnRef}
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10 bg-[#111827] rounded-md text-gray-400 hover:bg-[#1E293B] hover:text-gray-300 transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronRightIcon size={20} />
            </button>
            
            {/* Second button: New chat */}
            <button
              onClick={handleCreateNewChat}
              className="flex items-center justify-center w-10 h-10 bg-[#111827] rounded-md text-gray-400 hover:bg-[#1E293B] hover:text-gray-300 transition-colors"
              aria-label="New chat"
            >
              <PlusIcon size={20} />
            </button>
          </div>
        )}

        {/* Content visible only when expanded */}
        {isOpen && (
          <>
            {/* Search input at top */}
            <div className="p-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full pl-10 pr-12 py-2 bg-[#111827] border border-[#2D3748] rounded-md text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500">
                  /
                </div>
              </div>
            </div>
            
            {/* Navigation menu */}
            <div className="px-3 py-2">
              <nav className="space-y-1">
                <button
                  onClick={handleCreateNewChat}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-300 hover:text-white hover:bg-[#111827] hover:shadow-[0_0_10px_rgba(79,70,229,0.1)] transition-all duration-200"
                >
                  <PlusIcon size={18} className="text-gray-400" />
                  <span className="text-sm">New Chat</span>
                </button>
              </nav>
            </div>
            
            <div className="mt-2 px-3 py-2">
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">Recent Chats</h2>
              <div className="flex-1 overflow-y-auto pt-2 scrollbar-thin">
                {filteredChats.length === 0 ? (
                  <div className="text-sm text-gray-500 px-2 py-4 text-center">
                    {searchQuery ? "No chats found" : "No chats yet"}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm cursor-pointer transition-all duration-200 ${
                          currentChat?.id === chat.id
                            ? "bg-[#1E293B] text-white shadow-[0_0_15px_rgba(79,70,229,0.15)]"
                            : "text-gray-300 hover:bg-[#111827] hover:shadow-[0_0_10px_rgba(79,70,229,0.1)]"
                        }`}
                        onClick={() => handleChatClick(chat)}
                      >
                        <MessageSquareIcon
                          size={16}
                          className="shrink-0 text-gray-400"
                        />
                        <div className="truncate flex-1">{chat.title || "New Chat"}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-gray-400 hover:bg-[#2D3748] hover:text-gray-300 transition-opacity"
                          aria-label="Delete chat"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto p-4 border-t border-[#1E293B] shrink-0">
              <div className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-[#111827] cursor-pointer transition-colors">
                <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold">V</span>
                </div>
                <div className="text-sm truncate">Vidion AI</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 