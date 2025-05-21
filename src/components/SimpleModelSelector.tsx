import { useState } from "react";
import { ChevronDown, Check, AlertTriangle } from "lucide-react";
import { useModel } from "@/contexts";
import { cn } from "@/lib/utils";
import { AVAILABLE_MODELS, Model } from "@/types/chat";

export function SimpleModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { model: currentModel, setModel } = useModel();

  const handleSelect = (model: Model) => {
    console.log("Selected model:", model.name, model.id, model.provider);
    setModel(model);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Clickable button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#1E293B] hover:bg-[#2D3748] rounded-md text-sm text-gray-300 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          {currentModel.name}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
          <div className="absolute z-50 w-48 mt-1 bg-[#111827] border border-[#2D3748] rounded-md shadow-lg py-1">
            {/* List all available models */}
            {AVAILABLE_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelect(m)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-[#2D3748]"
              >
                <span className="flex items-center gap-1.5">
                  {m.name}
                </span>
                {currentModel.id === m.id && <Check size={14} />}
              </button>
            ))}
            
            {/* OpenRouter credit warning */}
            {AVAILABLE_MODELS.some(m => m.provider === "openrouter") && (
              <div className="mt-1 pt-1 border-t border-[#2D3748] px-3 py-2">
                <div className="flex items-start text-xs text-amber-500">
                  <AlertTriangle className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
                  <span>OpenRouter models require credits.</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 