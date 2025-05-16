export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  role: MessageRole;
  content: string;
  thinking?: string; // Optional field to store AI model thinking/reasoning
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
  modelId: "perplexity/sonar-medium-online"
};

// Add Claude model as a backup option
const OPENROUTER_CLAUDE: Model = {
  id: "openrouter-claude",
  name: "Claude 3 Haiku (Thinking)",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "anthropic/claude-3-haiku"
};

// Add Claude Opus for better thinking capabilities
const OPENROUTER_CLAUDE_OPUS: Model = {
  id: "openrouter-claude-opus",
  name: "Claude 3 Opus (Thinking)",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "anthropic/claude-3-opus"
};

// Add Mixtral as another reliable fallback
const OPENROUTER_MIXTRAL: Model = {
  id: "openrouter-mixtral",
  name: "Mixtral 8x7B (OpenRouter)",
  provider: "openrouter",
  apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
  modelId: "mistralai/mixtral-8x7b-instruct"
};

// Export the models array
export const AVAILABLE_MODELS: Model[] = [
  GROQ_LLAMA3_8B,
  OPENROUTER_CLAUDE,
  OPENROUTER_CLAUDE_OPUS,
  OPENROUTER_MIXTRAL,
  OPENROUTER_MERCURY,
  OPENROUTER_SONAR
]; 