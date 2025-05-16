import { useEffect, useState } from "react";
import { Model } from "@/types/chat";
import { ChevronDown, Check, Sparkles, Brain } from "lucide-react";
import { useModel } from "@/contexts";
import { cn } from "@/lib/utils";

interface SimpleModelSelectorProps {
  selectedModel: Model;
  onModelChange: (model: Model) => void;
  className?: string;
}

export function SimpleModelSelector({ selectedModel, onModelChange, className }: SimpleModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { availableModels } = useModel();
  
  // Ensure we have a valid model
  const currentModel = selectedModel || availableModels[0];

  // Log models on component mount
  useEffect(() => {
    console.log("SimpleModelSelector - Available models:", 
      availableModels.map(m => `${m.name} (${m.provider})`));
  }, [availableModels]);

  const handleSelect = (model: Model) => {
    console.log("Selected model:", model.name, model.id, model.provider);
    onModelChange(model);
    setIsOpen(false);
  };

  // Helper function to get provider badge color
  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case 'openrouter':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'groq':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'anthropic':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };
  
  // Helper function to check if a model supports thinking features
  const supportsThinking = (model: Model) => {
    return model.id === "openrouter-sonar" || model.modelId === "perplexity/sonar-pro";
  };

  return (
    <div className={cn("relative", className)}>
      {/* Clickable button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm bg-[#131b2e] text-white border border-[#1d2a45] rounded-md transition-all",
          "hover:bg-[#1d2a45] hover:border-[#2d3a55] focus:outline-none focus:ring-1 focus:ring-indigo-500/50",
          isOpen && "border-indigo-500/50 ring-1 ring-indigo-500/50"
        )}
      >
        <div className="flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-400" />
          <span className="truncate">{currentModel.name}</span>
          {supportsThinking(currentModel) && (
            <div className="ml-2 flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-1.5 py-0.5">
              <Brain className="w-3 h-3 text-indigo-400" />
              <span className="text-xs text-indigo-400">Thinking</span>
            </div>
          )}
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 ml-2 shrink-0 text-gray-400 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Background overlay to capture clicks */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown content */}
          <div className="absolute z-50 w-full mt-1 bg-[#131b2e] border border-[#1d2a45] rounded-md shadow-lg py-1 overflow-hidden scale-in">
            <div className="max-h-64 overflow-y-auto scrollbar-thin">
              {/* List all available models */}
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model)}
                  className={cn(
                    "flex items-center w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-[#1d2a45] transition-colors",
                    currentModel.id === model.id && "bg-[#1d2a45]/50"
                  )}
                >
                  <div className="w-4 mr-2 shrink-0">
                    {currentModel.id === model.id && (
                      <Check className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="truncate font-medium">{model.name}</span>
                    <div className="flex items-center mt-0.5 gap-1.5">
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full border",
                        getProviderBadgeColor(model.provider)
                      )}>
                        {model.provider}
                      </span>
                      {model.provider === "openrouter" && (
                        <span className="text-xs text-amber-400">
                          Beta
                        </span>
                      )}
                      {supportsThinking(model) && (
                        <div className="flex items-center gap-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-1 py-0.5">
                          <Brain className="w-2.5 h-2.5 text-indigo-400" />
                          <span className="text-xs text-indigo-400">Thinking</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 