import React from 'react';
import { getCompletion } from '../lib/openrouterService';

const OpenRouterTest = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
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
      
      const response = await getCompletion(messages, "qwen/qwq-32b:free");
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
      <h1 className="text-2xl font-bold mb-4">QwQ 32B Test</h1>
      <div className="flex flex-col gap-3">
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

export default OpenRouterTest;
