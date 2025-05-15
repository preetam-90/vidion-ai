export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  role: MessageRole;
  content: string;
  timestamp?: number; // Optional timestamp for sorting/referencing
  id?: string; // Optional unique ID for referencing
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export type ModelProvider = "groq" | "openrouter";

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  apiEndpoint: string;
  modelId: string;
}

// Define models directly as constants to ensure they're properly initialized
const GROQ_LLAMA3_8B: Model = {
  id: "groq-llama3-8b",
  name: "Llama 3 (Groq)",
  provider: "groq",
  apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
  modelId: "llama3-8b-8192"
};

const OPENROUTER_MERCURY: Model = {
  id: "openrouter-mercury",
  name: "Mercury DLLM (OpenRouter)",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "inception/mercury-coder-small-beta"
};

const OPENROUTER_SONAR: Model = {
  id: "openrouter-sonar",
  name: "Sonar Pro (Perplexity)",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "perplexity/sonar-pro"
};

// Export the models array
export const AVAILABLE_MODELS: Model[] = [
  GROQ_LLAMA3_8B,
  OPENROUTER_MERCURY,
  OPENROUTER_SONAR
]; 