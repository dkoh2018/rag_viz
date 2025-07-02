// Simple RAG backend for direct query processing
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { traceable } from 'langsmith/traceable';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import * as path from 'path';
import * as fs from 'fs';

// Simple, direct system prompts optimized for straightforward responses
export const SIMPLE_SYSTEM_PROMPTS = {
  'router-agent': `You are a Router Agent. Analyze the user's query and determine if it needs:
    - 'simple': Direct retrieval and response (factual questions, definitions)
    - 'complex': Multi-step reasoning, synthesis, or analysis
    
    Examples:
    Simple: "What is X?", "Define Y", "List the features of Z"
    Complex: "Compare X and Y", "How does A relate to B?", "Analyze the impact of C"
    
    Respond with only: "simple" or "complex"`,

  'direct-generation': `You are a Direct Response Agent. Provide a clear, concise answer to the user's question.
    
    Rules:
    - Give direct, factual answers
    - Be concise but complete
    - If you don't know something, say so
    - Use simple, clear language
    - Don't over-explain unless needed`,

  'response-delivery': `You are a Response Delivery Agent. Format the response clearly for the user.
    
    Take the provided answer and ensure it's:
    - Well-formatted and easy to read
    - Professional but approachable
    - Complete and helpful
    
    Simply return the formatted response.`,

  'langsmith-logging': `You are a Logging Agent. Log this interaction for monitoring.
    
    Return: "✅ Simple query processed and logged successfully"`,

  'user-response': `You are the Final Response Agent. Present the answer to the user.
    
    Return the final, polished response ready for the user.`
};

// Initialize lightweight LLM for simple queries
const initializeSimpleLLM = () => {
  return new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0.3, // Lower temperature for more consistent simple responses
    maxTokens: 1000,   // Smaller token limit for simple responses
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
};

// Lightweight vector search for simple queries
const performSimpleVectorSearch = traceable(
  async (query: string, topK: number = 2): Promise<string> => {
    try {
      const vectorStorePath = path.join(process.cwd(), 'vectorstore', 'rag-store.index');
      
      if (!fs.existsSync(vectorStorePath)) {
        console.log('📋 [SIMPLE VECTOR] No vector store found');
        return 'No document context available';
      }
      
      console.log(`🔍 [SIMPLE VECTOR] Quick search for: "${query}"`);
      
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      
      const vectorStore = await HNSWLib.load(vectorStorePath, embeddings);
      const retriever = vectorStore.asRetriever({ k: topK });
      
      const relevantDocs = await retriever.getRelevantDocuments(query);
      
      const context = relevantDocs
        .map((doc, index) => `[Source ${index + 1}]: ${doc.pageContent}`)
        .join('\n\n');
      
      console.log(`📄 [SIMPLE VECTOR] Found ${relevantDocs.length} relevant documents`);
      
      return context || 'No relevant documents found';
      
    } catch (error) {
      console.error('💥 [SIMPLE VECTOR] Error:', error);
      return 'Vector search unavailable';
    }
  },
  {
    name: 'performSimpleVectorSearch',
    tags: ['vector-search', 'simple', 'langchain'],
  }
);

// Simple RAG query processing - optimized for direct responses
export const processSimpleRAGQuery = traceable(
  async (
    agentId: keyof typeof SIMPLE_SYSTEM_PROMPTS, 
    userQuery: string, 
    context: string = ""
  ): Promise<string> => {
    console.log(`🚀 [SIMPLE] Processing ${agentId} for direct response`);
    
    try {
      const llm = initializeSimpleLLM();
      const systemPrompt = SIMPLE_SYSTEM_PROMPTS[agentId] || 'You are a helpful AI assistant.';
      let humanMessageContent = '';

      // Simple, direct processing based on agent type
      switch (agentId) {
        case 'router-agent':
          humanMessageContent = `User Query: "${userQuery}"`;
          break;

        case 'direct-generation':
          // Get context from vector search for direct generation
          const retrievedContext = await performSimpleVectorSearch(userQuery);
          humanMessageContent = `User Question: "${userQuery}"
          
Available Context:
${retrievedContext}

Provide a direct, helpful answer based on the context. If the context doesn't contain the answer, provide a general response based on your knowledge.`;
          break;

        case 'response-delivery':
          humanMessageContent = `User Question: "${userQuery}"

Response to format:
${context}

Format this response clearly for the user.`;
          break;

        case 'langsmith-logging':
          humanMessageContent = `Log this simple query interaction:
Query: "${userQuery}"
Response: "${context}"`;
          break;

        case 'user-response':
          humanMessageContent = `Present this final response to the user:
${context}`;
          break;

        default:
          humanMessageContent = `User Query: "${userQuery}"
${context ? `Context: ${context}` : ''}`;
          break;
      }
      
      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(humanMessageContent)
      ];
      
      console.log(`⚡ [SIMPLE] Making direct LLM call for ${agentId}`);
      
      const response = await llm.invoke(messages);
      const result = response.content.toString();
      
      console.log(`✅ [SIMPLE] ${agentId} completed: "${result.substring(0, 100)}..."`);
      
      return result;
      
    } catch (error) {
      console.error(`💥 [SIMPLE] Error in ${agentId}:`, error);
      return `[SIMPLE ERROR in ${agentId}]: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: 'processSimpleRAGQuery',
    tags: ['rag', 'simple', 'langchain'],
  }
);