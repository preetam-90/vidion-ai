export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  role: MessageRole;
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export type ModelProvider = "groq" | "openrouter" | "serpapi";

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  apiEndpoint: string;
  modelId: string;
  hasWebSearch?: boolean;
}

// Define models directly as constants to ensure they're properly initialized
const GROQ_LLAMA3_8B: Model = {
  id: "groq-llama3-8b",
  name: "Groq",
  provider: "groq",
  apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
  modelId: "llama3-8b-8192",
  hasWebSearch: false
};

const OPENROUTER_SONAR: Model = {
  id: "openrouter-sonar",
  name: "Sonar Pro (Perplexity)",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "perplexity/sonar-pro",
  hasWebSearch: false
};

const GROQ_LLAMA3_8B_WITH_WEB: Model = {
  id: "groq-llama3-8b-web",
  name: "Groq with Web Search",
  provider: "groq",
  apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
  modelId: "llama3-8b-8192",
  hasWebSearch: true
};

// Export the models array
export const AVAILABLE_MODELS: Model[] = [
  GROQ_LLAMA3_8B,
  GROQ_LLAMA3_8B_WITH_WEB,
  // OPENROUTER_SONAR removed as requested
]; 