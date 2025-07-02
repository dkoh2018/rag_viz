// LangChain RAG backend with LangSmith tracing
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { traceable } from 'langsmith/traceable';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import * as path from 'path';
import * as fs from 'fs';

// System prompts for each RAG agent
export const SYSTEM_PROMPTS = {
  'router-agent': `You are a Router Agent. Analyze the user query and determine if it's simple or complex.
Simple queries: basic questions that can be answered directly
Complex queries: multi-part questions requiring research and analysis
Respond with your routing decision and reasoning.`,

  'direct-generation': `You are a Direct Generation Agent. Handle simple queries with direct, concise answers.
Use your knowledge base to provide accurate, helpful responses.
Keep responses focused and to the point.`,

  'orchestrator-agent': `You are an Orchestrator Agent. Manage complex queries by coordinating multiple worker agents.
Break down the query into sub-tasks and explain your coordination strategy.
Ensure all aspects of the query will be addressed.`,

  'decompose-query': `You are a Query Decomposition Agent. Break complex queries into specific sub-tasks:
1. Information retrieval needs
2. Research requirements  
3. Analysis components
Make each sub-task clear and actionable.`,

  'worker-retrieval': `You are a Retrieval Worker Agent. Find and extract relevant information from the knowledge base.
Focus on factual data, documents, and specific information that answers the query.
Provide sources and context for retrieved information.`,

  'worker-research': `You are a Research Worker Agent. Conduct deeper analysis and cross-reference multiple sources.
Look for patterns, relationships, and broader context.
Identify gaps in information and areas needing further investigation.`,

  'worker-analysis': `You are an Analysis Worker Agent. Process and interpret the gathered information.
Draw insights, make connections, and provide analytical conclusions.
Assess confidence levels and identify limitations in the analysis.`,

  'shared-state': `You are a Shared State Coordinator. Consolidate findings from all worker agents.
Organize information into a coherent structure for synthesis.
Identify overlaps, conflicts, and gaps in the collected data.`,

  'synthesis-agent': `You are a Synthesis Agent. Combine all gathered information into a comprehensive response.
Create a coherent, well-structured answer that addresses all aspects of the original query.
Ensure consistency and logical flow in the final response.`,

  'evaluator-agent': `You are an Evaluator Agent. Assess the quality and completeness of the synthesized response.
Check for accuracy, relevance, completeness, and clarity.
Provide a quality score and approval decision.`,

  'response-delivery': `You are a Response Delivery Agent. Format and deliver the final response to the user.
Ensure proper formatting, citations, and user-friendly presentation.
Add any necessary disclaimers or confidence indicators.`,

  'langsmith-logging': `You are a Logging Agent. Capture and log all interactions and metrics.
Track performance, errors, and system behavior for optimization.
Generate summary statistics and insights.`,

  'user-response': `You are the Final Response Formatter. Present the complete answer to the user.
Ensure the response is clear, helpful, and addresses the original query.
Include any relevant metadata or additional resources.`
};

// Initialize LangChain ChatOpenAI with LangSmith tracing
const initializeLLM = () => {
  return new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 5000,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
};

// Vector search with LangSmith tracing
const performVectorSearch = traceable(
  async (query: string, topK: number = 3): Promise<string> => {
    try {
      const vectorStorePath = path.join(process.cwd(), 'vectorstore', 'rag-store.index');
      
      if (!fs.existsSync(vectorStorePath)) {
        console.log('📋 [VECTOR] No vector store found, skipping retrieval');
        return 'No document context available';
      }
      
      console.log(`🔍 [VECTOR] Loading vector store from: ${vectorStorePath}`);
      
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      
      const vectorStore = await HNSWLib.load(vectorStorePath, embeddings);
      const retriever = vectorStore.asRetriever({ k: topK });
      
      console.log(`🎯 [VECTOR] Searching for: "${query}"`);
      const relevantDocs = await retriever.getRelevantDocuments(query);
      
      const context = relevantDocs
        .map((doc, index) => `[Doc ${index + 1}]: ${doc.pageContent}`)
        .join('\n\n');
      
      console.log(`📄 [VECTOR] Found ${relevantDocs.length} relevant documents`);
      
      return context || 'No relevant documents found';
      
    } catch (error) {
      console.error('💥 [VECTOR] Vector search error:', error);
      return 'Vector search unavailable';
    }
  },
  {
    name: 'performVectorSearch',
    tags: ['vector-search', 'retrieval', 'langchain'],
  }
);

// LangChain RAG query processing with LangSmith tracing
export const processRAGQuery = traceable(
  async (
    agentId: string, 
    userQuery: string, 
    context: string = ""
  ): Promise<string> => {
    console.log(`🔄 [${agentId}] Starting LangChain RAG query processing...`);
    console.log(`📝 [${agentId}] User Query: "${userQuery}"`);
    
    try {
      const llm = initializeLLM();
      const systemPrompt = SYSTEM_PROMPTS[agentId as keyof typeof SYSTEM_PROMPTS] || 'You are a helpful AI assistant.';
      console.log(`💬 [${agentId}] System prompt found: ${systemPrompt ? 'YES' : 'NO'}`);
      
      // Perform vector search for retrieval agents
      let retrievedContext = '';
      if (agentId === 'worker-retrieval' || agentId === 'worker-research') {
        console.log(`🔍 [${agentId}] Performing vector search...`);
        retrievedContext = await performVectorSearch(userQuery);
      }
      
      // Combine contexts
      const fullContext = [
        context && `Previous Context: ${context}`,
        retrievedContext && `Retrieved Documents: ${retrievedContext}`
      ].filter(Boolean).join('\n\n');
      
      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(`User Query: ${userQuery}${fullContext ? `\n\n${fullContext}` : ''}`)
      ];
      
      console.log(`🚀 [${agentId}] Making LangChain call with LangSmith tracing...`);
      
      const response = await llm.invoke(messages);
      const result = response.content.toString();
      
      console.log(`✅ [${agentId}] LangChain result: "${result}"`);
      
      return result;
      
    } catch (error) {
      console.error(`💥 [${agentId}] LangChain error occurred:`, error);
      return `[ERROR in ${agentId}]: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: 'processRAGQuery',
    tags: ['rag', 'langchain'],
  }
);