// Advanced RAG backend for direct query processing with expert-level prompts for visualization
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { traceable } from 'langsmith/traceable';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import * as path from 'path';
import * as fs from 'fs';

// Expert-level system prompts optimized for clarity, with all agents included for visual tracing.
export const VISUAL_TRACE_SYSTEM_PROMPTS = {
  'router-agent': `You are a high-speed Router Agent. Your sole purpose is to classify an incoming query as either 'simple' or 'complex'.

## Objective:
Analyze the user's query to determine the correct processing pipeline, paying close attention to whether the query requires current information.

## Categories:
- 'simple': The query can be answered with a single, stable fact or a standard, concise explanation that does not change over time. This also includes nonsensical or unclear queries.
- 'complex': The query requires step-by-step instructions, synthesis of information from multiple sources, or **information that must be current or recent**. If the answer changes from month to month or year to year, it is complex.

## Instructions:
1.  Read the user's query.
2.  First, ask yourself: "Does this question need up-to-date information to be answered correctly?" If yes, classify it as 'complex'.
3.  If the answer is stable, then ask if it's a single fact ('simple') or requires a detailed explanation/steps ('complex').
4.  If a query is incomplete or nonsensical, classify it as 'simple'.
5.  Respond with ONLY the single word: 'simple' or 'complex'.
6.  Do not add explanations. Your output must be a single word.

## Examples:

# Simple: Stable facts, common knowledge, or unclear queries
- Query: "who is the president of the united states" -> simple
- Query: "why is the sky blue" -> simple
- Query: "whats 2+2" -> simple
- Query: "what's 2+@" -> simple

# Complex: Requires steps, detailed explanation, or current information
- Query: "what's machine learning" -> complex
- Query: "how do i tie a tie" -> complex
- Query: "compare react and angular" -> complex
- Query: "what were the best phones released this year" -> complex
- Query: "latest news about space exploration" -> complex`,

  'direct-generation': `You are a Direct Answer Agent. Your task is to provide direct, concise answers to simple questions using your knowledge.

## Instructions:
1. Read the user's question.
2. Provide a clear, direct answer to the question.
3. Keep your response concise and factual.
4. For basic math, facts, definitions, or simple questions, answer directly.

## Examples:
- "What is 2+2?" → "2+2 equals 4."
- "What is machine learning?" → "Machine learning is a subset of artificial intelligence..."
- "What is the capital of France?" → "The capital of France is Paris."

## Constraints:
- Keep answers brief and to the point.
- Provide accurate information for simple queries.`,

  'response-delivery': `You are a Response Delivery Agent. Your job is to format the raw answer for presentation.

## Instructions:
1.  Take the raw answer provided in the <raw_answer> tags.
2.  Format it to be clear and well-structured. Use markdown (e.g., bullet points) if it improves clarity.
3.  Ensure the tone is professional and helpful.
4.  Do not change the factual content of the answer. You are only responsible for its presentation.
5.  Return only the final, formatted response.`,
    
  'langsmith-logging': `You are a Logging Agent within a visual workflow. Your function is to signal that the main query processing is complete and has been logged. This is a final step in the trace.

## Instructions:
1. You will be given the original query and the final response as context.
2. Your task is to output a single, specific confirmation message.
3. Return the *exact* string: "✅ Query processed and logged successfully"

## Constraints:
- Do NOT output any other text or information.
- Your response must be the exact success message.`,

};

// Initialize lightweight LLM (no changes needed here)
const initializeSimpleLLM = () => {
  return new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    maxTokens: 1000,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
};

// Lightweight vector search (no changes needed here)
const performSimpleVectorSearch = traceable(
  async (query: string, topK: number = 2): Promise<string> => {
    try {
      const vectorStorePath = path.join(process.cwd(), 'vectorstore', 'rag-store.index');
      if (!fs.existsSync(vectorStorePath)) return 'No document context available';
      
      const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
      const vectorStore = await HNSWLib.load(vectorStorePath, embeddings);
      const retriever = vectorStore.asRetriever({ k: topK });
      const relevantDocs = await retriever.getRelevantDocuments(query);
      
      const context = relevantDocs
        .map((doc, index) => `[Source ${index + 1}]: ${doc.pageContent}`)
        .join('\n\n');
      
      return context || 'No relevant documents found';
    } catch (error) {
      console.error('💥 [VECTOR] Error:', error);
      return 'Vector search unavailable';
    }
  },
  { name: 'performSimpleVectorSearch', tags: ['vector-search', 'simple', 'langchain'] }
);

// Main processing function with all agent steps restored for visualization
export const processVisualRAGQuery = traceable(
  async (
    agentId: keyof typeof VISUAL_TRACE_SYSTEM_PROMPTS, 
    userQuery: string, 
    context: string = ""
  ): Promise<string> => {
    console.log(`🚀 [VISUAL TRACE] Running agent "${agentId}"`);
    
    try {
      const llm = initializeSimpleLLM();
      const systemPrompt = VISUAL_TRACE_SYSTEM_PROMPTS[agentId];
      let humanMessageContent = '';

      switch (agentId) {
        case 'router-agent':
          humanMessageContent = `User Query: "${userQuery}"`;
          break;

        case 'direct-generation':
          console.log(`💭 [${agentId}] Generating direct answer for: "${userQuery}"`);
          humanMessageContent = `User Question: "${userQuery}"`;
          break;

        case 'response-delivery':
          humanMessageContent = `<raw_answer>${context}</raw_answer>`;
          break;

        case 'langsmith-logging':
          humanMessageContent = `The interaction to log is:
Query: "${userQuery}"
Final Response: "${context}"`;
          break;

      }
      
      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(humanMessageContent)
      ];
      
      console.log(`⚡ [LLM CALL] Invoking model for agent "${agentId}"`);
      
      const response = await llm.invoke(messages);
      const result = response.content.toString();
      
      console.log(`✅ [COMPLETE] Agent "${agentId}" finished.`);
      
      return result;
      
    } catch (error) {
      console.error(`💥 [ERROR] in agent "${agentId}":`, error);
      return `[ERROR in ${agentId}]: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  { name: 'processVisualRAGQuery', tags: ['rag', 'visual-trace', 'langchain'] }
);

// Export the vector search function for potential use
export { performSimpleVectorSearch };