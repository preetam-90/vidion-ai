import axios from 'axios';
import { OPENROUTER_API_KEY } from '../config';

const openrouterApi = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'HTTP-Referer': 'https://vidion-ai.vercel.app/',
    'X-Title': 'Vidion AI'
  }
});

export const getCompletion = async (messages) => {
  try {
    const response = await openrouterApi.post('/chat/completions', {
      model: "qwen/qwq-32b:free",
      messages: messages
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching completion:', error);
    throw error;
  }
};
