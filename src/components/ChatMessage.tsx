import { cn } from "@/lib/utils";
import { AnimatedMessage } from "./AnimatedMessage";

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
  return (
    <div
      className={cn(
        "py-6 px-6 md:px-8 w-full max-w-5xl mx-auto flex flex-col gap-2",
        role === "user" ? "bg-secondary/50" : ""
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            role === "user" ? "bg-chat-user/10 text-chat-user" : "bg-chat-assistant/10 text-chat-assistant"
          )}
        >
          {role === "user" ? "You" : "Vidion AI"}
        </div>
      </div>
      {isLoading ? (
        <div className="prose prose-invert max-w-none">...</div>
      ) : role === "assistant" && animate ? (
        <AnimatedMessage text={content} />
      ) : (
        <div className="prose prose-invert max-w-none">{content}</div>
      )}
    </div>
  );
};
