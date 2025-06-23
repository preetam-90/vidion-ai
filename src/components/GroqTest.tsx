import React, { useState } from 'react';
import { getCompletion } from '../lib/groqService';

const GroqTest = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const messages = [
        {
          role: "user",
          content: input
        }
      ];
      
      const response = await getCompletion(messages, selectedModel);
      setOutput(response.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching completion:', error);
      setOutput('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Groq API Test</h1>
      <div className="flex flex-col gap-3">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Model:</label>
          <select 
            value={selectedModel} 
            onChange={handleModelChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
            <option value="meta-llama/llama-4-scout-17b-16e-instruct">Llama 4 Scout 17B</option>
          </select>
        </div>
        
        <textarea 
          className="border p-2 rounded-md" 
          value={input} 
          onChange={handleInputChange}
          placeholder="Enter your question here..."
          rows={4}
        />
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:bg-gray-400"
        >
          {isLoading ? 'Thinking...' : 'Submit'}
        </button>
        
        {output && (
          <div className="mt-4 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Response:</h2>
            <div className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap">{output}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroqTest; 