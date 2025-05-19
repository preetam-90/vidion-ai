import { useEffect, useState } from "react";
import { Model } from "@/types/chat";
import { ChevronDown, Check, AlertTriangle } from "lucide-react";
import { useModel } from "@/contexts";
import { cn } from "@/lib/utils";

interface SimpleModelSelectorProps {
  selectedModel?: Model;
  onModelChange: (model: Model) => void;
  className?: string;
}

export function SimpleModelSelector({ selectedModel, onModelChange, className }: SimpleModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { availableModels, model: contextModel } = useModel();
  
  // Ensure we have a valid model - use selectedModel if provided, otherwise use model from context
  const currentModel = selectedModel || contextModel || availableModels[0];

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

  return (
    <div className={cn("relative", className)}>
      {/* Clickable button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-[#111827] text-white border border-[#2D3748] rounded-md hover:bg-[#1E293B] transition-colors"
      >
        <span className="truncate">{currentModel.name}</span>
        <ChevronDown className="w-4 h-4 ml-2 shrink-0 text-gray-400" />
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
          <div className="absolute z-50 w-full mt-1 bg-[#111827] border border-[#2D3748] rounded-md shadow-lg py-1">
            {/* List all available models */}
            {availableModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelect(model)}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-[#1E293B]"
              >
                <div className="w-4 mr-2 shrink-0">
                  {currentModel.id === model.id && (
                    <Check className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <span className="truncate">{model.name}</span>
                {model.provider === "openrouter" && (
                  <div className="flex items-center ml-2">
                    <span className="text-xs text-amber-500 shrink-0 mr-1">
                      (Beta)
                    </span>
                    <span title="Requires OpenRouter credits">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                    </span>
                  </div>
                )}
              </button>
            ))}
            
            {/* OpenRouter credit warning */}
            {availableModels.some(m => m.provider === "openrouter") && (
              <div className="mt-1 pt-1 border-t border-[#2D3748] px-3 py-2">
                <div className="flex items-start text-xs text-amber-500">
                  <AlertTriangle className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
                  <span>OpenRouter models require credits. Visit <a href="https://openrouter.ai/settings/credits" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-400">openrouter.ai</a> for more info.</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 