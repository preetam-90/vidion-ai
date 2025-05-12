import React from 'react';
import { getCompletion } from '../lib/openrouterService';

const OpenRouterTest = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await getCompletion(input);
      setOutput(response.data);
    } catch (error) {
      console.error('Error fetching completion:', error);
    }
  };

  return (
    <div>
      <h1>OpenRouter Test</h1>
      <input type="text" value={input} onChange={handleInputChange} />
      <button onClick={handleSubmit}>Submit</button>
      <p>{output}</p>
    </div>
  );
};

export default OpenRouterTest;
