
const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 py-4 px-6 md:px-8 w-full max-w-5xl mx-auto">
      <div className="flex space-x-1.5">
        <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse-slow"></div>
        <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse-slow delay-150"></div>
        <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse-slow delay-300"></div>
      </div>
      <span className="text-sm text-foreground/60 ml-2">AI is thinking...</span>
    </div>
  );
};

export default TypingIndicator;
