import axios from 'axios';
import { OPENROUTER_API_KEY } from '../config';

const openrouterApi = axios.create({
  baseURL: 'https://api.openrouter.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`
  }
});

export const getCompletion = async (input) => {
  try {
    const response = await openrouterApi.post('/completions', {
      input
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching completion:', error);
    throw error;
  }
};
