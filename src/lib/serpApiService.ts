import axios from 'axios';
import { SERPAPI_KEY } from '../config';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface SerpApiResponse {
  organic_results?: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
  error?: string;
  search_metadata?: {
    status: string;
    id: string;
  };
}

/**
 * Performs a web search using SerpAPI
 * @param query The search query
 * @returns Array of search results with title, link, and snippet
 */
export const performWebSearch = async (query: string): Promise<SearchResult[]> => {
  console.log(`[SerpAPI] Starting search for query: "${query}"`);
  
  try {
    // First try with serpapi.com
    try {
      const url = 'https://serpapi.com/search.json';
      const params = {
        api_key: SERPAPI_KEY,
        q: query,
        engine: 'google',
        num: 5,
        gl: 'us'
      };
      
      console.log(`[SerpAPI] Making request to: ${url}`);
      const response = await axios.get(url, { params, timeout: 5000 });
      
      console.log(`[SerpAPI] Response status:`, response.status);
      
      const data = response.data as SerpApiResponse;
      
      if (data.error) {
        throw new Error(`SerpAPI Error: ${data.error}`);
      }
      
      if (!data.organic_results || data.organic_results.length === 0) {
        console.log(`[SerpAPI] No organic results found in response`);
        return [];
      }
      
      const results = data.organic_results.map(result => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet || ''
      }));
      
      console.log(`[SerpAPI] Found ${results.length} results`);
      return results;
    } catch (serpApiError) {
      console.error('[SerpAPI] Error with serpapi.com, trying alternative API:', serpApiError);
      
      // Fallback to using Google Custom Search API
      try {
        const url = 'https://www.googleapis.com/customsearch/v1';
        const params = {
          key: SERPAPI_KEY, // Try using the same key
          cx: '017576662512468239146:omuauf_lfve', // This is a public custom search engine ID
          q: query
        };
        
        console.log(`[SerpAPI] Making fallback request to Google Custom Search API`);
        const response = await axios.get(url, { params, timeout: 5000 });
        
        if (!response.data.items || response.data.items.length === 0) {
          throw new Error('No results from Google Custom Search API');
        }
        
        const results = response.data.items.map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet || ''
        }));
        
        console.log(`[SerpAPI] Found ${results.length} results from fallback API`);
        return results;
      } catch (googleApiError) {
        console.error('[SerpAPI] Error with Google Custom Search API, trying Wikipedia API:', googleApiError);
        
        // Second fallback to Wikipedia API
        const wikiUrl = `https://en.wikipedia.org/w/api.php`;
        const wikiParams = {
          action: 'query',
          list: 'search',
          srsearch: query,
          format: 'json',
          origin: '*',
          srlimit: 5
        };
        
        console.log(`[SerpAPI] Making fallback request to Wikipedia API`);
        const wikiResponse = await axios.get(wikiUrl, { params: wikiParams, timeout: 5000 });
        
        if (!wikiResponse.data.query || !wikiResponse.data.query.search || wikiResponse.data.query.search.length === 0) {
          throw new Error('No results from Wikipedia API');
        }
        
        const wikiResults = wikiResponse.data.query.search.map((item: any) => ({
          title: item.title,
          link: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
          snippet: item.snippet.replace(/<\/?span[^>]*>/g, '') || ''
        }));
        
        console.log(`[SerpAPI] Found ${wikiResults.length} results from Wikipedia API`);
        return wikiResults;
      }
    }
  } catch (error: any) {
    console.error('[SerpAPI] All search attempts failed:', error);
    
    // As a last resort, return some mock data
    console.log('[SerpAPI] Returning mock data as fallback');
    return [
      {
        title: 'Search failed, but here is some information about your query',
        link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        snippet: 'The web search API encountered an error. This is a fallback response with a link to Google search results for your query.'
      },
      {
        title: 'Try searching on Wikipedia',
        link: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
        snippet: 'You can find information about your query on Wikipedia.'
      }
    ];
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