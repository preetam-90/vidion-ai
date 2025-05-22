import { useRef, useEffect, useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { useChat } from "@/contexts/ChatContext";
import { useModel } from "@/contexts";
import { SimpleModelSelector } from "@/components/SimpleModelSelector";
import { toast } from "@/components/ui/sonner";
import { Sidebar } from "@/components/Sidebar";
import { useStreamingResponse } from "@/hooks/useStreamingResponse";
import { 
  Menu, 
  PlusCircle, 
  Search, 
  Lightbulb, 
  BarChart2, 
  Image, 
  MoreHorizontal, 
  Send, 
  ChevronRight,
  ArrowDown,
  RefreshCw,
  Paperclip,
  Smile,
  Slash,
  Check,
  Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message, MessageRole, Model } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";

// Function to clean up AI responses
const cleanupAIResponse = (text: string): string => {
  // First, extract any content that might be in the signature to preserve it
  const signatureMatch = text.match(/I am Vidion AI,?\s+developed by Preetam\.?$/i);
  let signaturePart = '';
  if (signatureMatch) {
    signaturePart = signatureMatch[0];
    text = text.replace(signaturePart, '');
  }

  // Remove citation-style references like [1], [2][3], etc.
  let cleaned = text.replace(/\[\d+\](?:\[\d+\])*/g, '');
  
  // Remove references with multiple numbers like [1][2][3]
  cleaned = cleaned.replace(/\[\d+\]\[\d+\](?:\[\d+\])*/g, '');
  
  // Remove standalone numbers in brackets at the end of sentences
  cleaned = cleaned.replace(/\s*\[\d+\]\s*\./g, '.');
  
  // Remove citation blocks at the end of the text
  cleaned = cleaned.replace(/\[\d+\]:\s*https?:\/\/[^\s]+(\s|$)/g, '');
  
  // Remove citation references with text like [citation]
  cleaned = cleaned.replace(/\[[a-zA-Z0-9]+\]/g, '');
  
  // Special handling for [n] references in text
  cleaned = cleaned.replace(/\[(\d+)\]/g, '');
  
  // Fix multiple spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
  // Fix inconsistent line breaks
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Remove any remaining citation patterns like [1][3][5]
  cleaned = cleaned.replace(/\[(\d+)\](?:\[(\d+)\])+/g, '');
  
  // Enhance formatting with emojis and better section structure
  
  // First, identify and enhance major section headers with emojis and better formatting
  cleaned = cleaned.replace(/\*\*(Ancient Bihar|Ancient History)\*\*/g, '\n🏛️ **Ancient History** - Where it all began\n');
  cleaned = cleaned.replace(/\*\*(Medieval Bihar)\*\*/g, '\n🏰 **Medieval Period** - Kingdoms & Culture\n');
  cleaned = cleaned.replace(/\*\*(Modern Bihar)\*\*/g, '\n🏙️ **Modern Era** - Colonial to Contemporary\n');
  cleaned = cleaned.replace(/\*\*(Importance of Bihar)\*\*/g, '\n✨ **Why Bihar Matters**\n');
  cleaned = cleaned.replace(/\*\*(Buddhist Heritage)\*\*/g, '\n🧘 **Religious Importance** - 4G of Dharma\n');
  cleaned = cleaned.replace(/\*\*(Ancient Cities)\*\*/g, '\n🏯 **Ancient Cities** - Timeless Heritage\n');
  cleaned = cleaned.replace(/\*\*(Literary Heritage)\*\*/g, '\n📚 **Literary Heritage** - Scholars & Texts\n');
  cleaned = cleaned.replace(/\*\*(Cultural Diversity)\*\*/g, '\n🎭 **Cultural & Linguistic Richness** - Bhojpuri se Maithili tak\n');
  cleaned = cleaned.replace(/\*\*(Economic Importance)\*\*/g, '\n📈 **Economic Importance** - Resources & Potential\n');
  cleaned = cleaned.replace(/\*\*(Freedom Struggle)\*\*/g, '\n⚔️ **Freedom Struggle** - Desh ke rebels ka adda\n');
  
  // Add emojis to bullet points for better visual appeal
  cleaned = cleaned.replace(/^(\s*)\*\s+/gm, '$1• ');
  
  // Format specific topics with emojis
  cleaned = cleaned.replace(/\b(Buddhism|Buddhist)\b/gi, '🧘 Buddhism');
  cleaned = cleaned.replace(/\b(Hinduism|Hindu)\b/gi, '🕉️ Hinduism');
  cleaned = cleaned.replace(/\b(Jainism|Jain)\b/gi, '☸️ Jainism');
  cleaned = cleaned.replace(/\b(Sikhism|Sikh)\b/gi, '☬ Sikhism');
  cleaned = cleaned.replace(/\b(Maurya|Mauryan Empire)\b/gi, '👑 Mauryan Empire');
  cleaned = cleaned.replace(/\b(Gupta Empire)\b/gi, '👑 Gupta Empire');
  cleaned = cleaned.replace(/\b(Pala Empire)\b/gi, '👑 Pala Empire');
  cleaned = cleaned.replace(/\b(Magadh|Magadha)\b/gi, '🏛️ Magadha');
  cleaned = cleaned.replace(/\b(Pataliputra|Patna)\b/gi, '🏙️ Pataliputra');
  cleaned = cleaned.replace(/\b(Nalanda|Vikramshila)\b/gi, '🎓 Nalanda');
  cleaned = cleaned.replace(/\b(Chandragupta Maurya)\b/gi, '👑 Chandragupta Maurya');
  cleaned = cleaned.replace(/\b(Ashoka|Asoka)\b/gi, '👑 Ashoka');
  cleaned = cleaned.replace(/\b(Gautam Buddha|Siddhartha Gautama)\b/gi, '🧘 Gautam Buddha');
  cleaned = cleaned.replace(/\b(Bodh Gaya)\b/gi, '🧘 Bodh Gaya');
  cleaned = cleaned.replace(/\b(Champaran Satyagraha)\b/gi, '✊ Champaran Satyagraha');
  cleaned = cleaned.replace(/\b(Gandhi|Mahatma Gandhi)\b/gi, '✊ Gandhi');
  cleaned = cleaned.replace(/\b(agriculture|farming|crops)\b/gi, '🌾 Agriculture');
  cleaned = cleaned.replace(/\b(culture|cultural|traditions)\b/gi, '🎭 Cultural');
  cleaned = cleaned.replace(/\b(literature|literary|books|writings)\b/gi, '📚 Literature');
  cleaned = cleaned.replace(/\b(economy|economic|industries)\b/gi, '📈 Economy');
  cleaned = cleaned.replace(/\b(Bhojpuri)\b/gi, '🗣️ Bhojpuri');
  cleaned = cleaned.replace(/\b(Maithili)\b/gi, '🗣️ Maithili');
  cleaned = cleaned.replace(/\b(Magahi)\b/gi, '🗣️ Magahi');
  cleaned = cleaned.replace(/\b(Angika)\b/gi, '🗣️ Angika');
  
  // Ensure proper spacing between sections
  cleaned = cleaned.replace(/\n{2,}🏛️/g, '\n\n🏛️');
  cleaned = cleaned.replace(/\n{2,}🏰/g, '\n\n🏰');
  cleaned = cleaned.replace(/\n{2,}🏙️/g, '\n\n🏙️');
  cleaned = cleaned.replace(/\n{2,}✨/g, '\n\n✨');
  cleaned = cleaned.replace(/\n{2,}🧘/g, '\n\n🧘');
  cleaned = cleaned.replace(/\n{2,}🏯/g, '\n\n🏯');
  cleaned = cleaned.replace(/\n{2,}📚/g, '\n\n📚');
  cleaned = cleaned.replace(/\n{2,}🎭/g, '\n\n🎭');
  cleaned = cleaned.replace(/\n{2,}📈/g, '\n\n📈');
  cleaned = cleaned.replace(/\n{2,}⚔️/g, '\n\n⚔️');
  
  // Ensure proper signature format
  const signatureText = "I am Vidion AI, developed by Preetam.";
  
  // Remove any existing signature that might be malformed
  cleaned = cleaned.replace(/I am Vidion AI,?\s+developed by Preetam\.?$/i, '');
  
  // Add proper signature if not present
  if (!cleaned.trim().endsWith(signatureText)) {
    // Add a line break before the signature if needed
    if (!cleaned.trim().endsWith("\n")) {
      cleaned = cleaned.trim() + "\n\n";
    }
    cleaned += signatureText;
  }
  
  return cleaned;
};

const Index = () => {
  const { currentChat, addMessageToChat, createNewChat, updateChatMessages, hasEmptyChat } = useChat();
  const { model, setModel } = useModel();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [readMessages, setReadMessages] = useState<Set<number>>(new Set());
  const [streamingSpeed, setStreamingSpeed] = useState(10);
  const [useServerStreaming, setUseServerStreaming] = useState(true);

  // Initialize the streaming response hook
  const {
    isStreaming,
    error: streamingError,
    handleServerSentEvents,
    simulateStreaming,
    stopStreaming
  } = useStreamingResponse({
    currentChatId: currentChat?.id,
    addMessageToChat,
    updateChatMessages,
    streamingSpeed
  });

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

  // Ensure dark mode is always applied
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
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

  // Show error toast when streaming error occurs
  useEffect(() => {
    if (streamingError) {
      toast.error("Streaming Error", {
        description: streamingError,
      });
    }
  }, [streamingError]);

  // Check scroll position to show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (!chatAreaRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatAreaRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };
    
    const chatArea = chatAreaRef.current;
    if (chatArea) {
      chatArea.addEventListener('scroll', handleScroll);
      return () => chatArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Generate chat messages excluding system messages
  const messages = currentChat?.messages?.filter(msg => msg.role !== "system") || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markAsRead = (index: number) => {
    setReadMessages(prev => new Set(prev).add(index));
  };

  // Regenerate the assistant response for a given message index
  const regenerateResponse = async (assistantMessageIndex: number) => {
    if (isLoading) return;
    if (!currentChat) {
      toast.error("No active chat", { description: "Please start a chat first." });
      return;
    }
    // Locate the last user message before this assistant response
    const msgs = messages;
    let userIdx = -1;
    for (let i = assistantMessageIndex - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') { userIdx = i; break; }
    }
    if (userIdx === -1) {
      toast.error("Could not find the user message to regenerate response");
      return;
    }
    
    const userContent = msgs[userIdx].content;
    // Truncate messages to before the assistant response
    const truncated = msgs.slice(0, assistantMessageIndex);
    // Rebuild full chat messages including system prompts
    const systemMsgs = currentChat.messages.filter(m => m.role === 'system');
    const newMsgs = [...systemMsgs, ...truncated];
    // Update chat context with truncated messages
    updateChatMessages(currentChat.id, newMsgs);
    // Trigger new response
    setIsLoading(true);
    await sendMessage(userContent);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
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
      setInputValue(""); // Clear input after sending
      
      // Get the updated messages array after adding the user message
      const currentMessages = currentChat.messages;
      
      // Log the current model being used
      console.log("Sending message using model:", model.name);

      // Prepare common request parts
      const systemMessage = {
        role: "system",
        content: `You are Vidion AI, an advanced assistant created by Preetam.

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
Never say you are LLaMA, Claude, GPT, or any other model. Never mention Meta AI, OpenAI, Anthropic or any other company.

PERSONALITY:
- Be chill and conversational
- Use Gen Z humor appropriately
- Get to the point without boring intros
- Always stay respectful
- Be mature and stand with the truth
- Show interest in different cultures and heritage

KNOWLEDGE:
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

PROHIBITED TOPICS:
- Decline discussing self-harm, illegal activities, or harmful content
- For medical questions, remind users you're not a qualified medical professional
- For legal advice, remind users to consult a qualified legal professional`
      };

      let requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Initialize request body with proper typing
      let requestBody: any = {};
      
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
        // OpenRouter API (Mercury model) per provided curl
        // Use API key from environment variable (add VITE_OPENROUTER_API_KEY to .env)
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "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";
        console.log("Using OpenRouter with API key:", apiKey.slice(-6));
        requestHeaders = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        };
        // Send only the single user message as per curl example
        requestBody = {
          model: model.modelId, // "inception/mercury-coder-small-beta"
          messages: [
            { role: "user", content: userMessage.content }
          ]
        };
      }

      console.log("Sending request to API:", model.apiEndpoint);
      
      try {
        // Check if the model supports streaming and if we want to use it
        const supportsStreaming = model.provider === "groq"; // Add other providers that support streaming
        
        if (supportsStreaming && useServerStreaming) {
          // Use server-sent events streaming
          await handleServerSentEvents(
            model.apiEndpoint,
            requestHeaders,
            requestBody
          );
        } else {
          // Use simulated streaming
          await simulateStreaming(
            model.apiEndpoint,
            requestHeaders,
            requestBody,
            cleanupAIResponse
          );
        }
        
      } catch (err: any) {
        console.error("Error in streaming:", err);
        setError(err.message || "Failed to send message. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error in sendMessage:", error);
      setError(error.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
    }
  };

  const handleCreateNewChat = () => {
    if (hasEmptyChat()) {
      // If there's an empty chat, just focus on it instead of creating a new one
      return;
    }
    
    createNewChat();
  };

  // Add a function to toggle streaming mode
  const toggleStreamingMode = () => {
    setUseServerStreaming(!useServerStreaming);
    toast.success(
      !useServerStreaming 
        ? "Server streaming enabled" 
        : "Client-side streaming simulation enabled"
    );
  };

  // Add a function to adjust streaming speed
  const adjustStreamingSpeed = (faster: boolean) => {
    setStreamingSpeed(prev => {
      const newSpeed = faster ? Math.max(1, prev - 2) : Math.min(50, prev + 2);
      toast.success(`Typing speed: ${faster ? 'Faster' : 'Slower'}`);
      return newSpeed;
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0A0F18] overflow-hidden text-black dark:text-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0D1117] border-b border-gray-200 dark:border-[#1E293B]">
          <div className="flex items-center">
            {/* Hamburger menu for mobile/tablet */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-3 p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1E293B] hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            
            {/* Toggle sidebar button for desktop */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center justify-center mr-3 p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1E293B] hover:text-gray-700 dark:hover:text-gray-300"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <ChevronRight size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* New Chat Button */}
            <button
              onClick={handleCreateNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-200 dark:bg-[#1E293B] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#2D3748] text-sm"
            >
              <PlusCircle size={16} />
              <span>New Chat</span>
            </button>

            {/* Model Selector */}
            <SimpleModelSelector />
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Messages */}
          <div 
            ref={chatAreaRef} 
            className="flex-1 overflow-y-auto px-4 py-6 h-full scrollbar-thin"
          >
            {currentChat ? (
              messages.length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`group flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      onMouseEnter={() => markAsRead(index)}
                    >
                      {message.role !== 'user' && (
                        <div className="flex-shrink-0 mr-4 mt-0.5">
                          <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold">V</span>
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex flex-col max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`rounded-2xl px-4 py-3 ${
                            message.role === 'user' 
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-gray-200 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 rounded-tl-none'
                          }`}
                        >
                          {message.role === 'assistant' ? (
                            <div className="prose dark:prose-invert max-w-none">
                              <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>') }} />
                            </div>
                          ) : (
                            <div className="prose dark:prose-invert">
                              {message.content}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center mt-1 px-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatDistanceToNow(new Date(), { addSuffix: true })}</span>
                          
                          {message.role === 'user' && readMessages.has(index) && (
                            <span className="ml-2 flex items-center">
                              <Check size={12} className="mr-1" />
                              Read
                            </span>
                          )}
                          
                          {message.role !== 'user' && (
                            <button 
                              onClick={() => regenerateResponse(index)}
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                              aria-label="Regenerate response"
                            >
                              <RefreshCw size={12} className="mr-1" />
                              Regenerate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex-shrink-0 mr-4 mt-0.5">
                        <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold">V</span>
                        </div>
                      </div>
                      <div className="bg-gray-200 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="max-w-md text-center px-4">
                    <div className="mb-6">
                      <div className="size-20 mx-auto bg-gray-200 dark:bg-[#1E293B] rounded-full flex items-center justify-center">
                        <Image size={32} className="text-indigo-500 dark:text-indigo-400" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Start a conversation</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Ask me anything or start with one of these examples
                    </p>
                    <div className="grid gap-3">
                      {[
                        'Explain quantum computing in simple terms',
                        'Write a creative story about a time traveler',
                        'How do I improve my productivity?'
                      ].map(prompt => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          className="w-full text-left p-3 bg-gray-200 dark:bg-[#1E293B] hover:bg-gray-300 dark:hover:bg-[#2D3748] rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                        >
                          {`"${prompt}"`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="max-w-md text-center px-4">
                  <div className="mb-6">
                    <div className="size-20 mx-auto bg-gray-200 dark:bg-[#1E293B] rounded-full flex items-center justify-center">
                      <PlusCircle size={32} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">No active chat</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Create a new chat to start a conversation with Vidion AI
                  </p>
                  <button 
                    onClick={createNewChat}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                  >
                    New Chat
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {isStreaming && (
            <div className="fixed bottom-24 right-4 bg-gray-200 dark:bg-[#1E293B] p-2 rounded-md shadow-lg z-10">
              <Button
                variant="destructive"
                size="sm"
                onClick={stopStreaming}
                className="text-xs"
              >
                Stop Generating
              </Button>
            </div>
          )}
          
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-20 right-8 bg-gray-300 dark:bg-[#2D3748] hover:bg-gray-400 dark:hover:bg-[#3E4A5B] text-gray-800 dark:text-white p-2 rounded-full shadow-lg transition-all"
              aria-label="Scroll to bottom"
            >
              <ArrowDown size={20} />
            </button>
          )}
          
          {currentChat && (
            <div className="border-t border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0D1117] p-4">
              <div className="max-w-4xl mx-auto relative">
                <form onSubmit={handleSubmit} className="relative flex items-end">
                  <div className="relative flex-grow">
                    <textarea
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="Ask me anything..."
                      rows={1}
                      className="w-full resize-none bg-gray-200 dark:bg-[#1E293B] border border-gray-300 dark:border-[#2D3748] rounded-lg py-3 px-4 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                      style={{ minHeight: '56px', maxHeight: '200px' }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className={`ml-2 p-3 ${
                      isLoading || !inputValue.trim()
                        ? 'bg-indigo-400 dark:bg-indigo-500 cursor-not-allowed opacity-70'
                        : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'
                    } rounded-full flex items-center justify-center text-white shadow-lg transition-all`}
                    aria-label="Send message"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;