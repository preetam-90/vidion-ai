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
  name: "Groq Llama3",
  provider: "groq",
  apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
  modelId: "llama3-8b-8192"
};

const GROQ_MIXTRAL: Model = {
  id: "groq-mixtral",
  name: "Groq Mixtral",
  provider: "groq",
  apiEndpoint: "https://api.groq.com/openai/v1/chat/completions",
  modelId: "mixtral-8x7b-32768"
};

const OPENROUTER_MERCURY: Model = {
  id: "openrouter-mercury",
  name: "Mercury",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "inception/mercury-coder-small-beta"
};

const OPENROUTER_CLAUDE: Model = {
  id: "openrouter-claude",
  name: "Claude 3.5 Sonnet",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "anthropic/claude-3-5-sonnet"
};

// Export the models array
export const AVAILABLE_MODELS: Model[] = [
  GROQ_LLAMA3_8B,
  GROQ_MIXTRAL,
  OPENROUTER_MERCURY,
  OPENROUTER_CLAUDE
]; 