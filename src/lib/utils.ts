import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple markdown-like formatting for animated text
export function formatMarkdown(text: string): string {
  if (!text) return "";
  
  // Use more efficient replacements for faster processing
  
  // Replace code blocks
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  
  // Process multiple markdown patterns in a single pass when possible
  text = text
    .replace(/`([^`]+)`/g, '<code>$1</code>') // inline code
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\*([^*]+)\*/g, '<em>$1</em>') // italic
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'); // links
  
  // Handle headers
  text = text
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Replace lists
  text = text.replace(/^\s*-\s(.+)$/gm, '<li>$1</li>');
  
  // Replace newlines with <br> tags
  text = text.replace(/\n/g, '<br>');
  
  return text;
}
