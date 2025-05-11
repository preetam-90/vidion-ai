import { formatMarkdown } from "@/lib/utils";

interface AnimatedMessageProps {
  text: string;
  isStreaming?: boolean; // Add a prop to indicate if text is still streaming
}

export const AnimatedMessage = ({
  text,
  isStreaming = false,
}: AnimatedMessageProps) => {
  // Directly use the text prop for display
  const formattedText = formatMarkdown(text);

  return (
    <div className="prose prose-invert max-w-none">
      <span dangerouslySetInnerHTML={{ __html: formattedText }} />
      {isStreaming && (
        <span className="ml-0.5 inline-block h-4 w-2 bg-primary/80 animate-cursor-blink" />
      )}
    </div>
  );
}; 