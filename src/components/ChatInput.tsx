import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { Send, PaperclipIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onSend(input);
    setInput("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea based on content
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInput(textarea.value);
    
    // Auto resize
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="w-full">
      <form 
        onSubmit={handleSubmit}
        className="relative w-full"
      >
        <div className="flex items-center w-full bg-[#111827] rounded-lg border border-[#2D3748] focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              className={cn(
                "resize-none min-h-[52px] max-h-[120px] py-3.5 px-4 pr-24 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-[#E2E8F0] placeholder-gray-500 text-[15px]",
                disabled && "opacity-50"
              )}
              placeholder="Message Vidion AI..."
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={disabled}
            />
            
            <div className="absolute right-3 bottom-2.5 flex items-center gap-2">
              <Button 
                type="submit"
                size="icon" 
                className={cn(
                  "rounded-full size-10 bg-indigo-600 hover:bg-indigo-700 text-white",
                  (!input.trim() || disabled) && "opacity-50 cursor-not-allowed"
                )}
                disabled={!input.trim() || disabled}
              >
                <Send className="h-4.5 w-4.5" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
