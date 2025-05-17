// Simple test script to verify Mercury model on OpenRouter
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use API key from environment variable
const API_KEY = process.env.VITE_OPENROUTER_API_KEY;

if (!API_KEY) {
  console.error("Error: VITE_OPENROUTER_API_KEY environment variable not set");
  process.exit(1);
}

async function testMercuryModel() {
  console.log("Testing Mercury model on OpenRouter...");
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "vidionai.vercel.app",
        "X-Title": "Vidion AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "inception/mercury-coder-small-beta",
        "messages": [
          {
            "role": "user",
            "content": "What is the meaning of life?"
          }
        ]
      })
    });
    
    const data = await response.json();
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    console.log("Response body:", JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log("\n✅ Mercury model is working correctly!");
    } else {
      console.log("\n❌ Mercury model test failed!");
    }
  } catch (error) {
    console.error("Error testing Mercury model:", error);
  }
}

testMercuryModel(); 