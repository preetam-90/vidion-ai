import { useState, useCallback, useRef } from 'react';
import { Message, MessageRole } from '@/types/chat';
import { toast } from '@/components/ui/sonner';

interface UseStreamingResponseProps {
  currentChatId?: string;
  addMessageToChat: (chatId: string, message: Message & { id: string }) => void;
  updateChatMessages: (
    chatId: string,
    updateFn: (prevMessages: (Message & { id: string })[]) => (Message & { id: string })[]
  ) => void;
  streamingSpeed: number;
}

interface UseStreamingResponseReturn {
  isStreaming: boolean;
  error: string | null;
  handleServerSentEvents: (
    apiEndpoint: string,
    headers: Record<string, string>,
    body: any
  ) => Promise<void>;
  simulateStreaming: (
    apiEndpoint: string,
    headers: Record<string, string>,
    body: any,
    cleanupFn?: (text: string) => string
  ) => Promise<void>;
  stopStreaming: () => void;
}

export const useStreamingResponse = ({
  currentChatId,
  addMessageToChat,
  updateChatMessages,
  streamingSpeed,
}: UseStreamingResponseProps): UseStreamingResponseReturn => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stopStreamingRef = useRef<boolean>(false);
  const currentAssistantMessageIdRef = useRef<string | null>(null);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const resetStreamingState = () => {
    setIsStreaming(false);
    stopStreamingRef.current = false;
    currentAssistantMessageIdRef.current = null;
    // setError(null); // Optionally reset error
  };

  const stopStreaming = useCallback(() => {
    stopStreamingRef.current = true;
    // The streaming loops will handle UI updates and setIsStreaming(false)
    toast.info("Stopping message generation...");
  }, []);

  // Common logic to initialize and update assistant message
  const initializeAssistantMessage = (chatId: string) => {
    currentAssistantMessageIdRef.current = generateMessageId();
    const assistantMessage: Message & { id: string } = {
      id: currentAssistantMessageIdRef.current,
      role: "assistant" as MessageRole, // Ensure MessageRole is correctly typed
      content: "▋", // Typing cursor
    };
    addMessageToChat(chatId, assistantMessage);
  };

  const updateAssistantMessageContent = (chatId: string, newContent: string, isFinal: boolean = false) => {
    if (!currentAssistantMessageIdRef.current) return;
    const cursor = isFinal || stopStreamingRef.current ? "" : "▋";
    updateChatMessages(chatId, (prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === currentAssistantMessageIdRef.current
          ? { ...msg, content: newContent + cursor }
          : msg
      )
    );
  };
  
  const finalizeAssistantMessage = (chatId: string, finalContent: string) => {
    if (!currentAssistantMessageIdRef.current) return;
     updateChatMessages(chatId, (prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === currentAssistantMessageIdRef.current
          ? { ...msg, content: finalContent } // Remove cursor
          : msg
      )
    );
  }

  const handleStreamingError = (chatId: string, accumulatedContent: string, errorMessage: string) => {
    setError(errorMessage);
    const errorText = accumulatedContent + `\n\n[Error: ${errorMessage}]`;
    finalizeAssistantMessage(chatId, errorText);
  };


  const handleServerSentEvents = useCallback(
    async (
      apiEndpoint: string,
      headers: Record<string, string>,
      body: any
    ) => {
      if (!currentChatId) {
        setError("No active chat ID for SSE.");
        return;
      }
      setIsStreaming(true);
      setError(null);
      stopStreamingRef.current = false;
      initializeAssistantMessage(currentChatId);

      let accumulatedContent = "";

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ ...body, stream: true }), // Backend might need a 'stream: true' flag
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `API Error: ${response.status}`);
        }
        if (!response.body) throw new Error('Response body is null for SSE.');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (stopStreamingRef.current) {
            toast.success("Message generation stopped.");
            break;
          }
          const { value, done: readerDone } = await reader.read();
          if (readerDone) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonData = line.substring('data: '.length).trim();
              if (jsonData === '[DONE]') { // OpenAI-specific DONE signal
                 stopStreamingRef.current = true; // Ensure loop termination
                 break;
              }
              if (!jsonData) continue;

              try {
                const parsed = JSON.parse(jsonData);
                // Adjust this path based on your API's SSE response structure
                const contentDelta = parsed.choices?.[0]?.delta?.content || parsed.delta?.content || parsed.content || '';
                if (contentDelta) {
                  accumulatedContent += contentDelta;
                  updateAssistantMessageContent(currentChatId, accumulatedContent);
                }
              } catch (e) {
                console.warn('Failed to parse SSE JSON chunk:', jsonData, e);
              }
            }
          }
           if (stopStreamingRef.current) break; // Check again after processing chunk
        }
      } catch (err: any) {
        console.error('SSE Streaming error:', err);
        handleStreamingError(currentChatId, accumulatedContent, err.message || 'SSE streaming failed.');
      } finally {
        finalizeAssistantMessage(currentChatId, accumulatedContent);
        resetStreamingState();
      }
    },
    [currentChatId, addMessageToChat, updateChatMessages]
  );

  const simulateStreaming = useCallback(
    async (
      apiEndpoint: string,
      headers: Record<string, string>,
      body: any,
      cleanupFn?: (text: string) => string
    ) => {
      if (!currentChatId) {
        setError("No active chat ID for simulated streaming.");
        return;
      }
      setIsStreaming(true);
      setError(null);
      stopStreamingRef.current = false;
      initializeAssistantMessage(currentChatId);

      let fullContent = "";

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        // Adjust this based on your non-streaming API response structure
        let rawContent = data.choices?.[0]?.message?.content || data.message?.content || data.content || '';
        
        if (typeof rawContent !== 'string') {
            throw new Error('Invalid content format from API.');
        }
        fullContent = cleanupFn ? cleanupFn(rawContent) : rawContent;
        
        let displayedContent = "";
        for (let i = 0; i < fullContent.length; i++) {
          if (stopStreamingRef.current) {
            toast.success("Message generation stopped.");
            break;
          }
          displayedContent += fullContent[i];
          updateAssistantMessageContent(currentChatId, displayedContent);
          await new Promise((resolve) => setTimeout(resolve, streamingSpeed));
        }
        // Final update after loop (either completed or stopped)
        finalizeAssistantMessage(currentChatId, displayedContent);

      } catch (err: any) {
        console.error('Simulated streaming error:', err);
        // Use the content accumulated so far before error, or empty if error was at fetch stage
        const contentBeforeError = fullContent || ""; 
        handleStreamingError(currentChatId, contentBeforeError, err.message || 'Simulated streaming failed.');
      } finally {
        resetStreamingState();
      }
    },
    [currentChatId, addMessageToChat, updateChatMessages, streamingSpeed]
  );

  return {
    isStreaming,
    error,
    handleServerSentEvents,
    simulateStreaming,
    stopStreaming,
  };
};

/**
 * Note on Message Type:
 * This hook assumes that your `Message` type (likely defined in `@/types/chat.ts`)
 * includes an `id: string` and `createdAt: string` (or Date).
 * The `addMessageToChat` and `updateChatMessages` functions (from `ChatContext`)
 * need to be compatible with messages having an `id`.
 * 
 * Example Message type enhancement:
 * export interface Message {
 *   id: string; // Crucial for updating specific messages
 *   role: MessageRole;
 *   content: string;
 *   createdAt?: string; // Or Date
 *   // ... any other fields
 * }
 */ 