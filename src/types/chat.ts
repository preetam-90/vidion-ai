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

export type ModelProvider = "openrouter";

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

// Export both models, with QwQ as the first (default) option since it's free
export const AVAILABLE_MODELS: Model[] = [
  OPENROUTER_QWQ,
  INCEPTION_MERCURY
]; 