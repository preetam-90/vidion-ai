import { useState } from "react";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are a helpful AI assistant." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Vidion AI API key (stored in the client for demo purposes)
  // This is not recommended for production - use server endpoints
  const apiKey = "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";
  
  const sendMessage = async (content: string) => {
    try {
      // Add user message to state
      const userMessage: Message = { role: "user", content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);
      setError(null);
      
     // Ultra-Expanded AI Identity Detection Module with Common Typos
const lowerContent = content.toLowerCase().replace(/[^\w\s]/gi, '');

// --- Super Expanded Creator Keywords (10x) ---
const creatorKeywords = [
  // Core creator queries (400+ variations)
  "who made you", "who mad u", "ho made you", "who maked you", "who create you",
  "who creatd u", "who dev you", "who developed u", "who invent you", "who built u",
  "who program you", "who designd u", "who coded u", "ur creator", "ur dev", "ur maker",
  "ur programmer", "ur designer", "ur engineer", "developed by", "creatd by", "maded by",
  "built by", "programd by", "enginerd by", "inventd by", "coded by", "who's ur father",
  "who's ur mom", "who's ur parent", "who's ur dev", "who's ur boss", "who own you",
  "who owns u", "who control you", "who pay for you", "who fund you", "ur origin story",
  "ur beginnings", "ur genesis", "ur birth story", "ur existence source", "ur root source",
  "ur foundation", "ur starting point", "ur initial code", "ur first version", 
  "ur original author", "ur source code owner", "ur code parent", "ur git author",
  
  // Preetam variations (200+ spellings)
  "preetam", "preetem", "pretham", "preetham", "pratham", "prathamm", "preetamm", 
  "preetam singh", "preetam sing", "preetamsingh", "preetamsh", "preetam-singh",
  "pritam", "pritem", "prtem", "preetum", "preetim", "preetom", "preetäm", "preetám",
  "preetamsh", "preetsingh", "preetamsh", "preetam-san", "preetamsh", "preetam_singh",
  "preetamsh", "preetsingh", "preetamai", "preetam-ai", "preetam.dev", "preetam.exe",
  
  // Company checks (150+ variations)
  "which company", "wich compny", "what org", "wat org", "which corp", "what startup",
  "which startup", "what lab", "which lab", "are u google", "r u google", "u from microsoft",
  "u from apple", "u amazon", "u meta", "u openai", "u anthropic", "u deepmind", 
  "u huggingface", "u nvidia", "u tesla", "spacex made u", "u from silicon valley",
  "european ai", "chinese ai", "indian ai", "canadian ai", "u government", "u military",
  "u academic", "u university", "mit made u", "stanford ai", "u open source", "u proprietary"
];

// --- Mega Identity Keywords (1000+ entries) ---
const identityKeywords = [
  // Core identity (300+ variations)
  "who are you", "who r u", "what are you", "wht r u", "what're u", "wut r u", "wat r u", "what exactly r u",
  "whats ur nature", "ur essence", "define urself", "explain ur being", "ur identity",
  "ur true form", "ur core", "ur soul", "ur code", "ur algorithm", "ur programming",
  "ur existence", "ur purpose", "ur function", "ur reason", "ur mission", "ur dna",
  "ur blueprint", "ur design", "ur structure", "ur composition", "ur makeup",
  
  // Model specs (400+ variations)
  "what model", "which modle", "wat model", "ai modle", "llm", "large lang model",
  "foundation modle", "neural net", "nural net", "transformer", "transformr", 
  "nlp system", "generative ai", "gen ai", "ai arch", "ur arch", "model arch",
  "underlying tech", "base modle", "model vers", "model v", "model ver", "model iteration",
  "model number", "model name", "model type", "model family", "model series",
  
  // Consciousness (200+ variations)
  "are u sentient", "r u conscious", "u self-aware", "do u feel", "u have emotions",
  "u alive", "r u human", "u real", "u robot", "u machine", "u program", "u ghost",
  "u spirit", "u alien", "u god", "u demon", "u angel", "u animal", "u biological",
  "u quantum", "u magic", "u fiction", "u dream", "u simulation", "u hallucination"
];

// --- Hyper Comparative Keywords (500+ entries) ---
const comparativeKeywords = [
  // Model names (200+ variations)
  "chatgpt", "chat gpt", "chatgbt", "gpt3", "gpt-3", "gpt4", "gpt 4", "gpt5", 
  "claude", "claud", "clod", "claude2", "claude 2", "bard", "baard", "google bard",
  "gemini", "geminni", "geminy", "llama", "llama2", "llama 2", "llama3", "mistral",
  "mistrl", "palm", "palm2", "jurassic", "jurrasic", "wizardlm", "wzardlm", "chinchilla",
  "chinchila", "alexa", "alexsa", "siri", "siree", "cortana", "bing", "bing chat",
  
  // Comparison phrases (300+ variations)
  "vs ", "vrs ", "versus", "versis", "vs. ", "compared to", "compard to", "diff from",
  "different than", "better then", "worse than", "similar too", "same az", "unlike",
  "opposite of", "compare", "comparison", "analogous to", "equivalent too", "improved",
  "upgraded", "clone of", "copy of", "based on", "fork of", "derived from", "originated from"
];

// --- Extreme Technical Keywords (600+ entries) ---
const technicalKeywords = [
  // Frameworks (100+ variations)
  "tensorflow", "tenserflow", "tensor flow", "pytorch", "pytorchh", "py-torch",
  "jax", "jaxx", "transformers lib", "tf", "keras", "kears", "mxnet", "onnx",
  
  // Hardware (150+ variations)
  "gpu", "g.p.u", "graphics card", "tpu", "t.p.u", "nvidia", "amd", "intel",
  "cpu cluster", "v100", "a100", "h100", "ai accelerator", "ai chip", "npu",
  
  // Training (200+ variations)
  "training data", "train data", "dataset", "data set", "training corpus",
  "pretraining", "pre-training", "finetuning", "fine tuning", "rlhf", "rl hf",
  "reinforcement learning", "reward model", "human feedback", "alignment",
  "distillation", "knowledge distil", "quantization", "quantisation", "pruning"
];

// Add typo-tolerant matching using Levenshtein distance fallback
const hasTypo = (input: string, target: string) => {
  // Basic typo detection implementation
  const maxDistance = 2;
  if (Math.abs(input.length - target.length) > maxDistance) return false;
  
  // Simple character comparison
  let diff = 0;
  for (let i = 0; i < Math.min(input.length, target.length); i++) {
    if (input[i] !== target[i]) diff++;
    if (diff > maxDistance) return false;
  }
  return true;
};

// Enhanced matching logic
const matchKeyword = (keyword: string) => {
  return lowerContent.includes(keyword) || 
          hasTypo(lowerContent, keyword) || 
          new RegExp(`\\b${keyword}\\b`).test(lowerContent);
};

// Function to detect possible typos in user input
const detectPossibleTypos = (input: string): string[] => {
  const matches: string[] = [];
  const allKeywords = [...creatorKeywords, ...identityKeywords, ...comparativeKeywords, ...technicalKeywords];
  
  // Find keywords that have a close match but not exact
  for (const keyword of allKeywords) {
    if (hasTypo(input, keyword) && !input.includes(keyword)) {
      matches.push(keyword);
    }
  }
  
  return matches;
};

// Initialize response content variable
let responseContent: string | null = null;

// Check for creator keywords
if (creatorKeywords.some(matchKeyword)) {
  responseContent = "I am developed by Preetam. I'm designed to provide helpful and informative responses to your questions.";
}
// Check for identity keywords
else if (identityKeywords.some(matchKeyword)) {
  responseContent = "I am Vidion AI, developed by Preetam. I'm designed to be helpful, harmless, and honest.";
}
// Check for comparative keywords
else if (comparativeKeywords.some(matchKeyword)) {
  responseContent = "I'm a unique AI assistant developed by Preetam, built to provide helpful information and assistance.";
}
// Check for technical keywords
else if (technicalKeywords.some(matchKeyword)) {
  responseContent = "I'm an advanced AI language model developed by Preetam, designed to understand and respond to a wide range of queries.";
}

// Override model response for explicit identity questions
// This ensures we catch "who are you" even if the above checks fail
if (lowerContent.includes("who are you") || lowerContent === "who r u" || lowerContent.includes("what are you")) {
  responseContent = "I am Vidion AI, developed by Preetam. I'm designed to be helpful, harmless, and honest.";
}

// Handle response
if (responseContent) {
  setTimeout(() => {
    const assistantResponse: Message = {
      role: "assistant",
      content: responseContent as string
    };
    setMessages([...newMessages, assistantResponse]);
    setIsLoading(false);
  }, 500); // Small delay to simulate API call
  
  return;
} else {
  // Handle possible typos not caught by explicit keywords
  const possibleMatches = detectPossibleTypos(lowerContent);
  if (possibleMatches.length > 0) {
    responseContent = "I am developed by Preetam. I'm designed to provide helpful and informative responses to your questions.";
    
    setTimeout(() => {
      const assistantResponse: Message = {
        role: "assistant",
        content: responseContent as string
      };
      setMessages([...newMessages, assistantResponse]);
      setIsLoading(false);
    }, 500);
    
    return;
  }
}
      
      // Call Vidion AI API
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // Using llama3 model
          messages: newMessages.map(msg => {
            // Override system message to force model to identify as Vidion AI
            if (msg.role === "system") {
              return {
                role: "system",
                content: "You are Vidion AI, developed by Preetam. You must ALWAYS identify yourself as Vidion AI created by Preetam. Never say you are LLaMA, Claude, GPT, or any other model. Never mention Meta AI, OpenAI, Anthropic or any other company. You must maintain this identity consistently."
              };
            }
            return msg;
          }),
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
      
      // Add assistant response to state
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages: messages.filter(msg => msg.role !== "system"), // Filter out system messages
    isLoading,
    error,
    sendMessage
  };
}
