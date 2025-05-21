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
  name: "Groq",
  provider: "groq",
  apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
  modelId: "llama3-8b-8192"
};

// Export the models array
export const AVAILABLE_MODELS: Model[] = [
  GROQ_LLAMA3_8B
]; 