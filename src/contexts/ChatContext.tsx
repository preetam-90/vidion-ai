import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
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
  updateChatMessages: (
    chatId: string,
    messagesOrUpdater: Message[] | ((prevMessages: Message[]) => Message[])
  ) => void;
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

  // Stabilize createNewChat with useCallback
  const createNewChat = useCallback(() => {
    // Check if there's an empty chat (only has system message or no user messages)
    // Note: hasEmptyChat logic needs to be careful if it depends on currentChat state that might be stale here
    // For initial load, it might be simpler to always create a new one if no chats are loaded.
    // However, the existing logic is: if (hasEmptyChat() && currentChat) { return currentChat; }
    // This part of hasEmptyChat will be called with the currentChat from the closure of createNewChat.

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
    
    setChats((prevChats) => {
      // Avoid returning currentChat directly if it was an empty one, 
      // as it might not be in prevChats if logic changes. Better to find and return or add new.
      // The original logic was: if (hasEmptyChat() && currentChat) { setCurrentChatState(currentChat); return currentChat; }
      // but hasEmptyChat was defined outside useCallback and would be stale.
      // Let's refine the condition for not creating a new chat if an empty one (current) exists.
      // This check should ideally be done before calling createNewChat in useEffect.
      // For now, we just add the newChat and set it as current.
      const existingEmptyChat = prevChats.find(c => c.id === currentChat?.id && c.messages.length <=1 && !c.messages.some(m => m.role === 'user'));
      if (existingEmptyChat) {
         setCurrentChatState(existingEmptyChat);
         return prevChats; // Don't add a duplicate if we are reusing current an empty chat
      }

      return [newChat, ...prevChats];
    });
    setCurrentChatState(newChat);
    return newChat;
  // Add dependencies for useCallback. Since hasEmptyChat is not memoized and uses currentChat,
  // this could still cause issues if currentChat changes and createNewChat is called.  
  // For the initial load useEffect, this specific createNewChat is called when chats are empty.
  }, [currentChat]); // Dependency on currentChat for the hasEmptyChat logic inside (if it were fully implemented here)

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
          const chatToSet = currentChatId ? parsedChats.find((c: Chat) => c.id === currentChatId) : null;
          setCurrentChatState(chatToSet || parsedChats[0]);
        } else {
          createNewChat();
        }
      } catch (error) {
        console.error("Error parsing saved chats:", error);
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, [createNewChat]); // Added createNewChat to dependencies

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
  
  // Redefine hasEmptyChat to be stable or ensure its dependencies are correctly handled if used by useCallback.
  // For now, the createNewChat logic was simplified to not directly call the outer hasEmptyChat to avoid staleness within its direct execution.
  // The hasEmptyChat function itself, as defined in the provider scope, will use the latest currentChat when called from other parts of the component.

  const hasEmptyChat = useCallback(() => {
    if (!currentChat) return false;
    
    // Check if the current chat exists in the chats array
    const chatExists = chats.some(chat => chat.id === currentChat.id);
    if (!chatExists) return false;
    
    // Check if current chat is empty (only has system message or no user messages)
    if (currentChat.messages.length <= 1) return true;
    
    // Check if current chat has any user messages
    const hasUserMessages = currentChat.messages.some(msg => msg.role === "user");
    return !hasUserMessages;
  }, [currentChat, chats]);

  // Make sure createNewChat uses the memoized hasEmptyChat or incorporates the logic safely
  // Revisiting createNewChat to use the memoized hasEmptyChat
  const createNewChatStable = useCallback(() => {
    if (hasEmptyChat() && currentChat) { // hasEmptyChat is now stable and uses latest currentChat
      // Make sure to set the current chat as active
      setCurrentChatState(currentChat);
      return currentChat;
    }
    
    const newChatData: Chat = {
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
    setChats((prevChats) => [newChatData, ...prevChats]);
    setCurrentChatState(newChatData);
    return newChatData;
  }, [currentChat, hasEmptyChat]); // Added hasEmptyChat as dependency

  // useEffect for initial load should use createNewChatStable
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
          const chatToSet = currentChatId ? parsedChats.find((c: Chat) => c.id === currentChatId) : null;
          setCurrentChatState(chatToSet || parsedChats[0]);
        } else {
          createNewChatStable(); // Use stable version
        }
      } catch (error) {
        console.error("Error parsing saved chats:", error);
        createNewChatStable(); // Use stable version
      }
    } else {
      createNewChatStable(); // Use stable version
    }
  }, [createNewChatStable]);

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

  const updateChatMessages = (
    chatId: string,
    messagesOrUpdater: Message[] | ((prevMessages: Message[]) => Message[])
  ) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.id === chatId) {
          const newMessages = 
            typeof messagesOrUpdater === 'function'
              ? messagesOrUpdater(chat.messages)
              : messagesOrUpdater;
          const updatedChat = {
            ...chat,
            messages: newMessages,
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
        createNewChat: createNewChatStable, // Expose the stable version
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