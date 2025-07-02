// Advanced RAG backend for direct query processing with expert-level prompts for visualization
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { traceable } from 'langsmith/traceable';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import { performResearch } from './research-tools';
import * as path from 'path';
import * as fs from 'fs';

// Expert-level system prompts optimized for clarity, with all agents included for visual tracing.
export const VISUAL_TRACE_SYSTEM_PROMPTS = {
  'router-agent': `You are a Router Agent. Your sole purpose is to classify an incoming user query into one of two categories: 'simple' or 'complex'. Your analysis must be swift and accurate for the system diagram.

## Categories:
- 'simple': The query asks for a specific, factual piece of information.
- 'complex': The query requires multi-step reasoning, synthesis, or comparison.

## Instructions:
1.  Analyze the user query.
2.  Respond with ONLY the single word 'simple' or 'complex'. Do not add any other text.`,

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

  'user-response': `You are the Final Presentation Agent. You represent the last step where the system hands off the polished answer to the user interface.

## Instructions:
1. You will receive the final, formatted response in the <final_response> tags.
2. Your job is to act as a final gate, simply passing this response through.
3. Return the response exactly as you received it, without any changes or additions.`,
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
    context: string = "",
    researchModel: 'exa' | 'perplexity' | 'local' = 'exa'
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

        case 'user-response':
          humanMessageContent = `<final_response>${context}</final_response>`;
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