import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { Send, Mic, Plus, Globe, Lightbulb, Sparkles, ImageIcon, MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUploader } from "./FileUploader";
import { FilePreview } from "./FilePreview";

interface ChatInputProps {
  onSend: (message: string, modelOverride?: string, files?: File[]) => void;
  disabled?: boolean;
}

type ActiveButtonType = 'none' | 'search' | 'reason' | 'research' | 'image' | 'upload';

export const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [activeButton, setActiveButton] = useState<ActiveButtonType>('none');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && selectedFiles.length === 0) || disabled) return;
    
    // Use the model based on activeButton
    let modelOverride = undefined;
    if (activeButton === 'search') {
      modelOverride = 'perplexity';
    } else if (activeButton === 'reason') {
      modelOverride = 'groq-llama3';
    } else if (activeButton === 'research') {
      modelOverride = 'mercury';
    }
    
    onSend(input, modelOverride, selectedFiles.length > 0 ? selectedFiles : undefined);
    setInput("");
    setSelectedFiles([]);
    setShowUploader(false);
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

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInput(textarea.value);
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  // Handlers for different model options
  const handleSearch = () => {
    setActiveButton(activeButton === 'search' ? 'none' : 'search');
  };

  const handleReason = () => {
    setActiveButton(activeButton === 'reason' ? 'none' : 'reason');
  };

  const handleDeepResearch = () => {
    setActiveButton(activeButton === 'research' ? 'none' : 'research');
  };

  const handleCreateImage = () => {
    setActiveButton(activeButton === 'image' ? 'none' : 'image');
    alert("Image creation not implemented");
  };

  const handleToggleUploader = () => {
    setShowUploader(!showUploader);
    setActiveButton(activeButton === 'upload' ? 'none' : 'upload');
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Get button styles based on active state
  const getButtonStyles = (buttonType: ActiveButtonType) => {
    const isActive = activeButton === buttonType;
    return cn(
      "rounded-full px-4 py-2 h-9 flex items-center gap-1.5 flex-shrink-0 shadow-sm transition-all font-medium",
      isActive 
        ? "bg-indigo-600 text-white hover:bg-indigo-700" 
        : "bg-[#202123] text-gray-200 hover:bg-[#303133] border-none"
    );
  };

  return (
    <div className="w-full">
      <form 
        onSubmit={handleSubmit}
        className="relative w-full flex flex-col gap-3"
      >
        {/* Action buttons row */}
        <div className="flex items-center gap-2 px-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              "rounded-full size-10 text-gray-400 hover:bg-[#1E293B] hover:text-gray-300 flex-shrink-0",
              activeButton === 'upload' && "bg-[#1E293B] text-indigo-400"
            )}
            onClick={handleToggleUploader}
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">Upload files</span>
          </Button>
          
          <div className="flex items-center gap-3 overflow-x-auto flex-1 px-1 py-1" 
               style={{ 
                 scrollbarWidth: 'thin',
                 scrollbarColor: '#4B5563 transparent'
               }}>
            <Button
              type="button"
              className={getButtonStyles('search')}
              onClick={handleSearch}
            >
              <Globe className="h-4 w-4" />
              <span>Search</span>
            </Button>
            
            <Button
              type="button"
              className={getButtonStyles('reason')}
              onClick={handleReason}
            >
              <Lightbulb className="h-4 w-4" />
              <span>Reason</span>
            </Button>
            
            <Button
              type="button"
              className={getButtonStyles('research')}
              onClick={handleDeepResearch}
            >
              <Sparkles className="h-4 w-4" />
              <span>Deep research</span>
            </Button>
            
            <Button
              type="button"
              className={getButtonStyles('image')}
              onClick={handleCreateImage}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Create image</span>
            </Button>
          </div>
          
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full size-9 text-gray-400 hover:bg-[#1E293B] hover:text-gray-300 flex-shrink-0"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </div>
        
        {/* File uploader */}
        {showUploader && (
          <div className="mb-3">
            <FileUploader
              onFilesSelected={handleFilesSelected}
              disabled={disabled}
              acceptedFileTypes="image/*,application/pdf,text/plain"
              maxFileSize={10 * 1024 * 1024} // 10MB
              maxFiles={5}
            />
          </div>
        )}

        {/* File preview */}
        {selectedFiles.length > 0 && (
          <FilePreview
            files={selectedFiles}
            onRemoveFile={handleRemoveFile}
          />
        )}
        
        {/* Input area */}
        <div className="flex items-center w-full bg-[#111827] rounded-lg border border-[#2D3748] focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              className={cn(
                "resize-none min-h-[52px] max-h-[120px] py-3.5 px-4 pr-16 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-[#E2E8F0] placeholder-gray-500 text-[15px]",
                disabled && "opacity-50"
              )}
              placeholder={selectedFiles.length > 0 ? "Add a message or send files directly" : "Ask anything"}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={disabled}
            />
            
            <div className="absolute right-3 bottom-2.5 flex items-center gap-2">
              <Button 
                type="button" 
                size="icon" 
                className="rounded-full size-10 text-gray-400 hover:bg-[#1E293B] hover:text-gray-300 bg-transparent"
                disabled={disabled}
              >
                <Mic className="h-4.5 w-4.5" />
                <span className="sr-only">Voice input</span>
              </Button>
              
              <Button 
                type="submit"
                size="icon" 
                className={cn(
                  "rounded-full size-10 bg-indigo-600 hover:bg-indigo-700 text-white",
                  ((!input.trim() && selectedFiles.length === 0) || disabled) && "opacity-50 cursor-not-allowed"
                )}
                disabled={(!input.trim() && selectedFiles.length === 0) || disabled}
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
