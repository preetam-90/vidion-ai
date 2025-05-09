import { useState, useEffect } from "react";
import { formatMarkdown } from "@/lib/utils";

interface AnimatedMessageProps {
  text: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void;
}

export const AnimatedMessage = ({
  text,
  speed = 5,
  onComplete
}: AnimatedMessageProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset animation state when text changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        // Process multiple characters at once for faster animation
        // For very long responses, process more characters per frame
        const isLongText = text.length > 500;
        const charsPerFrame = isLongText 
          ? Math.max(10, Math.floor(text.length / 15)) // Much faster for long text
          : Math.max(2, Math.floor(text.length / 25));
        
        const nextIndex = Math.min(text.length, currentIndex + charsPerFrame);
        
        // Incrementally add characters to displayed text
        setDisplayedText(text.substring(0, nextIndex));
        setCurrentIndex(nextIndex);
      }, speed);
      
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  // Apply formatting only after rendering to avoid interference with animation
  const formattedText = formatMarkdown(displayedText);

  return (
    <div className="prose prose-invert max-w-none">
      <span dangerouslySetInnerHTML={{ __html: formattedText }} />
      {!isComplete && (
        <span className="ml-0.5 inline-block h-4 w-2 bg-primary/80 animate-cursor-blink" />
      )}
    </div>
  );
}; 