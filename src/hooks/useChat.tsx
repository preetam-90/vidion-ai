
import { useState } from "react";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are a helpful AI assistant." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Groq API key (stored in the client for demo purposes)
  // This is not recommended for production - use server endpoints
  const apiKey = "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";
  
  const sendMessage = async (content: string) => {
    try {
      // Add user message to state
      const userMessage: Message = { role: "user", content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);
      setError(null);
      
      // Call Groq API
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // Using llama3 model
          messages: newMessages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response from Groq API");
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message;
      
      // Add assistant response to state
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages: messages.filter(msg => msg.role !== "system"), // Filter out system messages
    isLoading,
    error,
    sendMessage
  };
}
