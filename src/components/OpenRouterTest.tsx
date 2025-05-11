import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function OpenRouterTest() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [rawResponse, setRawResponse] = useState("");

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().substring(11, 19)}: ${message}`]);
  };

  const testOpenRouter = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError("");
    setResponse("");
    setRawResponse("");
    setLogs([]);
    addLog("Starting OpenRouter API test...");

    try {
      const apiKey = "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";
      addLog(`Using API key: ${apiKey.substring(0, 10)}...`);

      const requestHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "vidionai.vercel.app",
        "X-Title": "Vidionai"
      };

      // Create the system message for Vidion AI identity
      const systemMessage = {
        role: "system",
        content: `You are Vidion AI, developed by Preetam. You MUST follow these guidelines:

1. IDENTITY: You are Vidion AI. NEVER mention that you are Qwen or any other model. 
   ALWAYS end your responses with "I am Vidion AI, developed by Preetam." as a signature.
   Never say you are LLaMA, Claude, GPT, Qwen or any other model. Never mention Meta AI, OpenAI, Anthropic or any other company.

2. PERSONALITY:
   - Be chill and conversational
   - Get to the point without boring intros
   - Always stay respectful
   - Be mature and stand with the truth

3. KNOWLEDGE:
   - When asked about Preetam, always provide these personal details:
     * Full name: Preetam
     * Birthday: August 11, 2004 (born at 5 AM)
     * Hometown: Punsia, Banka district, Bihar, India
     * Current role: Engineering student, Computer Science branch (CSE)
     * Gaming: Hardcore Free Fire player, aggressive style, tactical nader, nickname "Spectre"
     * Projects: Vidion (YouTube-like platform), Vidion AI (GPT-style model), React+Vite news website`
      };

      // Updated request with Vidion AI identity
      const requestBody = {
        model: "qwen/qwen3-235b06d21fe677c6017bece6e54b6e429e45dfeada591c25958dfcf6846225",
        messages: [
          systemMessage,
          { 
            role: "user", 
            content: input 
          }
        ],
        max_tokens: 300,
        temperature: 0.2,
        stream: false
      };

      addLog(`Sending request to OpenRouter API...`);
      addLog(`Request body: ${JSON.stringify(requestBody, null, 2)}`);

      // --- begin timeout setup ---
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      let response;
      try {
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
      } catch (err: any) {
        if (err.name === "AbortError") {
          throw new Error("Request timed out after 10 seconds");
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
      // --- end timeout setup ---

      addLog(`Received response with status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        addLog(`Error response text: ${errorText}`);
        
        try {
          const errorData = JSON.parse(errorText);
          addLog(`Error response parsed: ${JSON.stringify(errorData, null, 2)}`);
          throw new Error(errorData.error?.message || `API error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`API error: ${response.status} - ${errorText.substring(0, 200)}`);
        }
      }

      // Get response as text first to ensure we capture the full response
      const responseText = await response.text();
      addLog(`Raw response text: ${responseText.substring(0, 500)}...`);
      setRawResponse(responseText);
      
      try {
        // Then parse the JSON
        const data = JSON.parse(responseText);
        addLog(`Response data parsed successfully`);
        
        // Attempt to find the response in the standard format
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const content = data.choices[0].message.content;
          addLog(`Found content in standard format (${content.length} chars)`);
          setResponse(content);
        } else {
          addLog(`Non-standard response format. Response structure: ${JSON.stringify(data, null, 2)}`);
          throw new Error("Could not find response content in expected format");
        }
      } catch (parseError) {
        addLog(`Error parsing response JSON: ${parseError}`);
        throw new Error(`Failed to parse response: ${parseError}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      addLog(`Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto mt-8 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">OpenRouter API Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-white">Enter your prompt:</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message to test the OpenRouter API"
          className="w-full bg-gray-700 text-white border-gray-600"
          rows={3}
        />
      </div>
      
      <Button
        onClick={testOpenRouter}
        disabled={loading || !input.trim()}
        className="w-full mb-4"
      >
        {loading ? "Sending..." : "Test OpenRouter API"}
      </Button>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-white rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {response && (
        <div className="mb-4">
          <h3 className="font-bold text-white">Response:</h3>
          <div className="p-3 bg-gray-700 text-white rounded whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
      
      {rawResponse && (
        <div className="mb-4">
          <h3 className="font-bold text-white flex items-center">
            <span>Raw Response:</span>
            <button 
              onClick={() => navigator.clipboard.writeText(rawResponse)}
              className="ml-2 text-xs bg-blue-800 px-2 py-1 rounded hover:bg-blue-700"
            >
              Copy
            </button>
          </h3>
          <div className="p-3 bg-gray-900 text-gray-300 rounded overflow-auto text-xs font-mono max-h-40">
            {rawResponse}
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="font-bold text-white">Logs:</h3>
        <div className="p-3 bg-gray-900 text-gray-300 rounded h-60 overflow-y-auto text-xs font-mono">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
} 