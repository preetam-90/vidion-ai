import axios from 'axios';
import { GROQ_API_KEY } from '../config';

const groqApi = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GROQ_API_KEY}`
  }
});

export const getCompletion = async (messages, model = "llama-3.3-70b-versatile") => {
  try {
    const response = await groqApi.post('/chat/completions', {
      model: model,
      messages: messages
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching completion:', error);
    throw error;
  }
};

// Add support for streaming completions
export const streamCompletion = async (messages, model = "llama-3.3-70b-versatile", callbacks = {}) => {
  try {
    const response = await groqApi.post('/chat/completions', {
      model: model,
      messages: messages,
      stream: true
    }, {
      responseType: 'stream'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error streaming completion:', error);
    throw error;
  }
}; 