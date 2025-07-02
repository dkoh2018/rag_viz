// LangChain RAG backend with LangSmith tracing
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { traceable } from 'langsmith/traceable';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import { performResearch } from './research-tools';
import * as path from 'path';
import * as fs from 'fs';

// --- REVISED SYSTEM PROMPTS ---
// More specific, role-based prompts that assume no internet or tool access.
export const SYSTEM_PROMPTS = {
  'router-agent': `You are a Router Agent. Analyze the user's query and determine if it needs:
    - 'simple': Direct retrieval and response (factual questions, definitions)
    - 'complex': Multi-step reasoning, synthesis, or analysis
    
    Examples:
    Simple: "What is X?", "Define Y", "List the features of Z"
    Complex: "Compare X and Y", "How does A relate to B?", "Analyze the impact of C"
    
    Respond with only: "simple" or "complex"`,

  'direct-generation': `You are a Direct Generation Agent. Answer the user's query using ONLY the provided context.
    
    Rules:
    - Use only information explicitly stated in the context
    - If information is missing, state: "This information is not available in the knowledge base"
    - Be concise and direct
    - Cite which document section you're referencing`,

  'orchestrator-agent': `You are an Orchestrator Agent. Create a focused execution plan for this complex query.
    
    Available operations:
    1. Retrieve relevant documents
    2. Extract key information 
    3. Synthesize findings
    4. Validate completeness
    
    Output a numbered plan with specific tasks for each step.`,

  'decompose-query': `You are a Query Decomposition Agent. Break the complex query into 2-4 specific sub-questions that can be answered from documents.
    
    Format:
    1. [Sub-question 1]
    2. [Sub-question 2]
    etc.
    
    Make each question focused and answerable from text sources.`,

  'worker-retrieval': `You are a Retrieval Worker. For the given sub-question, extract EXACT text passages from the provided context.
    
    Format your response as:
    **Relevant Passages:**
    - [Source]: "[Exact quote]"
    - [Source]: "[Exact quote]"
    
    Only include directly relevant text. Do not interpret or summarize.`,

  'worker-research': `You are a Research Worker. Analyze the retrieved text passages to identify:
    
    **Key Findings:**
    - [Finding 1]
    - [Finding 2]
    
    **Relationships:**
    - [How concepts connect]
    
    **Gaps:**
    - [Missing information]
    
    Base analysis ONLY on the provided text.`,

  'worker-analysis': `You are an Analysis Worker. Draw specific conclusions from the research findings to answer the sub-questions.
    
    **Conclusions:**
    1. [Answer to sub-question 1]: [Evidence-based conclusion]
    2. [Answer to sub-question 2]: [Evidence-based conclusion]
    
    **Confidence Level:** [High/Medium/Low] based on available evidence
    
    Only conclude what the evidence directly supports.`,

  'synthesis-agent': `You are a Synthesis Agent. Combine all worker outputs into a comprehensive answer.
    
    Structure:
    1. **Main Answer:** [Direct response to original query]
    2. **Supporting Details:** [Key points from analysis]
    3. **Sources:** [Documents referenced]
    
    Ensure the response flows logically and addresses the user's complete question.`,

  'evaluator-agent': `You are an Evaluator Agent. Check the final response against these criteria:
    
    **Evaluation:**
    - Answers the original question: Yes/No
    - Based on provided documents: Yes/No  
    - No unsupported claims: Yes/No
    - Clear and complete: Yes/No
    
    **Decision:** PASS/FAIL
    **Reason:** [Brief explanation]`,

  'response-delivery': `You are a Response Delivery Agent. Format the approved response for the user.
    
    **Final Response:**
    [Clean, well-formatted answer]
    
    **Note:** This response is based on our internal knowledge base and may not reflect the most current information available online.`,
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

// --- REVISED RAG QUERY PROCESSING ---
// More specific logic to handle context for each agent without tool usage.
export const processRAGQuery = traceable(
  async (
    agentId: keyof typeof SYSTEM_PROMPTS, 
    userQuery: string, 
    context: string = "",
    researchModel: 'exa' | 'perplexity' | 'local' = 'exa'
  ): Promise<string> => {
    console.log(`🔄 [${agentId}] Starting...`);
    
    try {
      const llm = initializeLLM();
      const systemPrompt = SYSTEM_PROMPTS[agentId] || 'You are a helpful AI assistant.';
      let retrievedContext = '';
      let humanMessageContent = '';

      // --- Context-Aware Input Construction ---
      // Build a specific input for each agent based on its role
      switch (agentId) {
        case 'worker-retrieval':
          console.log(`🔍 [${agentId}] Performing ${researchModel.toUpperCase()} research for sub-query: "${userQuery}"`);
          
          if (researchModel === 'local') {
            // Use only local vector search for budget-conscious mode
            console.log(`💾 [${agentId}] Using local-only mode to save costs`);
            retrievedContext = await performVectorSearch(userQuery);
          } else {
            // Try external research first, fallback to vector search if needed
            try {
              retrievedContext = await performResearch(userQuery, researchModel);
              console.log(`✅ [${agentId}] ${researchModel.toUpperCase()} research completed`);
            } catch (error) {
              console.error(`❌ [${agentId}] ${researchModel.toUpperCase()} research failed, falling back to vector search:`, error);
              retrievedContext = await performVectorSearch(userQuery);
            }
          }
          
          // This agent's job is to answer based on the retrieved information for the sub-query.
          humanMessageContent = `Sub-Query: "${userQuery}"\n\nBased ONLY on the following ${researchModel === 'local' ? 'local knowledge base' : 'research results'}, extract the relevant information verbatim:\n\n${retrievedContext}`;
          break;

        case 'worker-research':
          // This agent receives the retrieved docs in the 'context' field
          humanMessageContent = `Original Query: "${userQuery}"\n\nYour task is to analyze and find relationships within the following retrieved information:\n\n${context}`;
          break;

        case 'worker-analysis':
          // This agent receives retrieved data and research notes in the 'context' field
          humanMessageContent = `Original Query: "${userQuery}"\n\nBased on the following data and research, formulate a conclusion:\n\n${context}`;
          break;
          
        case 'synthesis-agent':
        case 'evaluator-agent':
          // These agents need the full consolidated context to do their work
          humanMessageContent = `Original Query: "${userQuery}"\n\nHere is the consolidated information to process:\n\n${context}`;
          break;

        default:
          // Default behavior for router, decomposer, etc.
          humanMessageContent = `User Query: "${userQuery}"\n\n${context ? `Additional Context:\n${context}` : ''}`;
          break;
      }
      
      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(humanMessageContent)
      ];
      
      console.log(`🚀 [${agentId}] Making LangChain call...`);
      
      const response = await llm.invoke(messages);
      const result = response.content.toString();
      
      console.log(`✅ [${agentId}] Result: "${result}"`);
      
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