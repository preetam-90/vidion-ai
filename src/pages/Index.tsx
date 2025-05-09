import { useRef, useEffect } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { useChat } from "@/hooks/useChat";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const { messages, isLoading, error, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error("Error", {
        description: error,
      });
    }
  }, [error]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-background sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold">V</span>
            </div>
            <h1 className="font-semibold text-lg text-gradient-primary">
              Vidion AI
            </h1>
          </div>
          <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
            Model: llama3-8b
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="pt-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <h2 className="text-2xl font-semibold mb-2 text-gradient">Welcome to Vidion AI</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Start a conversation with Vidion AI's advanced assistant. Ask a question or share a thought.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  animate={message.role === "assistant"}
                />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;
