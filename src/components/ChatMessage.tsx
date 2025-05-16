import { cn } from "@/lib/utils";
import { AnimatedMessage } from "./AnimatedMessage";
import { Copy, Check, User, FileText, Image as ImageIcon, File, Paperclip } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [fileAttachments, setFileAttachments] = useState<{name: string, type: string, size: string}[]>([]);

  useEffect(() => {
    // Parse file attachments from message if present
    if (isUser && content.includes('Attached files:')) {
      const attachmentSection = content.split('Attached files:')[1];
      if (attachmentSection) {
        const fileMatches = [...attachmentSection.matchAll(/\[File: (.*?), Type: (.*?), Size: (.*?) KB\]/g)];
        setFileAttachments(
          fileMatches.map(match => ({
            name: match[1],
            type: match[2],
            size: match[3]
          }))
        );
      }
    }
  }, [content, isUser]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  // Get display content (without the file attachment details)
  const getDisplayContent = () => {
    if (isUser && content.includes('Attached files:')) {
      return content.split('Attached files:')[0].trim();
    }
    return content;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-400" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-4 w-4 text-red-400" />;
    }
    return <File className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className={cn(
      "w-full py-5 md:py-6 transition-colors",
      isUser ? "bg-[#111827]/30" : "bg-gradient-to-r from-[#0D1117]/50 to-[#0f1624]/50"
    )}>
      <div className="mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="flex gap-4 md:gap-5 items-start">
          {/* Avatar */}
          <div className={cn(
            "shrink-0 rounded-full w-9 h-9 flex items-center justify-center mt-0.5",
            isUser 
              ? "bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/20" 
              : "bg-gradient-to-br from-indigo-500/20 to-violet-600/10 ring-1 ring-indigo-500/20"
          )}>
            {isUser ? (
              <User className="h-4 w-4 text-blue-400" />
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 font-medium text-xs">AI</span>
            )}
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0 relative group">
            {/* User message */}
            {isUser ? (
              <div className={cn(
                "prose prose-invert prose-p:leading-relaxed prose-p:my-1.5 max-w-none break-words text-[#E2E8F0] text-[15px]",
                "rounded-lg py-1"
              )}>
                {getDisplayContent()}
                
                {/* File attachments */}
                {fileAttachments.length > 0 && (
                  <div className="mt-3 border-t border-gray-700/50 pt-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Paperclip className="h-3.5 w-3.5" />
                      <span>{fileAttachments.length} {fileAttachments.length === 1 ? 'file' : 'files'} attached</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {fileAttachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-800/80 text-xs text-gray-300 border border-gray-700/50 hover-card"
                        >
                          {getFileIcon(file.type)}
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <span className="text-gray-500 text-[10px]">({file.size} KB)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* AI message */
              <>
                {isLoading && !content ? (
                  <div className="prose prose-invert max-w-none text-[#E2E8F0]">...</div>
                ) : animate ? (
                  <div className="relative">
                    <div className="rounded-lg py-1">
                      <AnimatedMessage text={content} isStreaming={isLoading} />
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-0 right-0 p-1.5 rounded-md bg-[#1E293B]/80 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#2D3748] backdrop-blur-sm"
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
                    <div className="prose prose-invert prose-p:leading-relaxed prose-p:my-1.5 prose-pre:bg-[#131b2e] prose-pre:border prose-pre:border-[#1d2a45] max-w-none break-words whitespace-pre-wrap text-[#E2E8F0] text-[15px] rounded-lg py-1">
                      {content}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-0 right-0 p-1.5 rounded-md bg-[#1E293B]/80 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#2D3748] backdrop-blur-sm"
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
