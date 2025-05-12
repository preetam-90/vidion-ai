import { formatMarkdown } from "@/lib/utils";

interface AnimatedMessageProps {
  text: string;
  isStreaming?: boolean; // Add a prop to indicate if text is still streaming
}

export const AnimatedMessage = ({
  text,
  isStreaming = false,
}: AnimatedMessageProps) => {
  // Use the formatting utility
  const formattedText = formatMarkdown(text);

  return (
    <div className="prose prose-invert max-w-none text-[#E2E8F0]">
      <span dangerouslySetInnerHTML={{ __html: formattedText }} />
      {isStreaming && (
        <span className="ml-0.5 inline-block h-4 w-2 bg-indigo-500 animate-cursor-blink rounded-sm" />
      )}
    </div>
  );
}; 