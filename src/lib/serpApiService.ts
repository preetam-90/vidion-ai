import axios from 'axios';
import { SERPAPI_KEY } from '../config';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface SerpApiResponse {
  search_metadata?: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
    google_url: string;
    raw_html_file: string;
    total_time_taken: number;
  };
  search_parameters?: {
    engine: string;
    q: string;
  };
  search_information?: {
    organic_results_state: string;
    query_displayed: string;
    total_results: number;
    time_taken_displayed: number;
  };
  organic_results?: Array<{
    position: number;
    title: string;
    link: string;
    displayed_link: string;
    snippet: string;
    snippet_highlighted_words: string[];
    sitelinks?: {
      inline?: Array<{
        title: string;
        link: string;
      }>;
    };
  }>;
  error?: string;
}

/**
 * Performs a web search using SerpAPI
 * @param query The search query
 * @returns Array of search results with title, link, and snippet
 */
export const performWebSearch = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        api_key: SERPAPI_KEY,
        q: query,
        engine: 'google',
        num: 5 // Limit to 5 results for brevity
      }
    });

    const data = response.data as SerpApiResponse;
    
    if (data.error) {
      throw new Error(`SerpAPI Error: ${data.error}`);
    }
    
    if (!data.organic_results || data.organic_results.length === 0) {
      return [];
    }
    
    return data.organic_results.map(result => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet
    }));
  } catch (error) {
    console.error('Error performing web search:', error);
    throw error;
  }
};

/**
 * Formats search results into a readable string for the AI
 * @param results Array of search results
 * @returns Formatted string with search results
 */
export const formatSearchResultsForAI = (results: SearchResult[]): string => {
  if (results.length === 0) {
    return "No search results found.";
  }
  
  return results
    .map((result, index) => {
      return `[${index + 1}] ${result.title}\nURL: ${result.link}\nSummary: ${result.snippet}\n`;
    })
    .join('\n');
}; 