import { formatMarkdown } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface AnimatedMessageProps {
  text: string;
  isStreaming?: boolean;
  streamingSpeed?: number; // Speed of the typing effect (ms per character)
}

export const AnimatedMessage = ({
  text,
  isStreaming = false,
  streamingSpeed = 10, // Default speed - lower is faster
}: AnimatedMessageProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const previousTextRef = useRef("");

  useEffect(() => {
    // If the text has changed, start the typing animation
    if (text !== previousTextRef.current) {
      previousTextRef.current = text;
      
      // If we're actively streaming from the server, just display what we have
      if (isStreaming) {
        setDisplayedText(text);
        return;
      }
      
      // Otherwise, simulate typing effect
      setIsTyping(true);
      let currentIndex = 0;
      
      // Reset displayed text if it's a new message
      if (displayedText.length > text.length || !text.startsWith(displayedText)) {
        setDisplayedText("");
        currentIndex = 0;
      } else {
        currentIndex = displayedText.length;
      }
      
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, streamingSpeed);
      
      return () => clearInterval(interval);
    }
  }, [text, isStreaming, streamingSpeed]);

  // Use the formatting utility on the displayed text
  const formattedText = formatMarkdown(displayedText);

  return (
    <div className="prose prose-invert max-w-none text-[#E2E8F0]">
      <span dangerouslySetInnerHTML={{ __html: formattedText }} />
      {(isStreaming || isTyping) && (
        <span className="ml-0.5 inline-block h-4 w-2 bg-indigo-500 animate-cursor-blink rounded-sm" />
      )}
    </div>
  );
}; 