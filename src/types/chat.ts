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

// Only define QwQ model
const OPENROUTER_QWQ: Model = {
  id: "openrouter-qwq",
  name: "QwQ 32B",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "qwen/qwq-32b:free"
};

// Export only this model
export const AVAILABLE_MODELS: Model[] = [
  OPENROUTER_QWQ
]; 