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
import { Message, MessageRole, Model, AVAILABLE_MODELS } from "@/types/chat";

// Helper function to read file contents as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        // For certain file types, limit the content length
        let content = event.target.result as string;
        
        // Limit content size for large files (e.g., 100KB max)
        const MAX_CONTENT_SIZE = 100 * 1024; // 100KB
        if (content.length > MAX_CONTENT_SIZE) {
          content = content.substring(0, MAX_CONTENT_SIZE) + "... [Content truncated due to size]";
        }
        
        resolve(content);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    
    // Read text files as text, others as data URLs
    if (file.type === "text/plain" || file.type.startsWith("text/")) {
      reader.readAsText(file);
    } else if (file.type === "application/pdf") {
      // For PDFs, we might just indicate it's a PDF rather than trying to extract text
      resolve(`[PDF Document: ${file.name}]`);
    } else if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    } else {
      // For unsupported types, just return file info
      resolve(`[Unsupported file type: ${file.type}]`);
    }
  });
};

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

  // Helper to get model by override key
  const getModelByOverride = (override?: string): Model => {
    // For search functionality, use Perplexity Sonar Pro
    if (override === 'perplexity' || override === 'search') {
      return AVAILABLE_MODELS.find(m => m.id === 'openrouter-sonar') || model;
    }
    
    // For reasoning, use Llama
    if (override === 'groq-llama3' || override === 'reason') {
      return AVAILABLE_MODELS.find(m => m.id === 'groq-llama3-8b') || model;
    }
    
    // Default to Mercury for deep research or no override
    if (override === 'mercury' || override === 'research' || !override) {
      return AVAILABLE_MODELS.find(m => m.id === 'openrouter-mercury') || model;
    }
    
    // If user has manually selected a model, respect that choice
    return model;
  };

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

  // Accept modelOverride from ChatInput
  const sendMessage = async (content: string, modelOverride?: string, files?: File[]) => {
    if (!currentChat) {
      toast.error("No active chat", {
        description: "Please create a new chat first"
      });
      return;
    }
    const selectedModel = getModelByOverride(modelOverride);
    setModel(selectedModel);
    
    try {
      // Add user message with file info if provided
      let messageContent = content;
      
      // If files are attached, add file info to the message
      if (files && files.length > 0) {
        // Create a message that includes file information
        const fileInfo = files.map(file => `[File: ${file.name}, Type: ${file.type}, Size: ${(file.size / 1024).toFixed(1)} KB]`).join("\n");
        
        // If there's a text message, combine it with file info
        if (content.trim()) {
          messageContent = `${content}\n\nAttached files:\n${fileInfo}`;
        } else {
          messageContent = `Attached files:\n${fileInfo}`;
        }
      }
      
      const userMessage: Message = { 
        role: "user" as MessageRole, 
        content: messageContent,
        timestamp: Date.now(),
        id: `user-${Date.now()}`
      };
      addMessageToChat(currentChat.id, userMessage);
      
      setIsLoading(true);
      setError(null);
      
      // Log the current model being used
      console.log("Sending message using model:", selectedModel.name);

      // Process files if any
      let fileContents: string[] = [];
      if (files && files.length > 0) {
        // Read file contents
        fileContents = await Promise.all(
          files.map(async (file) => {
            // For text files, read as text
            if (file.type === "text/plain" || file.type === "application/pdf" || file.type.startsWith("text/")) {
              return await readFileAsText(file);
            }
            // For images, we indicate that it's an image but don't include the binary data
            else if (file.type.startsWith("image/")) {
              return `[Image file: ${file.name}, Type: ${file.type}]`;
            }
            // For other file types
            return `[Unsupported file: ${file.name}, Type: ${file.type}]`;
          })
        );
      }

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
   
3. MEMORY:
   - IMPORTANT: Remember all previous messages in the conversation
   - Refer back to earlier questions and your answers as needed
   - Keep previous context in mind when responding to new questions
   - If the user refers to something mentioned earlier, understand and acknowledge it
   - Build upon previous exchanges to provide more personalized responses

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
      if (selectedModel.provider === "groq") {
        // Groq API
        const apiKey = import.meta.env.VITE_GROQ_API_KEY || "your-groq-api-key-here";
        requestHeaders = {
          ...requestHeaders,
          "Authorization": `Bearer ${apiKey}`
        };
        
        // If files are present, add their contents to the system message
        let enhancedSystemMessage = systemMessage;
        if (files && files.length > 0 && fileContents.length > 0) {
          enhancedSystemMessage = {
            ...systemMessage,
            content: `${systemMessage.content}\n\nThe user has attached the following files. Process these files and respond to the user's query:\n${fileContents.join("\n\n")}`
          };
        }
        
        requestBody = {
          model: selectedModel.modelId,
          messages: [
            enhancedSystemMessage,
            ...currentChat.messages.filter(msg => msg.role !== "system"),
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 1000
        };
      } else {
        // OpenRouter API
        // Use environment variable for API key
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "your-openrouter-api-key-here";
        console.log("Using OpenRouter with API key:", apiKey.substring(0, 10) + "...");
        requestHeaders = {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "vidionai.vercel.app", // Your approved domain
          "X-Title": "Vidion AI",
          "Content-Type": "application/json"
        };
        
        // If files are present, add their contents to the system message
        let enhancedSystemMessage = systemMessage;
        
        // Add thinking instructions for models that support it
        if (selectedModel.id === "openrouter-sonar" || selectedModel.modelId.includes("perplexity")) {
          enhancedSystemMessage = {
            ...systemMessage,
            content: `${systemMessage.content}\n\nIMPORTANT: Please provide your reasoning/thinking in a separate thinking section. Begin a separate paragraph with "THINKING:" to show your reasoning process. This thinking will be displayed in a collapsible section in the UI.`
          };
        }
        
        if (files && files.length > 0 && fileContents.length > 0) {
          enhancedSystemMessage = {
            ...enhancedSystemMessage,
            content: `${enhancedSystemMessage.content}\n\nThe user has attached the following files. Process these files and respond to the user's query:\n${fileContents.join("\n\n")}`
          };
        }
        
        // Use default safe settings for most models
        let temperature = 0.3;
        let maxTokens = 750;
        
        requestBody = {
          model: selectedModel.modelId,
          messages: [
            enhancedSystemMessage,
            ...currentChat.messages.filter(msg => msg.role !== "system"),
            userMessage
          ],
          temperature: temperature,
          max_tokens: maxTokens
        };
        
        console.log("Sending OpenRouter request:", {
          endpoint: selectedModel.apiEndpoint,
          model: selectedModel.modelId,
          headers: Object.keys(requestHeaders),
          body: JSON.stringify(requestBody).substring(0, 200) + "..."
        });
      }

      console.log("Sending request to API:", selectedModel.apiEndpoint);
      
      try {
        // Add timeout handling for API calls
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // Increased timeout to 20s
        
        let response;
        try {
          response = await fetch(selectedModel.apiEndpoint, {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(requestBody),
            signal: controller.signal
          });
        } catch (err: any) {
          if (err.name === "AbortError") {
            throw new Error("Request timed out after 20 seconds");
          }
          throw err;
        } finally {
          clearTimeout(timeoutId);
        }

        console.log("API response status:", response.status);
        
        if (!response.ok) {
          let errorMessage = `Failed to get response from ${selectedModel.name} (Status: ${response.status})`;
          try {
            const errorData = await response.json();
            console.error("API error data:", errorData);
            errorMessage = errorData.error?.message || errorData.message || errorMessage;
            
            // Check for common OpenRouter auth errors
            if (response.status === 401 || response.status === 403) {
              errorMessage = "Authentication error with OpenRouter API. Please check your API key.";
              console.error("OpenRouter authentication failed. Check API key or subscription.");
            }
            
            // Check for rate limiting or quota errors
            if (response.status === 429) {
              errorMessage = "Rate limit or quota exceeded on OpenRouter. Check your subscription limits.";
            }
            
            // Check for invalid model ID and try to automatically switch to a fallback model
            const invalidModelPattern = /is not a valid model ID|model .* not found|unknown model|invalid model/i;
            if (invalidModelPattern.test(errorMessage)) {
              console.log("Invalid model detected. Attempting to fall back to another model...");
              console.error("Model error details:", {
                modelId: selectedModel.modelId,
                modelName: selectedModel.name,
                provider: selectedModel.provider,
                errorMessage
              });
              
              // Try to find a working model from available models
              // First try Llama as it's most reliable
              const llamaModel = AVAILABLE_MODELS.find(m => m.id === "groq-llama3-8b");
              if (llamaModel && llamaModel.id !== selectedModel.id) {
                console.log("Falling back to Llama model");
                setModel(llamaModel);
                throw new Error(`Model ${selectedModel.modelId} is not available. Switched to Llama model. Please try again.`);
              }
              
              // If Llama was the one that failed or is not available, try Sonar
              const sonarModel = AVAILABLE_MODELS.find(m => m.id === "openrouter-sonar");
              if (sonarModel && sonarModel.id !== selectedModel.id) {
                console.log("Falling back to Sonar model");
                setModel(sonarModel);
                throw new Error(`Model ${selectedModel.modelId} is not available. Switched to Sonar model. Please try again.`);
              }
              
              // If both failed, try Mercury
              const mercuryModel = AVAILABLE_MODELS.find(m => m.id === "openrouter-mercury");
              if (mercuryModel && mercuryModel.id !== selectedModel.id) {
                console.log("Falling back to Mercury model");
                setModel(mercuryModel);
                throw new Error(`Model ${selectedModel.modelId} is not available. Switched to Mercury model. Please try again.`);
              }
            }
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
        console.log("API response data (FULL):", JSON.stringify(data));
        console.log("API response data:", JSON.stringify(data).substring(0, 200) + "...");
        
        // If we see a user ID pattern in OpenRouter response, it's likely an auth issue
        if (typeof data === "string" && data.startsWith("user_")) {
          console.error("OpenRouter returned a user ID instead of content. Authentication issue detected.");
          throw new Error("Authentication issue with OpenRouter. Please refresh your API key.");
        }
        
        let responseContent = "";
        let thinkingContent = ""; // Add variable to capture thinking content
        
        // Handle different response formats based on the model provider
        if (data.choices && Array.isArray(data.choices)) {
          // Standard OpenAI-like format (Groq and some OpenRouter models)
          const choice = data.choices[0];
          
          // Check for content in message
          if (choice.message && choice.message.content) {
            responseContent = choice.message.content;
            console.log("Using standard message.content format");
            
            // Extract thinking content using pattern matching
            const thinkingPattern = /\n\s*THINKING:\s*([\s\S]+?)(?=\n\s*[A-Z]+:|\n\s*$|$)/i;
            const match = responseContent.match(thinkingPattern);
            
            if (match && match[1]) {
              console.log("Extracted thinking content using pattern matching:", match[1].substring(0, 100) + "...");
              thinkingContent = match[1].trim();
              
              // Remove thinking section from main response
              responseContent = responseContent.replace(thinkingPattern, '').trim();
            }
          } 
          // Check for deltas (streaming)
          else if (choice.delta && choice.delta.content) {
            responseContent = choice.delta.content;
            console.log("Using delta.content format");
          }
          
          // Extract thinking content from model providers that support it (like Perplexity Sonar)
          if (!thinkingContent && (selectedModel.id === "openrouter-sonar" || selectedModel.modelId.includes("perplexity"))) {
            // Check for thinking in standard location
            if (choice.message && choice.message.thinking) {
              thinkingContent = choice.message.thinking;
              console.log("Found thinking content in message.thinking:", thinkingContent.substring(0, 100) + "...");
            }
            // Check for thinking in auxiliary_messages
            else if (data.auxiliary_messages && Array.isArray(data.auxiliary_messages)) {
              const thinkingMessage = data.auxiliary_messages.find(
                (msg: any) => msg.role === "thinking" || msg.type === "thinking"
              );
              if (thinkingMessage && thinkingMessage.content) {
                thinkingContent = thinkingMessage.content;
                console.log("Found thinking content in auxiliary_messages:", thinkingContent.substring(0, 100) + "...");
              }
            }
            // Check for thinking in OpenRouter-specific format
            else if (data.thinking || data.thinking_content) {
              thinkingContent = data.thinking || data.thinking_content;
              console.log("Found thinking content in top-level thinking field:", thinkingContent.substring(0, 100) + "...");
            }
            // Check choice for tool_calls that might contain thinking
            else if (choice.message && choice.message.tool_calls && Array.isArray(choice.message.tool_calls)) {
              const thinkingTool = choice.message.tool_calls.find(
                (tool: any) => tool.function && tool.function.name === "thinking"
              );
              if (thinkingTool && thinkingTool.function && thinkingTool.function.arguments) {
                try {
                  const args = JSON.parse(thinkingTool.function.arguments);
                  thinkingContent = args.thinking || args.content;
                  console.log("Found thinking content in tool_calls:", thinkingContent.substring(0, 100) + "...");
                } catch (e) {
                  console.error("Error parsing thinking tool arguments:", e);
                }
              }
            }
          }
        }
        // OpenRouter sometimes uses a different response format
        else if (data.output && typeof data.output === 'string') {
          responseContent = data.output;
          console.log("Using output field format");
          
          // Check for thinking in separate fields
          if (data.thinking || data.thinking_output) {
            thinkingContent = data.thinking || data.thinking_output;
          }
        } else if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          // Try to parse results array format
          const result = data.results[0];
          if (result.text) {
            responseContent = result.text;
            console.log("Using results[0].text format");
          } else if (result.content) {
            responseContent = result.content;
            console.log("Using results[0].content format");
          }
          
          // Check for thinking in result
          if (result.thinking) {
            thinkingContent = result.thinking;
          }
        } else {
          // Loop through known response formats
          ['completion', 'message', 'generated_text', 'text'].forEach(key => {
            if (!responseContent && data[key]) {
              if (typeof data[key] === 'string') {
                responseContent = data[key];
                console.log(`Using ${key} field format`);
              } else if (typeof data[key] === 'object') {
                if (data[key].content) {
                  responseContent = data[key].content;
                  console.log(`Using ${key}.content format`);
                }
                if (data[key].thinking) {
                  thinkingContent = data[key].thinking;
                }
              }
            }
          });
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
          content: responseContent,
          thinking: thinkingContent || "This is manually added thinking content for testing. The model should show its reasoning process here, but it appears the thinking content wasn't properly extracted from the API response. Let me know if you're looking for a specific model that supports the thinking feature.", // Add thinking content to message or fallback test content
          timestamp: Date.now(),
          id: `assistant-${Date.now()}`
        };
        addMessageToChat(currentChat.id, assistantResponseMessage);
      } catch (apiError) {
        console.error("API request error:", apiError);
        throw apiError;
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      
      // Create a more descriptive error message with guidance
      let errorContent = `Sorry, I encountered an error: ${err instanceof Error ? err.message : "Unknown error"}.`;
      
      // Add helpful guidance based on error type
      if (err instanceof Error) {
        const errorMsg = err.message.toLowerCase();
        
        if (errorMsg.includes("api key") || errorMsg.includes("authentication")) {
          errorContent += "\n\nThis appears to be an authentication issue. The OpenRouter API key may be invalid or expired. Please update the API key in the application.";
        } 
        else if (errorMsg.includes("model") && (errorMsg.includes("not valid") || errorMsg.includes("not available"))) {
          errorContent += "\n\nThis appears to be an issue with the selected model. I've tried to switch to a more reliable model. Please try sending your message again.";
        }
        else if (errorMsg.includes("rate limit") || errorMsg.includes("quota")) {
          errorContent += "\n\nYour OpenRouter account may have reached its rate limit or quota. Please try again later or switch to another model provider.";
        }
      }
      
      // Add a user-friendly error message to the chat
      const errorMessage: Message = {
        role: "assistant" as MessageRole,
        content: errorContent,
        timestamp: Date.now(),
        id: `error-${Date.now()}`
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
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-b from-[#070b14] to-[#0c1221]">
      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
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
        <header className="shrink-0 border-b border-[#1d2a45] bg-[#0D1117]/80 backdrop-blur-md sticky top-0 z-10 shadow-md shadow-black/5">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-md h-10 w-10 text-gray-300 hover:bg-[#1d2a45] lg:hidden flex items-center justify-center border border-[#1d2a45] bg-[#131b2e] transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
              <div className="text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Vidion AI</div>
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
                className="rounded-md h-9 w-9 border-[#1d2a45] bg-[#131b2e] text-gray-300 hover:bg-[#1d2a45] hidden sm:flex transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="sr-only">New chat</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main chat area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {currentChat ? (
            messages.length > 0 ? (
              <div className="mx-auto max-w-3xl">
                {messages.map((message, i) => (
                  <ChatMessage
                    key={i}
                    role={message.role}
                    content={message.content}
                    thinking={message.thinking}
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
                <div className="max-w-md mx-auto text-center space-y-6 scale-in">
                  <div className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600/20 to-violet-600/10 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5">
                      <Image className="h-10 w-10 text-indigo-400" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h1 className="text-xl font-semibold sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                      Welcome to Vidion AI
                    </h1>
                    <p className="text-gray-300">
                      Start a conversation, ask questions, or get assistance with your tasks.
                    </p>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] px-4">
              <div className="max-w-md mx-auto text-center space-y-6 scale-in">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600/20 to-violet-600/10 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5">
                    <BarChart2 className="h-10 w-10 text-indigo-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-xl font-semibold sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                    No active chat
                  </h1>
                  <p className="text-gray-300">
                    Create a new chat to get started.
                  </p>
                  <Button 
                    onClick={handleCreateNewChat} 
                    className="mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-0 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Chat
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Input area - footer */}
        <footer className="shrink-0 border-t border-[#1d2a45] bg-[#0D1117]/80 backdrop-blur-md sticky bottom-0 w-full z-10 py-4 px-4 sm:px-6 shadow-md shadow-black/5">
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