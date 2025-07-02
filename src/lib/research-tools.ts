// Research Tools API Integration: Exa Labs and Perplexity

// Types for API responses
interface ExaSearchResult {
  id: string;
  url: string;
  title: string;
  text: string;
  author?: string;
  publishedDate?: string;
  score: number;
}

interface ExaApiResponse {
  results: ExaSearchResult[];
  requestId: string;
}

interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta?: {
      role?: string;
      content?: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Exa Labs Search Integration
export const performExaSearch = async (query: string, numResults: number = 5): Promise<string> => {
    try {
      console.log(`🔍 [EXA] Starting search for: "${query}"`);
      console.log(`🔑 [EXA] API Key available: ${process.env.EXA_API_KEY ? 'YES' : 'NO'}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.EXA_API_KEY || '',
        },
        body: JSON.stringify({
          query: query,
          type: 'auto',
          useAutoprompt: true,
          numResults: numResults,
          contents: {
            text: true,
            highlights: {
              numSentences: 3,
              highlightsPerUrl: 2
            }
          },
          summary: {
            query: `Summarize the following information about: ${query}`
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log(`📡 [EXA] API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [EXA] API error: ${response.status} - ${errorText}`);
        throw new Error(`Exa API error: ${response.status}`);
      }

      const data: ExaApiResponse = await response.json();
      console.log(`📄 [EXA] Found ${data.results.length} results`);
      console.log(`🔍 [EXA] Processing results for RAG...`);

      // Format results for RAG processing
      const formattedResults = data.results.map((result, index) => {
        const publishedInfo = result.publishedDate ? ` (Published: ${new Date(result.publishedDate).toLocaleDateString()})` : '';
        const authorInfo = result.author ? ` by ${result.author}` : '';
        const scoreInfo = result.score !== undefined ? ` (Score: ${result.score.toFixed(3)})` : '';
        
        return `[Exa Result ${index + 1}] ${result.title}${authorInfo}${publishedInfo}${scoreInfo}
URL: ${result.url}
Content: ${result.text || 'No content available'}`;
      }).join('\n\n---\n\n');

      console.log(`✅ [EXA] Successfully retrieved ${data.results.length} results`);
      
      return formattedResults || 'No relevant content found via Exa search';
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏱️ [EXA] Search timeout after 30 seconds');
        return `Exa search timed out: Request took longer than 30 seconds`;
      }
      console.error('💥 [EXA] Search error:', error);
      return `Exa search unavailable: ${error instanceof Error ? error.message : String(error)}`;
    }
};

// Perplexity Research Integration
export const performPerplexityResearch = async (query: string): Promise<string> => {
    try {
      console.log(`🔍 [PERPLEXITY] Starting research for: "${query}"`);
      console.log(`🔑 [PERPLEXITY] API Key available: ${process.env.PERPLEXITY_API_KEY ? 'YES' : 'NO'}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout for research
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a research assistant that provides comprehensive, well-sourced information. Always include relevant citations and sources in your response. Structure your response with clear sections and provide accurate, up-to-date information.'
            },
            {
              role: 'user',
              content: `Research and provide comprehensive information about: ${query}. Include relevant examples, current developments, and cite your sources.`
            }
          ],
          max_tokens: 4000,
          temperature: 0.2,
          top_p: 0.9,
          search_domain_filter: ["arxiv.org", "scholar.google.com", "pubmed.ncbi.nlm.nih.gov", "nature.com", "science.org"],
          return_citations: true,
          search_recency_filter: "month",
          top_k: 0,
          stream: false,
          presence_penalty: 0,
          frequency_penalty: 1
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log(`📡 [PERPLEXITY] API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [PERPLEXITY] API error: ${response.status} - ${errorText}`);
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data: PerplexityResponse = await response.json();
      console.log(`📄 [PERPLEXITY] Received response data`);
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from Perplexity API');
      }

      const researchContent = data.choices[0].message.content;
      console.log(`✅ [PERPLEXITY] Research completed, ${researchContent.length} characters`);
      console.log(`🔍 [PERPLEXITY] Processing research content for RAG...`);

      // Format for RAG processing
      const formattedContent = `[Perplexity Research Results]
Query: ${query}
Research Date: ${new Date().toISOString()}
Model: ${data.model}

${researchContent}

---
Token Usage: ${data.usage ? `${data.usage.total_tokens} tokens (${data.usage.prompt_tokens} prompt + ${data.usage.completion_tokens} completion)` : 'N/A'}`;

      return formattedContent;
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏱️ [PERPLEXITY] Research timeout after 45 seconds');
        return `Perplexity research timed out: Request took longer than 45 seconds`;
      }
      console.error('💥 [PERPLEXITY] Research error:', error);
      return `Perplexity research unavailable: ${error instanceof Error ? error.message : String(error)}`;
    }
};

// Unified research function that switches between tools
export const performResearch = async (query: string, tool: 'exa' | 'perplexity' | 'local' = 'exa'): Promise<string> => {
    console.log(`🔄 [RESEARCH] Using ${tool.toUpperCase()} for query: "${query}"`);
    
    try {
      switch (tool) {
        case 'exa':
          console.log(`🚀 [RESEARCH] Calling Exa Labs API...`);
          const exaResult = await performExaSearch(query);
          console.log(`✅ [RESEARCH] Exa Labs completed, ${exaResult.length} characters returned`);
          return exaResult;
        case 'perplexity':
          console.log(`🚀 [RESEARCH] Calling Perplexity API...`);
          const perplexityResult = await performPerplexityResearch(query);
          console.log(`✅ [RESEARCH] Perplexity completed, ${perplexityResult.length} characters returned`);
          return perplexityResult;
        case 'local':
          console.log(`💾 [LOCAL] Using local processing only for: "${query}"`);
          return `[Local Processing Only]
Query: ${query}
Mode: No external API calls
Status: Processing with local knowledge base only

This query will be processed using only the local vector database and internal knowledge, without making any external API calls to preserve budget.`;
        default:
          throw new Error(`Unknown research tool: ${tool}`);
      }
    } catch (error) {
      console.error(`💥 [RESEARCH] Error in ${tool.toUpperCase()} research:`, error);
      throw error; // Re-throw to let the calling function handle it
    }
};