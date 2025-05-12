import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { AVAILABLE_MODELS, Model } from "@/types/chat";

interface ModelSelectorProps {
  selectedModel: Model;
  onModelChange: (model: Model) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Safety check to ensure we have a valid model
  useEffect(() => {
    if (!selectedModel) {
      onModelChange(AVAILABLE_MODELS[0]);
    }
  }, [selectedModel, onModelChange]);

  const handleModelSelect = (modelId: string) => {
    try {
      const model = AVAILABLE_MODELS.find(m => m.id === modelId);
      if (model) {
        onModelChange(model);
      }
      setOpen(false);
    } catch (error) {
      console.error("Error selecting model:", error);
    }
  };

  // Ensure we have a valid model to display
  const displayModel = selectedModel || AVAILABLE_MODELS[0];

  return (
    <div className="model-selector-container relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-sm bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            {displayModel.name}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          ref={popoverRef}
          className="w-[200px] p-0 border-gray-700 bg-gray-800 text-white z-50"
          align="center"
        >
          <Command className="bg-gray-800 text-white rounded-md">
            <CommandInput placeholder="Search model..." className="text-white" />
            <CommandEmpty className="text-gray-400">No model found.</CommandEmpty>
            <CommandGroup>
              {AVAILABLE_MODELS.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={handleModelSelect}
                  className="hover:bg-gray-700 cursor-pointer text-white aria-selected:bg-gray-700"
                >
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        displayModel.id === model.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{model.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
} 