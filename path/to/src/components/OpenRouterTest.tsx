// Extreme simplification - bare minimum request
const requestBody = {
  model: "qwen/qwen3-235b06d21fe677c6017bece6e54b6e429e45dfeada591c25958dfcf6846225",
  messages: [
    { 
      role: "user", 
      content: input 
    }
  ],
  max_tokens: 300,    // Reduced from 500 for faster responses
  temperature: 0.2,   // Lowered for speed
  stream: false
};

addLog(`Sending request to OpenRouter API with timeout...`);

// --- begin timeout setup ---
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

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
    throw new Error("Request timed out");
  }
  throw err;
} finally {
  clearTimeout(timeoutId);
}
// --- end timeout setup ---

addLog(`Received response with status: ${response.status}`); 