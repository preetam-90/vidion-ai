import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="w-full mb-6">
      <div className="max-w-3xl mx-auto px-4 md:px-8 relative">
        <div className="flex space-x-1.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
