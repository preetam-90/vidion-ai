import React, { createContext, useState, useContext, useEffect } from "react";
import { AVAILABLE_MODELS, Model } from "@/types/chat";

interface ModelContextProps {
  model: Model;
  setModel: (model: Model) => void;
  availableModels: Model[];
}

// Default model as Mercury
const DEFAULT_MODEL = AVAILABLE_MODELS.find(m => m.id === "openrouter-mercury") || AVAILABLE_MODELS[0];

// Ensure all models are properly initialized
console.log("Available models in context:", AVAILABLE_MODELS.map(m => `${m.name} (${m.provider})`));
console.log("Default model set to:", DEFAULT_MODEL.name);

const ModelContext = createContext<ModelContextProps>({
  model: DEFAULT_MODEL,
  setModel: () => {},
  availableModels: AVAILABLE_MODELS,
});

export const useModel = () => useContext(ModelContext);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get saved model from localStorage, use default if not found
  const [model, setModelState] = useState<Model>(() => {
    try {
      const savedModelId = localStorage.getItem("selectedModelId");
      if (savedModelId) {
        const foundModel = AVAILABLE_MODELS.find(m => m.id === savedModelId);
        if (foundModel) {
          console.log("Using saved model:", foundModel.name, foundModel.provider);
          return foundModel;
        }
      }
    } catch (error) {
      console.error("Error loading saved model:", error);
    }
    console.log("Using default model:", DEFAULT_MODEL.name, DEFAULT_MODEL.provider);
    return DEFAULT_MODEL; // Default to first model
  });

  // Save selected model to localStorage when it changes
  useEffect(() => {
    try {
      if (model && model.id) {
        localStorage.setItem("selectedModelId", model.id);
        console.log("Saved model to localStorage:", model.name, model.provider);
      }
    } catch (error) {
      console.error("Error saving model to localStorage:", error);
    }
  }, [model]);

  const setModel = (newModel: Model) => {
    try {
      if (newModel && newModel.id) {
        // Verify the model exists in our available models
        const validModel = AVAILABLE_MODELS.find(m => m.id === newModel.id);
        if (validModel) {
          console.log("Setting model to:", validModel.name, validModel.provider);
          setModelState(validModel);
        } else {
          console.warn("Model not found, using default:", DEFAULT_MODEL.name);
          setModelState(DEFAULT_MODEL);
        }
      } else {
        console.warn("Invalid model, using default:", DEFAULT_MODEL.name);
        setModelState(DEFAULT_MODEL);
      }
    } catch (error) {
      console.error("Error setting model:", error);
      setModelState(DEFAULT_MODEL);
    }
  };

  return (
    <ModelContext.Provider
      value={{
        model,
        setModel,
        availableModels: AVAILABLE_MODELS,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export default ModelContext; 