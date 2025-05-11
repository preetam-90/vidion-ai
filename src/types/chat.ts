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

const GROQ_LLAMA3_70B: Model = {
  id: "groq-llama3-70b",
  name: "Llama 3 70B (Groq)",
  provider: "groq",
  apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
  modelId: "llama3-70b-8192"
};

const OPENROUTER_QWEN: Model = {
  id: "openrouter-qwen",
  name: "Qwen 23.5B (OpenRouter)",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "qwen/qwen3-235b06d21fe677c6017bece6e54b6e429e45dfeada591c25958dfcf6846225"
};

// Export the models array
export const AVAILABLE_MODELS: Model[] = [
  GROQ_LLAMA3_8B,
  GROQ_LLAMA3_70B,
  OPENROUTER_QWEN
]; 