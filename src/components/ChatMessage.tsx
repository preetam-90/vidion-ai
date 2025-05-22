import { cn } from "@/lib/utils";
import { AnimatedMessage } from "./AnimatedMessage";
import { Copy, Check, User } from "lucide-react";
import { useState } from "react";

type MessageRole = "user" | "assistant" | "system";

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  isLoading?: boolean;
  animate?: boolean;
  streamingSpeed?: number;
}

export const ChatMessage = ({
  role,
  content,
  isLoading = false,
  animate = true,
  streamingSpeed = 10,
}: ChatMessageProps) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className={cn(
      "w-full py-5 md:py-6",
      isUser ? "bg-[#111827]/30" : "bg-[#0D1117]"
    )}>
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex gap-4 items-start">
          {/* Avatar */}
          <div className={cn(
            "shrink-0 rounded-full w-9 h-9 flex items-center justify-center mt-0.5",
            isUser ? "bg-blue-500/10" : "bg-indigo-600/20"
          )}>
            {isUser ? (
              <User className="h-4 w-4 text-blue-500" />
            ) : (
              <span className="text-indigo-400 font-medium text-xs">AI</span>
            )}
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0 relative group">
            {/* User message */}
            {isUser ? (
              <div className="prose prose-invert prose-p:leading-relaxed prose-p:my-1.5 max-w-none break-words text-[#E2E8F0] text-[15px]">
                {content}
              </div>
            ) : (
              /* AI message */
              <>
                {isLoading && !content ? (
                  <div className="prose prose-invert max-w-none text-[#E2E8F0]">...</div>
                ) : animate ? (
                  <div className="relative">
                    <AnimatedMessage 
                      text={content} 
                      isStreaming={isLoading} 
                      streamingSpeed={streamingSpeed} 
                    />
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-0 right-0 p-1.5 rounded-md bg-[#1E293B] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#2D3748]"
                      aria-label="Copy message"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="prose prose-invert prose-p:leading-relaxed prose-p:my-1.5 prose-pre:bg-[#1E293B] prose-pre:border prose-pre:border-gray-700 max-w-none break-words whitespace-pre-wrap text-[#E2E8F0] text-[15px]">
                      {content}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-0 right-0 p-1.5 rounded-md bg-[#1E293B] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#2D3748]"
                      aria-label="Copy message"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
