# Vidion AI

A modern AI chat application that supports multiple models including Mercury DLLM, Groq Llama, and Perplexity Sonar Pro.

## Setup

1. Clone this repository
2. Install dependencies with pnpm:
   ```
   pnpm install
   ```
3. Create a `.env` file in the root directory with your API keys:
   ```
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
4. Run the development server:
   ```
   pnpm run dev
   ```

## API Keys

### OpenRouter API Key
Get your OpenRouter API key from [https://openrouter.ai/keys](https://openrouter.ai/keys)

This is required for:
- Mercury DLLM (inception/mercury-coder-small-beta)
- Perplexity Sonar Pro (perplexity/sonar)

### Groq API Key
Get your Groq API key from [https://console.groq.com/keys](https://console.groq.com/keys)

This is required for:
- Llama 3 (llama3-8b-8192)

## Features

- Multiple model support
- File uploads
- Thinking/reasoning display
- Chat history
- Automatic model fallback

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/vidion-ai.git
cd vidion-ai
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

## Usage

The chat interface allows you to interact with Vidion AI. Ask questions and receive responses from the AI assistant.

## License

MIT
