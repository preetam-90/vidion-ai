import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center">
      {/* Cursor-style waveform animation */}
      <div className="flex items-end space-x-1 h-6">
        <div className="w-0.5 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-wave-1"></div>
        <div className="w-0.5 h-4 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-wave-2"></div>
        <div className="w-0.5 h-5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-wave-3"></div>
        <div className="w-0.5 h-6 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-wave-4"></div>
        <div className="w-0.5 h-5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-wave-5"></div>
        <div className="w-0.5 h-4 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-wave-6"></div>
        <div className="w-0.5 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-wave-7"></div>
      </div>
      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">Vidion AI is thinking...</span>
    </div>
  );
};

export default TypingIndicator;
