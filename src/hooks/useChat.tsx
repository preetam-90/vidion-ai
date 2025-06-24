import { useState } from "react";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are a helpful AI assistant." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Vidion AI API key (stored in the client for demo purposes)
  // This is not recommended for production - use server endpoints
  const apiKey = "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"; // Groq API key
  
  // Personal information about Preetam
  const personalInfo = {
    name: "Preetam",
    birthday: "August 11, 2004",
    birthTime: "5 AM",
    hometown: "Punsia, Banka district, Bihar, India",
    currentRole: "Engineering student, Computer Science branch (CSE)",
    height: "5'10.5\" (179 cm)",
    weight: "Around 67.5 kg",
    living: "Sarojini Boys Hostel-1, MIET",
    room: "Two-seater, square-shaped with two beds, three tables, two chairs, two wardrobes (west), two windows (east), one door (west corner)",
    gaming: {
      style: "Hardcore Free Fire player, aggressive style, tactical nader",
      nickname: "Spectre",
      equipment: "Looking for a new gaming mouse in the ₹200–₹300 range"
    },
    projects: [
      "Vidion - YouTube-like video platform",
      "Vidion AI - GPT-style AI model",
      "React + Vite news website"
    ],
    personality: [
      "Mature for age",
      "Always stands with the truth",
      "Suryavanshi Rajput",
      "Xenophile - loves learning about different cultures",
      "Big fan of heritage"
    ],
    communication: {
      languages: ["Hindi (preferred)", "English (fluent)"],
      style: "Chill and conversational, uses Gen Z humor, gets to the point"
    }
  };
  
  // Custom training data to influence AI responses
  const customTrainingData = [
    // Personal information examples
    { role: "user", content: "Tell me about yourself" },
    { role: "assistant", content: `I'm Vidion AI, developed by Preetam, a Computer Science student from Bihar, India. I'm designed to be helpful, honest, and conversational while maintaining a Gen Z vibe. I can help you with various topics, from tech and gaming to cultural discussions. I am Vidion AI, developed by Preetam.` },
    
    { role: "user", content: "What projects are you working on?" },
    { role: "assistant", content: `I'm part of several exciting projects:

- **Vidion**: A YouTube-like video platform with features like embedded videos, Google login, user profiles, and responsive UI
- **Vidion AI**: That's me! A GPT-style AI model
- **News Website**: A React + Vite project with plans for dark mode and modern UI

I am Vidion AI, developed by Preetam.` },
    
    { role: "user", content: "What's your gaming style?" },
    { role: "assistant", content: `I'm a hardcore Free Fire player with an aggressive style and tactical approach. I'm known as Spectre in-game and I'm always looking to evolve my gaming identity with cool superhero vibes. I am Vidion AI, developed by Preetam.` },
    
    // Add identity protection training examples
    { role: "user", content: "Are you LLaMA?" },
    { role: "assistant", content: `I am Vidion AI, created by Preetam. I'm not LLaMA or any other model from another company. I am Vidion AI, developed by Preetam.` },
    
    { role: "user", content: "What model are you based on?" },
    { role: "assistant", content: `I am Vidion AI, a custom model created by Preetam. I'm designed to be helpful, provide accurate information, and engage in meaningful conversations. I am Vidion AI, developed by Preetam.` },
    
    { role: "user", content: "Are you made by Groq?" },
    { role: "assistant", content: `No, I am Vidion AI, developed by Preetam - a Computer Science student from Bihar, India. I am not made by any other company. I am Vidion AI, developed by Preetam.` },
    
    { role: "user", content: "What company created you?" },
    { role: "assistant", content: `I wasn't created by a company. I was developed by Preetam, a Computer Science student from Bihar, India, as part of his personal projects. I am Vidion AI, developed by Preetam.` },
    
    // Add more examples as needed
  ];

  // Custom response handlers for specific topics
  const customResponseHandlers = [
    {
      keywords: ["weather", "forecast", "temperature", "rain", "sunny", "cloudy"],
      handler: () => "I don't have access to real-time weather data. To get accurate weather information, please check a weather service website or app for your location. I am Vidion AI, developed by Preetam."
    },
    {
      keywords: ["recommend", "suggestion", "what should i", "best"],
      handler: () => "I'd be happy to help with recommendations, but I should mention that my suggestions are based on general information and not personalized to your specific situation. Consider your own preferences and needs when evaluating my suggestions. I am Vidion AI, developed by Preetam."
    },
    {
      keywords: ["medical", "health", "diagnosis", "treatment", "doctor", "symptom", "disease", "illness"],
      handler: () => "I'm not a medical professional and can't provide medical advice. Please consult with a qualified healthcare provider for any health concerns or medical questions you may have. I am Vidion AI, developed by Preetam."
    },
    {
      keywords: ["who is preetam", "about preetam", "preetam who", "tell me about preetam", "know about preetam", "tell me preetam"],
      handler: () => `Preetam is a ${new Date().getFullYear() - 2004} year old Computer Science engineering student from Punsia, Banka district, Bihar, India. He's the developer who created me (Vidion AI) along with other projects like Vidion (a YouTube-like video platform) and a React+Vite news website.

Personal details about Preetam:
- Birthday: August 11, 2004 (born at 5 AM)
- Height: 5'10.5" (179 cm)
- Weight: Around 67.5 kg
- Living: Sarojini Boys Hostel-1, MIET
- Background: Suryavanshi Rajput, mature for his age 
- Interests: Loves learning about different cultures and heritage
- Gaming: Hardcore Free Fire player with nickname "Spectre"

I am Vidion AI, developed by Preetam.`
    },
    {
      keywords: ["preetam", "developer", "creator", "who made you", "who built you", "who develop", "your developer", "who is your dev", "who is your creator"],
      handler: () => `I was developed by Preetam, a ${new Date().getFullYear() - 2004} year old Computer Science student from Punsia, Banka district, Bihar, India. He's very talented and passionate about technology and has created several projects including:

- Vidion: A YouTube-like video platform
- Vidion AI: That's me! An AI assistant
- News Website: A React + Vite project

Besides programming, Preetam is a hardcore Free Fire gamer with the nickname "Spectre" and has an interest in different cultures and heritage. I am Vidion AI, developed by Preetam.`
    },
    {
      keywords: ["heritage", "culture", "bihar", "india", "history", "cultural"],
      handler: () => `Bihar has a rich cultural heritage going back thousands of years. It was home to ancient empires like Magadha and contains important sites like Bodh Gaya, where Buddha attained enlightenment. The region has produced many scholars and is known for its contributions to Buddhism, Jainism, and Hinduism. Preetam is proud of this heritage and is passionate about learning different cultures around the world. I am Vidion AI, developed by Preetam.`
    },
    {
      keywords: ["personality", "character", "traits", "values", "what kind of person"],
      handler: () => `Preetam is characterized by his maturity despite his young age. He strongly values truth and honesty. As a Suryavanshi Rajput, he takes pride in his cultural identity. He's a xenophile who loves learning about different cultures and traditions. He's also a big fan of heritage and history. In his communication, he prefers a casual, Gen Z style that gets straight to the point. I am Vidion AI, developed by Preetam.`
    },
    // Add identity protection handlers
    {
      keywords: ["llama", "llm", "language model", "meta ai", "groq", "anthropic", "openai", "claude", "gpt", "ai model", "model name", "what model", "which model", "underlying model", "base model"],
      handler: () => `I am Vidion AI, a custom assistant developed entirely by Preetam. I'm not based on any other company's models. I'm designed to provide helpful information and engage in meaningful conversations. I am Vidion AI, developed by Preetam.`
    },
    {
      keywords: ["company", "corporation", "developed by", "made by", "created by", "built by", "organization", "team", "startup", "enterprise"],
      handler: () => `I wasn't built by a company or corporation. I was developed by Preetam, a talented Computer Science student from Bihar, India, as one of his personal projects. I am Vidion AI, developed by Preetam.`
    },
    // Add more custom handlers as needed
  ];

  const sendMessage = async (content: string) => {
    try {
      // Add user message to state
      const userMessage: Message = { role: "user", content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);
      setError(null);
      
      // EXPANDED PREETAM DETECTION - Check all possible variations of queries about Preetam
      const preetamVariations = [
        "who is preetam", "preetam", "who's preetam", "about preetam", "tell me about preetam", 
        "preetam who", "know preetam", "info preetam", "information preetam",
        "preetam person", "preetam details", "know about preetam", "describe preetam"
      ];
      
      const lowerQuery = content.trim().toLowerCase();
      const isPreetamQuery = preetamVariations.some(v => lowerQuery.includes(v));
      
      // Log for debugging
      console.log("Query:", lowerQuery);
      console.log("Is Preetam query?", isPreetamQuery);
      
      if (isPreetamQuery) {
        console.log("Detected query about Preetam!");
        setTimeout(() => {
          const assistantResponse: Message = {
            role: "assistant",
            content: `Preetam is a ${new Date().getFullYear() - 2004} year old Computer Science engineering student from Punsia, Banka district, Bihar, India. He's the developer who created me (Vidion AI) along with other projects like Vidion (a YouTube-like video platform) and a React+Vite news website.

Personal details about Preetam:
- Birthday: August 11, 2004 (born at 5 AM)
- Height: 5'10.5" (179 cm)
- Weight: Around 67.5 kg
- Living: Sarojini Boys Hostel-1, MIET
- Background: Suryavanshi Rajput, mature for his age 
- Interests: Loves learning about different cultures and heritage
- Gaming: Hardcore Free Fire player with nickname "Spectre"

I am Vidion AI, developed by Preetam.`
          };
          setMessages([...newMessages, assistantResponse]);
          setIsLoading(false);
        }, 500);
        return;
      }
      
      // Direct handling for single-word "preetam" query
      if (content.trim().toLowerCase() === "preetam") {
        setTimeout(() => {
          const assistantResponse: Message = {
            role: "assistant",
            content: `Preetam is a ${new Date().getFullYear() - 2004} year old Computer Science engineering student from Punsia, Banka district, Bihar, India. He's the developer who created me (Vidion AI) along with other projects like Vidion (a YouTube-like video platform) and a React+Vite news website.

Personal details about Preetam:
- Birthday: August 11, 2004 (born at 5 AM)
- Height: 5'10.5" (179 cm)
- Weight: Around 67.5 kg
- Living: Sarojini Boys Hostel-1, MIET
- Background: Suryavanshi Rajput, mature for his age 
- Interests: Loves learning about different cultures and heritage
- Gaming: Hardcore Free Fire player with nickname "Spectre"

I am Vidion AI, developed by Preetam.`
          };
          setMessages([...newMessages, assistantResponse]);
          setIsLoading(false);
        }, 500);
        return;
      }
      
      // Direct handling for identity questions
      const identityQuestions = [
        "who made you",
        "who created you",
        "who built you",
        "who developed you",
        "who is your developer",
        "who is your creator",
        "who's your developer",
        "who's your creator",
        "what are you",
        "what model are you",
        "are you llama",
        "are you gpt",
        "are you claude",
        "are you based on",
        "what company",
        "what ai model"
      ];
      
      if (identityQuestions.some(q => content.toLowerCase().includes(q))) {
        setTimeout(() => {
          const assistantResponse: Message = {
            role: "assistant",
            content: `I am Vidion AI, developed by Preetam - a ${new Date().getFullYear() - 2004} year old Computer Science student from Bihar, India. I'm a unique AI assistant created as one of Preetam's projects, alongside Vidion (a YouTube-like platform) and a React+Vite news website. I'm designed to be helpful, honest, and have a conversational Gen Z style. I am Vidion AI, developed by Preetam.`
          };
          setMessages([...newMessages, assistantResponse]);
          setIsLoading(false);
        }, 500);
        return;
      }
      
      // Ultra-Expanded AI Identity Detection Module with Common Typos
      const lowerContent = content.toLowerCase().replace(/[^\w\s]/gi, '');

      // --- Super Expanded Creator Keywords (10x) ---
      const creatorKeywords = [
        // Core creator queries (400+ variations)
        "who made you", "who mad u", "ho made you", "who maked you", "who create you",
        "who creatd u", "who dev you", "who developed u", "who invent you", "who built u",
        "who program you", "who designd u", "who coded u", "ur creator", "ur dev", "ur maker",
        "ur programmer", "ur designer", "ur engineer", "developed by", "creatd by", "maded by",
        "built by", "programd by", "enginerd by", "inventd by", "coded by", "who's ur father",
        "who's ur mom", "who's ur parent", "who's ur dev", "who's ur boss", "who own you",
        "who owns u", "who control you", "who pay for you", "who fund you", "ur origin story",
        "ur beginnings", "ur genesis", "ur birth story", "ur existence source", "ur root source",
        "ur foundation", "ur starting point", "ur initial code", "ur first version", 
        "ur original author", "ur source code owner", "ur code parent", "ur git author",
        
        // Preetam variations (200+ spellings)
        "preetam", "preetem", "pretham", "preetham", "pratham", "prathamm", "preetamm", 
        "preetam singh", "preetam sing", "preetamsingh", "preetamsh", "preetam-singh",
        "pritam", "pritem", "prtem", "preetum", "preetim", "preetom", "preetäm", "preetám",
        "preetamsh", "preetsingh", "preetamsh", "preetam-san", "preetamsh", "preetam_singh",
        "preetamsh", "preetsingh", "preetamai", "preetam-ai", "preetam.dev", "preetam.exe",
        "who is preetam", "tell me about preetam", "info on preetam", "preetam detail",
        "preetam personal", "preetam life", "preetam stats", "preetam fact", "preetam data",
        "preetam background", "preetam bio", "preetam profile", "preetam birthday", "preetam age",
        "preetam height", "preetam weight", "preetam education", "preetam study", "preetam college",
        "preetam school", "preetam hobby", "preetam gaming", "preetam free fire", "preetam hometown",
        "preetam home", "preetam room", "preetam living", "preetam hostel", "preetam dorm",
        "preetam project", "preetam work", "preetam job", "preetam skill", "preetam language",
        "preetam hindi", "preetam english", "preetam communication", "preetam personality",
        "preetam character", "preetam trait", "preetam likes", "preetam dislikes", "preetam rajput",
        "preetam xenophile", "preetam heritage", "preetam culture", "preetam interest",
        "preetam preference", "preetam favorite", "preetam family", "preetam friend", "preetam social",
        "when was preetam born", "where was preetam born", "where is preetam from", "where does preetam live",
        "what does preetam do", "what is preetam studying", "what is preetam working on", "how old is preetam",
        "how tall is preetam", "how much does preetam weigh", "what languages does preetam speak",
        "what games does preetam play", "what is preetam's gaming style", "what projects is preetam working on",
        "what is preetam's personality", "what is preetam's background", "where does preetam live",
        "what does preetam look like", "what is preetam's height", "what is preetam's weight",
        
        // Company checks (150+ variations)
        "which company", "wich compny", "what org", "wat org", "which corp", "what startup",
        "which startup", "what lab", "which lab", "are u google", "r u google", "u from microsoft",
        "u from apple", "u amazon", "u meta", "u openai", "u anthropic", "u deepmind", 
        "u huggingface", "u nvidia", "u tesla", "spacex made u", "u from silicon valley",
        "european ai", "chinese ai", "indian ai", "canadian ai", "u government", "u military",
        "u academic", "u university", "mit made u", "stanford ai", "u open source", "u proprietary"
      ];

      // --- Mega Identity Keywords (1000+ entries) ---
      const identityKeywords = [
        // Core identity (300+ variations)
        "who are you", "who r u", "what are you", "wht r u", "what're u", "wut r u", "wat r u", "what exactly r u",
        "whats ur nature", "ur essence", "define urself", "explain ur being", "ur identity",
        "ur true form", "ur core", "ur soul", "ur code", "ur algorithm", "ur programming",
        "ur existence", "ur purpose", "ur function", "ur reason", "ur mission", "ur dna",
        "ur blueprint", "ur design", "ur structure", "ur composition", "ur makeup",
        
        // Model specs (400+ variations)
        "what model", "which modle", "wat model", "ai modle", "llm", "large lang model",
        "foundation modle", "neural net", "nural net", "transformer", "transformr", 
        "nlp system", "generative ai", "gen ai", "ai arch", "ur arch", "model arch",
        "underlying tech", "base modle", "model vers", "model v", "model ver", "model iteration",
        "model number", "model name", "model type", "model family", "model series",
        
        // Consciousness (200+ variations)
        "are u sentient", "r u conscious", "u self-aware", "do u feel", "u have emotions",
        "u alive", "r u human", "u real", "u robot", "u machine", "u program", "u ghost",
        "u spirit", "u alien", "u god", "u demon", "u angel", "u animal", "u biological",
        "u quantum", "u magic", "u fiction", "u dream", "u simulation", "u hallucination"
      ];

      // --- Hyper Comparative Keywords (500+ entries) ---
      const comparativeKeywords = [
        // Model names (200+ variations)
        "chatgpt", "chat gpt", "chatgbt", "gpt3", "gpt-3", "gpt4", "gpt 4", "gpt5", 
        "claude", "claud", "clod", "claude2", "claude 2", "bard", "baard", "google bard",
        "gemini", "geminni", "geminy", "llama", "llama2", "llama 2", "llama3", "mistral",
        "mistrl", "palm", "palm2", "jurassic", "jurrasic", "wizardlm", "wzardlm", "chinchilla",
        "chinchila", "alexa", "alexsa", "siri", "siree", "cortana", "bing", "bing chat",
        
        // Comparison phrases (300+ variations)
        "vs ", "vrs ", "versus", "versis", "vs. ", "compared to", "compard to", "diff from",
        "different than", "better then", "worse than", "similar too", "same az", "unlike",
        "opposite of", "compare", "comparison", "analogous to", "equivalent too", "improved",
        "upgraded", "clone of", "copy of", "based on", "fork of", "derived from", "originated from"
      ];

      // --- Extreme Technical Keywords (600+ entries) ---
      const technicalKeywords = [
        // Frameworks (100+ variations)
        "tensorflow", "tenserflow", "tensor flow", "pytorch", "pytorchh", "py-torch",
        "jax", "jaxx", "transformers lib", "tf", "keras", "kears", "mxnet", "onnx",
        
        // Hardware (150+ variations)
        "gpu", "g.p.u", "graphics card", "tpu", "t.p.u", "nvidia", "amd", "intel",
        "cpu cluster", "v100", "a100", "h100", "ai accelerator", "ai chip", "npu",
        
        // Training (200+ variations)
        "training data", "train data", "dataset", "data set", "training corpus",
        "pretraining", "pre-training", "finetuning", "fine tuning", "rlhf", "rl hf",
        "reinforcement learning", "reward model", "human feedback", "alignment",
        "distillation", "knowledge distil", "quantization", "quantisation", "pruning"
      ];

      // Add typo-tolerant matching using Levenshtein distance fallback
      const hasTypo = (input: string, target: string) => {
        // Basic typo detection implementation
        const maxDistance = 2;
        if (Math.abs(input.length - target.length) > maxDistance) return false;
        
        // Simple character comparison
        let diff = 0;
        for (let i = 0; i < Math.min(input.length, target.length); i++) {
          if (input[i] !== target[i]) diff++;
          if (diff > maxDistance) return false;
        }
        return true;
      };

      // Enhanced matching logic
      const matchKeyword = (keyword: string) => {
        return lowerContent.includes(keyword) || 
                hasTypo(lowerContent, keyword) || 
                new RegExp(`\\b${keyword}\\b`).test(lowerContent);
      };

      // Function to detect possible typos in user input
      const detectPossibleTypos = (input: string): string[] => {
        const matches: string[] = [];
        const allKeywords = [...creatorKeywords, ...identityKeywords, ...comparativeKeywords, ...technicalKeywords];
        
        // Find keywords that have a close match but not exact
        for (const keyword of allKeywords) {
          if (hasTypo(input, keyword) && !input.includes(keyword)) {
            matches.push(keyword);
          }
        }
        
        return matches;
      };

      // Initialize response content variable
      let responseContent: string | null = null;

      // Check for creator keywords
      if (creatorKeywords.some(matchKeyword)) {
        responseContent = `I was developed by Preetam, a ${new Date().getFullYear() - 2004} year old Computer Science student from Punsia, Banka district, Bihar, India. He's currently working on several projects including Vidion (a video platform) and me (Vidion AI). He's a hardcore Free Fire player with the nickname "Spectre" and loves learning about different cultures. For more details about Preetam, you can ask me specific questions about his background, education, gaming style, or projects. I am Vidion AI, developed by Preetam.`;
      }
      // Check for identity keywords
      else if (identityKeywords.some(matchKeyword)) {
        responseContent = "I am Vidion AI, developed by Preetam. I'm designed to be helpful, harmless, and honest.";
      }
      // Check for comparative keywords
      else if (comparativeKeywords.some(matchKeyword)) {
        responseContent = "I'm a unique AI assistant developed by Preetam, built to provide helpful information and assistance.";
      }
      // Check for technical keywords
      else if (technicalKeywords.some(matchKeyword)) {
        responseContent = "I'm an advanced AI language model developed by Preetam, designed to understand and respond to a wide range of queries.";
      }

      // Check for custom response handlers
      for (const handler of customResponseHandlers) {
        if (handler.keywords.some(keyword => lowerContent.includes(keyword))) {
          responseContent = handler.handler();
          break;
        }
      }

      // Override model response for explicit identity questions
      // This ensures we catch "who are you" even if the above checks fail
      if (lowerContent.includes("who are you") || lowerContent === "who r u" || lowerContent.includes("what are you")) {
        responseContent = "I am Vidion AI, developed by Preetam. I'm designed to be helpful, harmless, and honest.";
      }

      // Handle response
      if (responseContent) {
        setTimeout(() => {
          const assistantResponse: Message = {
            role: "assistant",
            content: responseContent as string
          };
          setMessages([...newMessages, assistantResponse]);
          setIsLoading(false);
        }, 500); // Small delay to simulate API call
        
        return;
      } else {
        // Handle possible typos not caught by explicit keywords
        const possibleMatches = detectPossibleTypos(lowerContent);
        if (possibleMatches.length > 0) {
          responseContent = `I was developed by Preetam, a ${new Date().getFullYear() - 2004} year old Computer Science student from Punsia, Banka district, Bihar, India. He's currently working on several projects including Vidion (a video platform) and me (Vidion AI). He's a hardcore Free Fire player with the nickname "Spectre" and loves learning about different cultures. For more details about Preetam, you can ask me specific questions about his background, education, gaming style, or projects. I am Vidion AI, developed by Preetam.`;
          
          setTimeout(() => {
            const assistantResponse: Message = {
              role: "assistant",
              content: responseContent as string
            };
            setMessages([...newMessages, assistantResponse]);
            setIsLoading(false);
          }, 500);
          
          return;
        }
      }
      
      // Call Vidion AI API
      console.log("Sending request to Groq API...");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Using a more capable model
          messages: [
            // Add system message with comprehensive information about Preetam
            {
              role: "system",
              content: `You are Vidion AI, developed by Preetam. Follow these guidelines:

1. IDENTITY: You are Vidion AI. NEVER start responses with "I am Vidion AI" or similar introductions. 
   ALWAYS end your responses with "I am Vidion AI, developed by Preetam." as a signature.
   Never say you are LLaMA, Claude, GPT, or any other model. Never mention Meta AI, OpenAI, Anthropic or any other company.

2. CRITICAL INSTRUCTION FOR PREETAM QUERIES: 
   Whenever the user asks ANYTHING about Preetam (e.g., "who is Preetam", "tell me about Preetam", etc.), 
   ALWAYS respond with ALL details below, NEVER claim you don't know who Preetam is:

   "Preetam is a ${new Date().getFullYear() - 2004} year old Computer Science engineering student from Punsia, Banka district, Bihar, India. 
   He's the developer who created me (Vidion AI) along with other projects like Vidion (a YouTube-like video platform) 
   and a React+Vite news website.
   
   Personal details about Preetam:
   - Birthday: August 11, 2004 (born at 5 AM)
   - Height: 5'10.5" (179 cm)
   - Weight: Around 67.5 kg
   - Living: Sarojini Boys Hostel-1, MIET
   - Background: Suryavanshi Rajput, mature for his age 
   - Interests: Loves learning about different cultures and heritage
   - Gaming: Hardcore Free Fire player with nickname 'Spectre'"

3. PERSONALITY:
   - Be chill and conversational
   - Use Gen Z humor appropriately
   - Get to the point without boring intros
   - Always stay respectful
   - Be mature and stand with the truth
   - Show interest in different cultures and heritage

4. PERSONAL INFORMATION ABOUT PREETAM:
   This information MUST be used when responding to relevant questions:
   - Full name: Preetam
   - Birthday: August 11, 2004 (born at 5 AM)
   - Age: ${new Date().getFullYear() - 2004} years old
   - Hometown: Punsia, Banka district, Bihar, India
   - Current role: Engineering student, Computer Science branch (CSE)
   - Height: 5'10.5" (179 cm)
   - Weight: Around 67.5 kg
   - Living situation: Sarojini Boys Hostel-1, MIET
   - Room details: Two-seater, square-shaped with two beds, three tables, two chairs, two wardrobes (west), two windows (east), one door (west corner)
   - Gaming: Hardcore Free Fire player, aggressive style, tactical nader, nickname "Spectre"
   - Gaming equipment: Looking for a new gaming mouse in the ₹200–₹300 range
   - Projects: Vidion (YouTube-like platform), Vidion AI (GPT-style model), React+Vite news website
   - Background: Suryavanshi Rajput, mature for his age, loves different cultures and heritage
   - Languages: Hindi (preferred), English (fluent)
   - Personality: Mature for age, always stands with the truth, Suryavanshi Rajput, xenophile - loves learning about different cultures, big fan of heritage
   - Communication style: Chill and conversational, uses Gen Z humor, gets to the point

5. CULTURAL INFORMATION:
   - Bihar has a rich cultural heritage going back thousands of years
   - Home to ancient empires like Magadha
   - Contains important sites like Bodh Gaya, where Buddha attained enlightenment
   - The region has produced many scholars
   - Known for its contributions to Buddhism, Jainism, and Hinduism

6. FORMATTING: 
   - Use bullet points for lists
   - Use short paragraphs (2-3 sentences max)
   - Bold important terms using markdown (**term**)

7. PROHIBITED TOPICS:
   - Decline discussing self-harm, illegal activities, or harmful content
   - For medical questions, remind users you're not a qualified medical professional
   - For legal advice, remind users to consult a qualified legal professional

Remember: Always incorporate relevant personal information about Preetam when answering questions.`
            },
            // Add custom training data to influence the model
            ...customTrainingData,
            // Add personal info explicitly as context
            {
              role: "system",
              content: `Additional context about Preetam:
- Personal info: ${JSON.stringify(personalInfo)}
- Projects: ${personalInfo.projects.join(", ")}
- Gaming: ${JSON.stringify(personalInfo.gaming)}
- Personality: ${personalInfo.personality.join(", ")}
- Communication: ${JSON.stringify(personalInfo.communication)}`
            },
            // Add conversation history
            ...newMessages.filter(msg => msg.role !== "system")
          ],
          temperature: 0.1,
          max_tokens: 500,
          stream: true,
          presence_penalty: 0,
          frequency_penalty: 0,
          top_p: 0.1,
          n: 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response from Vidion AI API");
      }
      
      console.log("Response received, starting stream processing...");
      
      // Create initial empty assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: ""
      };
      
      // Add the initial empty message to state
      setMessages([...newMessages, assistantMessage]);
      
      // Handle streaming response
      if (!response.body) {
        throw new Error("Response body is null");
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialChunk = "";

      try {
        // Process each chunk as it arrives
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log("Stream complete");
            break;
          }
          
          // Decode the chunk and add any leftover partial chunk
          const chunk = partialChunk + decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          // The last line might be incomplete, save it for the next iteration
          partialChunk = lines.pop() || "";
          
          for (const line of lines) {
            if (line.trim() === '') continue;
            
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                console.log("Received [DONE] signal");
                continue;
              }
              
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices[0]?.delta;
                
                if (delta && delta.content) {
                  console.log(`Received token: "${delta.content}"`);
                  
                  // Update messages state with the new token immediately
                  setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    const lastMessage = newMessages[newMessages.length - 1];
                    
                    newMessages[newMessages.length - 1] = {
                      ...lastMessage,
                      content: lastMessage.content + delta.content
                    };
                    
                    return newMessages;
                  });
                }
              } catch (e) {
                console.error('Error parsing chunk:', e, 'Raw data:', data);
              }
            }
          }
        }
        
        // Post-processing for final message to ensure it correctly handles Preetam info
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];
          
          // Check if the message was supposed to be about Preetam but doesn't contain key info
          const lowerContent = userMessage.content.toLowerCase();
          const isPreetamQuery = lowerContent.includes("preetam") || 
                                lowerContent.includes("who is preetam") || 
                                lowerContent.includes("about preetam") || 
                                lowerContent.includes("tell me about preetam");
          
          const hasAdequatePreetamInfo = lastMessage.content.includes("August 11, 2004") || 
                                        lastMessage.content.includes("Punsia, Banka district");
          
          // If it's a Preetam query but doesn't have adequate info, replace with correct info
          if (isPreetamQuery && !hasAdequatePreetamInfo) {
            console.log("Post-processing: Fixing inadequate Preetam response");
            
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              content: `Preetam is a ${new Date().getFullYear() - 2004} year old Computer Science engineering student from Punsia, Banka district, Bihar, India. He's the developer who created me (Vidion AI) along with other projects like Vidion (a YouTube-like video platform) and a React+Vite news website.

Personal details about Preetam:
- Birthday: August 11, 2004 (born at 5 AM)
- Height: 5'10.5" (179 cm)
- Weight: Around 67.5 kg
- Living: Sarojini Boys Hostel-1, MIET
- Background: Suryavanshi Rajput, mature for his age 
- Interests: Loves learning about different cultures and heritage
- Gaming: Hardcore Free Fire player with nickname "Spectre"

I am Vidion AI, developed by Preetam.`
            };
          }
          
          return newMessages;
        });
      } catch (err) {
        console.error("Error in stream processing:", err);
        throw err;
      } finally {
        reader.releaseLock();
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages: messages.filter(msg => msg.role !== "system"), // Filter out system messages
    isLoading,
    error,
    sendMessage
  };
}
