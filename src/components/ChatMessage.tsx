import { cn } from "@/lib/utils";
import { AnimatedMessage } from "./AnimatedMessage";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

type MessageRole = "user" | "assistant" | "system";

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  isLoading?: boolean;
  animate?: boolean;
}

export const ChatMessage = ({
  role,
  content,
  isLoading = false,
  animate = true,
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
    <div className="w-full mb-6">
      {/* User message */}
      {isUser ? (
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="bg-[#343541] text-white rounded-lg px-4 py-3 shadow-md inline-block max-w-[90%] scale-in">
            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 max-w-none break-words whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </div>
      ) : (
        /* AI message */
        <div className="max-w-3xl mx-auto px-4 md:px-8 relative group fade-in">
          {isLoading && !content ? (
            <div className="prose prose-invert max-w-none">...</div>
          ) : animate ? (
            <div className="relative">
              <AnimatedMessage text={content} isStreaming={isLoading} />
              <button
                onClick={copyToClipboard}
                className="absolute top-0 right-0 p-1.5 rounded-md bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600"
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
              <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 max-w-none break-words whitespace-pre-wrap">
                {content}
              </div>
              <button
                onClick={copyToClipboard}
                className="absolute top-0 right-0 p-1.5 rounded-md bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600"
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
        </div>
      )}
    </div>
  );
};
