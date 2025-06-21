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

// Only define Phi-4 model
const OPENROUTER_PHI4: Model = {
  id: "openrouter-phi4",
  name: "Phi-4 Reasoning Plus",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "microsoft/phi-4-reasoning-plus:free"
};

// Export only this model
export const AVAILABLE_MODELS: Model[] = [
  OPENROUTER_PHI4
]; 