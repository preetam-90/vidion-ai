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

  return (
    <div
      ref={sidebarRef}
      className={`fixed lg:relative inset-y-0 left-0 z-50 bg-[#0D1117] transform transition-all duration-300 ease-in-out ${
        isOpen 
          ? "translate-x-0 w-[280px] sm:w-[300px]" 
          : "translate-x-0 w-[50px] sm:w-[60px]"
      } ${isOpen ? 'lg:w-[300px]' : 'lg:w-[70px]'} h-full flex flex-col shadow-lg border-r border-[#1E293B]`}
    >
      <div className="flex flex-col h-full max-h-screen overflow-hidden">
        {/* In collapsed mode, show the vertical bar with buttons */}
        {!isOpen && (
          <div className="flex flex-col items-center space-y-5 pt-6">
            {/* First button: Expand sidebar */}
            <button 
              ref={toggleBtnRef}
              onClick={() => setIsOpen(!isOpen)}
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
            <div className="flex items-center justify-between p-4 border-b border-[#1E293B]">
              <h1 className="text-lg font-semibold text-white">Chats</h1>
              <button 
                ref={toggleBtnRef}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:bg-[#111827] hover:text-gray-300 transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronLeftIcon size={18} />
              </button>
            </div>
            
            <div className="p-4 shrink-0">
              <button
                onClick={handleCreateNewChat}
                className="w-full flex items-center gap-2 rounded-md border border-[#2D3748] text-white px-4 py-2.5 text-sm hover:bg-[#111827] transition-colors"
              >
                <PlusIcon size={16} className="text-gray-400" />
                <span>New chat</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pt-2 px-3 scrollbar-thin">
              {chats.length === 0 ? (
                <div className="text-sm text-gray-500 px-2 py-4 text-center">
                  No chats yet
                </div>
              ) : (
                <div className="space-y-1.5">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                        currentChat?.id === chat.id
                          ? "bg-[#1E293B] text-white"
                          : "text-gray-300 hover:bg-[#111827]"
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

            <div className="p-4 border-t border-[#1E293B] mt-auto shrink-0">
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