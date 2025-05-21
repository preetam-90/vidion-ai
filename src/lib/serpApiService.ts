import axios from 'axios';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

/**
 * Performs a web search using DuckDuckGo
 * @param query The search query
 * @returns Array of search results with title, link, and snippet
 */
export const performWebSearch = async (query: string): Promise<SearchResult[]> => {
  console.log(`[WebSearch] Starting search for query: "${query}"`);
  
  try {
    // Use the DuckDuckGo API which doesn't require an API key
    const url = 'https://api.duckduckgo.com/';
    const params = {
      q: query,
      format: 'json',
      no_html: '1',
      no_redirect: '1',
      skip_disambig: '1'
    };
    
    console.log(`[WebSearch] Making request to DuckDuckGo API`);
    const response = await axios.get(url, { params, timeout: 10000 });
    
    console.log(`[WebSearch] Response status:`, response.status);
    
    if (!response.data) {
      throw new Error('No data returned from DuckDuckGo API');
    }
    
    const results: SearchResult[] = [];
    
    // Add the Abstract if available
    if (response.data.AbstractText && response.data.AbstractURL) {
      results.push({
        title: response.data.Heading || 'Abstract',
        link: response.data.AbstractURL,
        snippet: response.data.AbstractText
      });
    }
    
    // Add Related Topics
    if (response.data.RelatedTopics && response.data.RelatedTopics.length > 0) {
      response.data.RelatedTopics.forEach((topic: any) => {
        if (topic.Result && topic.FirstURL) {
          // Extract title from HTML
          const titleMatch = topic.Result.match(/<a[^>]*>(.*?)<\/a>/);
          const title = titleMatch ? titleMatch[1] : 'Related Topic';
          
          // Extract text content
          const textMatch = topic.Text || '';
          
          results.push({
            title: title,
            link: topic.FirstURL,
            snippet: textMatch
          });
        } else if (topic.Topics && topic.Topics.length > 0) {
          // Handle nested topics
          topic.Topics.forEach((subTopic: any) => {
            if (subTopic.Result && subTopic.FirstURL) {
              const titleMatch = subTopic.Result.match(/<a[^>]*>(.*?)<\/a>/);
              const title = titleMatch ? titleMatch[1] : 'Related Subtopic';
              
              results.push({
                title: title,
                link: subTopic.FirstURL,
                snippet: subTopic.Text || ''
              });
            }
          });
        }
      });
    }
    
    // If no results found, try Wikipedia API as fallback
    if (results.length === 0) {
      console.log(`[WebSearch] No results from DuckDuckGo, trying Wikipedia API`);
      
      try {
        const wikiUrl = `https://en.wikipedia.org/w/api.php`;
        const wikiParams = {
          action: 'query',
          list: 'search',
          srsearch: query,
          format: 'json',
          origin: '*',
          srlimit: 5
        };
        
        const wikiResponse = await axios.get(wikiUrl, { params: wikiParams, timeout: 5000 });
        
        if (wikiResponse.data.query && wikiResponse.data.query.search && wikiResponse.data.query.search.length > 0) {
          const wikiResults = wikiResponse.data.query.search.map((item: any) => ({
            title: item.title,
            link: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
            snippet: item.snippet.replace(/<\/?span[^>]*>/g, '') || ''
          }));
          
          console.log(`[WebSearch] Found ${wikiResults.length} results from Wikipedia API`);
          return wikiResults;
        }
      } catch (wikiError) {
        console.error('[WebSearch] Error with Wikipedia API:', wikiError);
      }
    }
    
    console.log(`[WebSearch] Found ${results.length} results`);
    return results.slice(0, 5); // Limit to 5 results
  } catch (error: any) {
    console.error('[WebSearch] Error performing web search:', error);
    
    // Try direct Wikipedia search as a last resort
    try {
      console.log(`[WebSearch] Trying direct Wikipedia search as last resort`);
      
      const wikiUrl = `https://en.wikipedia.org/w/api.php`;
      const wikiParams = {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*',
        srlimit: 5
      };
      
      const wikiResponse = await axios.get(wikiUrl, { params: wikiParams, timeout: 5000 });
      
      if (wikiResponse.data.query && wikiResponse.data.query.search && wikiResponse.data.query.search.length > 0) {
        const wikiResults = wikiResponse.data.query.search.map((item: any) => ({
          title: item.title,
          link: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
          snippet: item.snippet.replace(/<\/?span[^>]*>/g, '') || ''
        }));
        
        console.log(`[WebSearch] Found ${wikiResults.length} results from Wikipedia API`);
        return wikiResults;
      }
    } catch (wikiError) {
      console.error('[WebSearch] Error with Wikipedia API fallback:', wikiError);
    }
    
    // As a last resort, return some mock data
    console.log('[WebSearch] Returning mock data as fallback');
    return [
      {
        title: `Search results for: ${query}`,
        link: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        snippet: 'The web search API encountered an error. This is a fallback response with a link to DuckDuckGo search results for your query.'
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
  
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  return `Search results as of ${currentDate}:\n\n` + 
    results
      .map((result, index) => {
        return `[${index + 1}] ${result.title}\nURL: ${result.link}\nSummary: ${result.snippet}\n`;
      })
      .join('\n');
}; 