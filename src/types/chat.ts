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

export type ModelProvider = "openrouter" | "groq";

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  apiEndpoint: string;
  modelId: string;
}

// Define models
const OPENROUTER_QWQ: Model = {
  id: "openrouter-qwq",
  name: "QwQ 32B",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "qwen/qwq-32b:free"
};

// Add Inception Mercury model
const INCEPTION_MERCURY: Model = {
  id: "inception-mercury",
  name: "Inception Mercury",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "inception/mercury-coder-small-beta"
};

// Add Groq Llama model
const GROQ_LLAMA: Model = {
  id: "groq-llama",
  name: "Llama 3.3 70B",
  provider: "groq",
  apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
  modelId: "llama-3.3-70b-versatile"
};

// Add Meta Llama 4 Scout model
const GROQ_LLAMA4_SCOUT: Model = {
  id: "groq-llama4-scout",
  name: "Llama 4 Scout 17B",
  provider: "groq",
  apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
  modelId: "meta-llama/llama-4-scout-17b-16e-instruct"
};

// Export models, with the Groq models as the options
export const AVAILABLE_MODELS: Model[] = [
  GROQ_LLAMA,
  GROQ_LLAMA4_SCOUT
]; 