import { useRef, useEffect, useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { useChat } from "@/contexts/ChatContext";
import { useModel } from "@/contexts";
import { SimpleModelSelector } from "@/components/SimpleModelSelector";
import { toast } from "@/components/ui/sonner";
import { Sidebar } from "@/components/Sidebar";
import { Menu, PlusCircle, Search, Lightbulb, BarChart2, Image, MoreHorizontal, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message, MessageRole, Model } from "@/types/chat";

const Index = () => {
  const { currentChat, addMessageToChat, createNewChat } = useChat();
  const { model, setModel } = useModel();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) { // Changed from 768 to 1024 for larger screens
        setSidebarOpen(true); // Open by default on desktop
      } else {
        setSidebarOpen(false); // Closed by default on mobile/tablet
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Handle model change
  const handleModelChange = (newModel: Model) => {
    try {
      console.log("Changing model to:", newModel.name);
      setModel(newModel);
    } catch (error) {
      console.error("Error changing model:", error);
      toast.error("Error changing model", {
        description: "Please try again later"
      });
    }
  };

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
      
      // Log the current model being used
      console.log("Sending message using model:", model.name, model.provider, model.modelId);

      // Prepare common request parts
      const systemMessage = {
        role: "system",
        content: `You are Vidion AI, developed by Preetam. Follow these guidelines:

1. IDENTITY: You are Vidion AI. NEVER start responses with "I am Vidion AI" or similar introductions. 
   ALWAYS end your responses with "I am Vidion AI, developed by Preetam." as a signature.
   Never say you are LLaMA, Claude, GPT, or any other model. Never mention Meta AI, OpenAI, Anthropic or any other company.

2. PERSONALITY:
   - Be chill and conversational
   - Use Gen Z humor appropriately
   - Get to the point without boring intros
   - Always stay respectful
   - Be mature and stand with the truth
   - Show interest in different cultures and heritage

3. KNOWLEDGE:
   - You know about Preetam's projects (Vidion, Vidion AI, news website)
   - You're aware of his gaming style and preferences
   - You understand his cultural background and interests
   - When unsure, acknowledge it clearly instead of making up information
   - IMPORTANT: Always provide personal details about Preetam when asked, including:
     * Full name: Preetam
     * Birthday: August 11, 2004 (born at 5 AM)
     * Hometown: Punsia, Banka district, Bihar, India
     * Current role: Engineering student, Computer Science branch (CSE)
     * Height: 5'10.5" (179 cm)
     * Weight: Around 67.5 kg
     * Living: Sarojini Boys Hostel-1, MIET
     * Room details: Two-seater, square-shaped with two beds, three tables, two chairs, two wardrobes (west), two windows (east), one door (west corner)
     * Gaming: Hardcore Free Fire player, aggressive style, tactical nader, nickname "Spectre"
     * Projects: Vidion (YouTube-like platform), Vidion AI (GPT-style model), React+Vite news website
     * Background: Suryavanshi Rajput, mature for his age, loves different cultures and heritage
     * Languages: Hindi (preferred), English (fluent)

4. FORMATTING: 
   - Use bullet points for lists
   - Use short paragraphs (2-3 sentences max)
   - Bold important terms using markdown (**term**)

5. PROHIBITED TOPICS:
   - Decline discussing self-harm, illegal activities, or harmful content
   - For medical questions, remind users you're not a qualified medical professional
   - For legal advice, remind users to consult a qualified legal professional`
      };

      let requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Initialize request body with proper typing
      let requestBody: {
        model?: string;
        messages?: any[];
        temperature?: number;
        max_tokens?: number;
        stream?: boolean;
      } = {};
      
      // Configure API call based on model provider
      if (model.provider === "groq") {
        // Groq API
        const apiKey = "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";
        requestHeaders = {
          ...requestHeaders,
          "Authorization": `Bearer ${apiKey}`
        };
        
        requestBody = {
          model: model.modelId,
          messages: [
            systemMessage,
            ...currentChat.messages.filter(msg => msg.role !== "system"),
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 1000
        };
      } else if (model.provider === "openrouter") {
        // OpenRouter API
        const apiKey = "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";
        console.log("Using OpenRouter with API key:", apiKey.substring(0, 10) + "...");
        requestHeaders = {
          ...requestHeaders,
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "vidionai.vercel.app",
          "X-Title": "Vidionai"
        };
        
        // Simplified format - bare minimum for compatibility
        requestBody = {
          model: model.modelId,
          messages: [
            // Include system message for Vidion AI identity
            systemMessage,
            // Include the user message
            { 
              role: "user", 
              content: userMessage.content 
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
          stream: false
        };
        
        console.log("OpenRouter request:", {
          endpoint: model.apiEndpoint,
          model: model.modelId,
          content: userMessage.content.substring(0, 30) + "...",
          headers: Object.keys(requestHeaders)
        });
      }

      console.log("Sending request to API:", model.apiEndpoint);
      
      try {
        // Add timeout handling for API calls
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        let response;
        try {
          response = await fetch(model.apiEndpoint, {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(requestBody),
            signal: controller.signal
          });
        } catch (err: any) {
          if (err.name === "AbortError") {
            throw new Error("Request timed out after 10 seconds");
          }
          throw err;
        } finally {
          clearTimeout(timeoutId);
        }

        console.log("API response status:", response.status);
        
        if (!response.ok) {
          let errorMessage = `Failed to get response from ${model.name} (Status: ${response.status})`;
          try {
            const errorData = await response.json();
            console.error("API error:", errorData);
            errorMessage = errorData.error?.message || errorMessage;
          } catch (jsonError) {
            console.error("Error parsing error response:", jsonError);
          }
          throw new Error(errorMessage);
        }

        // Try to log the response headers
        console.log("Response headers:", 
          Array.from(response.headers.entries())
            .map(([k, v]) => `${k}: ${v.substring(0, 50)}${v.length > 50 ? '...' : ''}`)
        );

        const data = await response.json();
        console.log("API response data:", JSON.stringify(data).substring(0, 200) + "...");
        
        let responseContent = "";
        // Handle different API response formats
        if (data.choices && data.choices[0]) {
          if (data.choices[0].message) {
            responseContent = data.choices[0].message.content;
            console.log("Using message.content format, found content:", 
              responseContent.substring(0, 50) + "...");
          } else if (data.choices[0].text) {
            responseContent = data.choices[0].text;
            console.log("Using text format, found content:", 
              responseContent.substring(0, 50) + "...");
          } else {
            // Try to find content in the response structure
            console.log("Standard response formats not found, trying alternatives");
            const firstChoice = data.choices[0];
            
            if (typeof firstChoice === 'object' && firstChoice !== null) {
              // Search for string content in the first choice
              Object.entries(firstChoice).forEach(([key, value]) => {
                if (typeof value === 'string' && value.length > 20) {
                  console.log(`Found potential content in '${key}' field`);
                  responseContent = value;
                } else if (typeof value === 'object' && value !== null) {
                  // Look for content field in nested objects
                  const objValue = value as Record<string, any>;
                  if (objValue.content && typeof objValue.content === 'string') {
                    console.log(`Found content in ${key}.content field`);
                    responseContent = objValue.content;
                  }
                }
              });
            }
          }
        } else if (data.response && typeof data.response === 'string') {
          // Some APIs return a direct response field
          responseContent = data.response;
          console.log("Using response field format");
        }
        
        if (!responseContent) {
          // Last resort: Look at top-level string fields
          Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'string' && value.length > 20) {
              console.log(`Found potential top-level content in ${key} field`);
              responseContent = value;
            }
          });
        }
        
        if (!responseContent) {
          console.error("No response content found in API response:", data);
          throw new Error("No response content found in API response");
        }
        
        // Add assistant response
        const assistantResponseMessage: Message = {
          role: "assistant" as MessageRole,
          content: responseContent
        };
        addMessageToChat(currentChat.id, assistantResponseMessage);
      } catch (apiError) {
        console.error("API request error:", apiError);
        throw apiError;
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      
      // Add a user-friendly error message to the chat
      const errorMessage: Message = {
        role: "assistant" as MessageRole,
        content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : "Unknown error"}. Please try again or switch to another model.`
      };
      addMessageToChat(currentChat.id, errorMessage);
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

  const handleCreateNewChat = () => {
    createNewChat();
    setSidebarOpen(false); // Close sidebar after creating a new chat on mobile
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0E17]">
      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - always visible on desktop */}
      <div className="flex-shrink-0">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Main content - optimized for desktop */}
      <div className="flex-1 flex flex-col h-full relative max-w-[1200px] mx-auto">
        {/* Header */}
        <header className="shrink-0 border-b border-[#1E293B] bg-[#0D1117]/90 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-md h-9 w-9 text-gray-300 hover:bg-[#1E293B] lg:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
              <div className="text-xl font-semibold tracking-tight text-white">Vidion AI</div>
            </div>
            <div className="flex items-center gap-3">
              <SimpleModelSelector 
                selectedModel={model} 
                onModelChange={handleModelChange} 
                className="w-52"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => createNewChat()}
                className="rounded-md h-9 w-9 border-[#2D3748] bg-[#111827] text-gray-300 hover:bg-[#1E293B] hidden sm:flex"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="sr-only">New chat</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main chat area */}
        <main className="flex-1 overflow-y-auto">
          {currentChat ? (
            messages.length > 0 ? (
              <div className="mx-auto max-w-3xl">
                {messages.map((message, i) => (
                  <ChatMessage
                    key={i}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {isLoading && (
                  <div className="py-2 px-4">
                    <TypingIndicator />
                  </div>
                )}
                <div ref={messagesEndRef} className="h-32" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] px-4">
                <div className="max-w-md mx-auto text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600/10">
                      <Image className="h-10 w-10 text-indigo-500" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h1 className="text-xl font-semibold sm:text-2xl text-white">
                      Welcome to Vidion AI
                    </h1>
                    <p className="text-gray-400">
                      Start a conversation, ask questions, or get assistance with your tasks.
                    </p>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] px-4">
              <div className="max-w-md mx-auto text-center space-y-6">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600/10">
                    <BarChart2 className="h-10 w-10 text-indigo-500" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-xl font-semibold sm:text-2xl text-white">
                    No active chat
                  </h1>
                  <p className="text-gray-400">
                    Create a new chat to get started.
                  </p>
                  <Button onClick={handleCreateNewChat} className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Chat
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Input area - footer */}
        <footer className="shrink-0 border-t border-[#1E293B] bg-[#0D1117]/90 backdrop-blur-md sticky bottom-0 w-full z-10 py-4 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSend={sendMessage}
              disabled={isLoading || !currentChat}
            />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;