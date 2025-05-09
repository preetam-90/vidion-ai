import React from "react";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Vidion AI" }: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-semibold">V</span>
        </div>
        <h1 className="font-semibold text-lg text-gradient-primary">
          {title}
        </h1>
      </div>
      <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
        Model: vidion ai-8b
      </div>
    </div>
  );
}

export default Header; 