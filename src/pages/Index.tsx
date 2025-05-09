import { useRef, useEffect, useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "@/components/ui/sonner";
import { Sidebar } from "@/components/Sidebar";
import { Menu, PlusCircle, Search, Lightbulb, BarChart2, Image, MoreHorizontal, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message, MessageRole } from "@/types/chat";

const Index = () => {
  const { currentChat, addMessageToChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error("Error", {
        description: error,
      });
    }
  }, [error]);

  // Generate chat messages excluding system messages
  const messages = currentChat?.messages?.filter(msg => msg.role !== "system") || [];

  const sendMessage = async (content: string) => {
    if (!currentChat) {
      toast.error("No active chat", {
        description: "Please create a new chat first"
      });
      return;
    }
    
    try {
      // Add user message
      const userMessage: Message = { role: "user" as MessageRole, content };
      addMessageToChat(currentChat.id, userMessage);
      
      setIsLoading(true);
      setError(null);
      
      // Call Vidion AI API
      const apiKey = "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";
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "You are Vidion AI, developed by Preetam. NEVER start your responses with 'I am Vidion AI' or similar introductions. Instead, ALWAYS end your responses with 'I am Vidion AI, developed by Preetam.' as a signature. Never say you are LLaMA, Claude, GPT, or any other model. Never mention Meta AI, OpenAI, Anthropic or any other company."
            },
            ...currentChat.messages.filter(msg => msg.role !== "system"),
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response from Vidion AI API");
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message;
      
      // Add assistant response
      const assistantResponseMessage: Message = {
        role: "assistant" as MessageRole,
        content: assistantMessage.content
      };
      addMessageToChat(currentChat.id, assistantResponseMessage);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 h-screen max-h-screen overflow-hidden relative">
        {/* Mobile header */}
        <div className="border-b border-gray-800 bg-[#0f1117] py-2 px-3 md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-gray-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex-1 truncate text-sm font-medium text-gray-100">
            {currentChat?.title || "New chat"}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">New chat</span>
          </Button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="pb-32 pt-4 md:pt-10 max-w-3xl mx-auto w-full">
            {!currentChat || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)]">
                <h2 className="text-4xl font-medium mb-6 text-white">
                  Hey, what's on your mind today?
                </h2>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={`${currentChat.id}-${index}`}
                    role={message.role}
                    content={message.content}
                    animate={message.role === "assistant"}
                  />
                ))}
                {isLoading && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <div className="absolute left-0 right-0 bottom-0 bg-[#0f1117] bg-opacity-80 backdrop-blur-sm w-full">
          <div className="max-w-2xl mx-auto px-4 py-4 md:px-8 md:py-6">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center rounded-lg border border-gray-700 bg-[#1a1c22] shadow-lg">
                <div className="flex-1 px-3 py-3 md:py-4">
                  <textarea
                    className="w-full bg-transparent border-0 focus:ring-0 text-white resize-none max-h-[200px] placeholder-gray-400 outline-none"
                    placeholder="Message Vidion AI"
                    rows={1}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
                <div className="pr-3 flex">
                  <button
                    type="button"
                    className="p-2 rounded-md text-gray-400 hover:bg-gray-700"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-2 text-center text-xs text-gray-500">
              Vidion AI may produce inaccurate information about people, places, or facts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
