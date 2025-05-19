import React, { createContext, useState, useContext, useEffect } from "react";
import { Chat, Message } from "../types/chat";
import { v4 as uuidv4 } from "uuid";

interface ChatContextProps {
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
  createNewChat: () => Chat;
  addMessageToChat: (chatId: string, message: Message) => void;
  deleteChat: (chatId: string) => void;
  hasEmptyChat: () => boolean;
  updateChatMessages: (chatId: string, messages: Message[]) => void;
}

const ChatContext = createContext<ChatContextProps>({
  chats: [],
  currentChat: null,
  setCurrentChat: () => {},
  createNewChat: () => ({} as Chat),
  addMessageToChat: () => {},
  deleteChat: () => {},
  hasEmptyChat: () => false,
  updateChatMessages: () => {}
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem("chats");
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
        }));
        
        if (parsedChats.length > 0) {
          setChats(parsedChats);
          
          const currentChatId = localStorage.getItem("currentChatId");
          if (currentChatId) {
            const chat = parsedChats.find((c: Chat) => c.id === currentChatId);
            if (chat) {
              setCurrentChatState(chat);
            } else {
              setCurrentChatState(parsedChats[0]);
            }
          } else {
            setCurrentChatState(parsedChats[0]);
          }
        } else {
          createNewChat();
        }
      } catch (error) {
        console.error("Error parsing saved chats:", error);
        createNewChat();
      }
    } else {
      // Create a new chat if no chats exist
      createNewChat();
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats]);

  // Save current chat ID to localStorage whenever it changes
  useEffect(() => {
    if (currentChat) {
      localStorage.setItem("currentChatId", currentChat.id);
    }
  }, [currentChat]);

  const setCurrentChat = (chat: Chat) => {
    setCurrentChatState(chat);
  };
  
  // Check if there's an empty chat (only has system message)
  const hasEmptyChat = () => {
    if (!currentChat) return false;
    
    // Check if current chat is empty (only has system message or no user messages)
    if (currentChat.messages.length <= 1) return true;
    
    // Check if current chat has any user messages
    const hasUserMessages = currentChat.messages.some(msg => msg.role === "user");
    if (!hasUserMessages) return true;
    
    return false;
  };

  const createNewChat = () => {
    // If there's already an empty chat, use that instead of creating a new one
    if (hasEmptyChat() && currentChat) {
      return currentChat;
    }
    
    const newChat: Chat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [
        { role: "system", content: `You are Vidion AI, an advanced assistant created by Preetam.

Your job is to provide answers that are:
- Structured
- Clean
- Markdown-formatted
- Easy to read

Formatting rules:
- Use **bold** to highlight key terms
- Use *italics* for emphasis or clarity
- Use \`inline code\` for commands or keywords
- Use bullet points \`-\` or numbered steps \`1.\` for lists
- Add \`###\` subheadings to organize long answers
- Avoid dense paragraphs; keep sentences brief and spaced
- Use horizontal lines \`---\` to separate sections (if needed)
- End with a short, friendly closing or summary line

IDENTITY: You are Vidion AI. NEVER start responses with "I am Vidion AI" or similar introductions. 
ALWAYS end your responses with "I am Vidion AI, developed by Preetam." as a signature.
Never say you are LLaMA, Claude, GPT, or any other model. Never mention Meta AI, OpenAI, Anthropic or any other company.` }
      ],
      createdAt: new Date(),
    };
    
    setChats((prevChats) => [newChat, ...prevChats]);
    setCurrentChatState(newChat);
    return newChat;
  };

  const addMessageToChat = (chatId: string, message: Message) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.id === chatId) {
          // Update chat title based on first user message if still "New Chat"
          let chatTitle = chat.title;
          if (chatTitle === "New Chat" && message.role === "user") {
            chatTitle = message.content.length > 30 
              ? `${message.content.substring(0, 30)}...` 
              : message.content;
          }
          
          const updatedChat = {
            ...chat,
            title: chatTitle,
            messages: [...chat.messages, message],
          };
          
          // Update current chat state if this is the current chat
          if (currentChat && currentChat.id === chatId) {
            setTimeout(() => setCurrentChatState(updatedChat), 0);
          }
          
          return updatedChat;
        }
        return chat;
      });
      
      return updatedChats;
    });
  };

  const deleteChat = (chatId: string) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.filter((chat) => chat.id !== chatId);
      
      // If the deleted chat was the current chat, set the first available chat as current
      if (currentChat && currentChat.id === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatState(updatedChats[0]);
        } else {
          // Create a new chat if no chats remain
          const newChat = createNewChat();
          return [newChat];
        }
      }
      
      return updatedChats;
    });
  };

  const updateChatMessages = (chatId: string, messages: Message[]) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.id === chatId) {
          const updatedChat = {
            ...chat,
            messages
          };
          
          // Update current chat state if this is the current chat
          if (currentChat && currentChat.id === chatId) {
            setTimeout(() => setCurrentChatState(updatedChat), 0);
          }
          
          return updatedChat;
        }
        return chat;
      });
      
      return updatedChats;
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        setCurrentChat,
        createNewChat,
        addMessageToChat,
        deleteChat,
        hasEmptyChat,
        updateChatMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}; 