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

// Define Mercury model as constant
const OPENROUTER_MERCURY: Model = {
  id: "openrouter-mercury",
  name: "Mercury DLLM (OpenRouter)",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "inception/mercury-coder-small-beta"
};

// Export the models array with only Mercury
export const AVAILABLE_MODELS: Model[] = [
  OPENROUTER_MERCURY
]; 