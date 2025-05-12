import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { ChatProvider, ModelProvider } from './contexts';
import { Toaster } from './components/ui/sonner';
import OpenRouterTest from './components/OpenRouterTest';
import './App.css';
import { AVAILABLE_MODELS } from './types/chat';

// Debug: Ensure models are loaded
console.log("App initialization - Available models:", 
  AVAILABLE_MODELS.map(m => `${m.name} (${m.provider})`));

function App() {
  return (
    <Router>
      <ChatProvider>
        <ModelProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/test-openrouter" element={<OpenRouterTest />} />
          </Routes>
          <Toaster />
        </ModelProvider>
      </ChatProvider>
    </Router>
  );
}

export default App;
