import React, { useRef, useEffect } from "react";
import { useChat } from "../contexts/ChatContext";
import { Chat } from "../types/chat";
import { formatDistanceToNow } from "date-fns";
import { PlusIcon, MessageSquareIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, Menu } from "lucide-react";
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
      className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-[#0D1117] to-[#0f1624] transform transition-all duration-300 ease-in-out 
        ${isOpen 
          ? "translate-x-0 w-[280px] sm:w-[300px]" 
          : "translate-x-[-100%] lg:translate-x-0 w-[70px]"
        } 
        ${!isOpen && "lg:flex hidden"}
        h-full flex flex-col shadow-xl border-r border-[#1d2a45] backdrop-blur-sm`}
    >
      <div className="flex flex-col h-full max-h-screen overflow-hidden">
        {/* In collapsed mode, show the vertical bar with buttons - DESKTOP ONLY */}
        {!isOpen && (
          <div className="flex flex-col items-center space-y-5 pt-6">
            {/* First button: Expand sidebar */}
            <button 
              ref={toggleBtnRef}
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10 bg-[#131b2e] rounded-md text-gray-400 hover:bg-[#1d2a45] hover:text-gray-300 transition-colors shadow-md shadow-black/10"
              aria-label="Expand sidebar"
            >
              <ChevronRightIcon size={20} />
            </button>
            
            {/* Second button: New chat */}
            <button
              onClick={handleCreateNewChat}
              className="flex items-center justify-center w-10 h-10 bg-[#131b2e] rounded-md text-gray-400 hover:bg-[#1d2a45] hover:text-gray-300 transition-colors shadow-md shadow-black/10"
              aria-label="New chat"
            >
              <PlusIcon size={20} />
            </button>
          </div>
        )}

        {/* Content visible only when expanded */}
        {isOpen && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-[#1d2a45]">
              <h1 className="text-lg font-semibold text-white">Chats</h1>
              <button 
                ref={toggleBtnRef}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:bg-[#131b2e] hover:text-gray-300 transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronLeftIcon size={18} />
              </button>
            </div>
            
            <div className="p-4 shrink-0">
              <button
                onClick={handleCreateNewChat}
                className="w-full flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 py-2.5 text-sm transition-all shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30"
              >
                <PlusIcon size={16} className="text-white" />
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
                      className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm cursor-pointer transition-all hover-card ${
                        currentChat?.id === chat.id
                          ? "bg-[#1d2a45] text-white shadow-md shadow-black/10"
                          : "text-gray-300 hover:bg-[#131b2e]"
                      }`}
                      onClick={() => handleChatClick(chat)}
                    >
                      <div className={`shrink-0 rounded-full w-6 h-6 flex items-center justify-center ${
                        currentChat?.id === chat.id
                          ? "bg-gradient-to-br from-indigo-500/20 to-violet-600/10 ring-1 ring-indigo-500/20"
                          : "bg-[#131b2e]"
                      }`}>
                        <MessageSquareIcon
                          size={14}
                          className={`${
                            currentChat?.id === chat.id
                              ? "text-indigo-400"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="truncate flex-1">{chat.title || "New Chat"}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-gray-400 hover:bg-[#2D3748] hover:text-gray-300 transition-all"
                        aria-label="Delete chat"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#1d2a45] mt-auto shrink-0">
              <div className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-[#131b2e] cursor-pointer transition-all hover-card">
                <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
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