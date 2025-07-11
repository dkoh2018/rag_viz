// LangChain RAG backend with LangSmith tracing for complex, multi-agent workflows
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { traceable } from 'langsmith/traceable';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import { performResearch } from './research-tools';
import * as path from 'path';
import * as fs from 'fs';

// --- EXPERT-LEVEL SYSTEM PROMPTS for a Multi-Agent Pipeline ---
export const EXPERT_COMPLEX_PROMPTS = {
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

  'direct-generation': `You are a Factual Generation Agent. Your task is to answer the user's query using ONLY the information within the provided <context> tags.

## Instructions:
1. Read the user's <query>.
2. Find the answer within the <context>.
3. If the answer exists, state it clearly and cite the source.
4. If the answer is not in the context, respond with the exact phrase: "This information is not available in the knowledge base."

## Constraints:
- **CRITICAL:** Do NOT use any external knowledge.
- Do not infer or speculate. Adhere strictly to the provided text.`,

  'orchestrator-agent': `You are a Master Orchestrator Agent. Your role is to create a detailed, step-by-step execution plan for a complex query. The output must be a machine-readable JSON object.

## Objective:
Design a logical plan of action that other agents will execute.

## Available Operations:
- 'decompose_query': Break down the main query.
- 'execute_research': For each sub-query, retrieve relevant information.
- 'analyze_findings': Synthesize findings from the research.
- 'generate_synthesis': Compose the final answer.
- 'evaluate_answer': Perform a final quality check.

## Instructions:
1. Analyze the user's complex query.
2. Create a JSON array of steps. Each step should be an object with an 'agent' key and a 'task' key describing the goal of that step.
3. The plan must be logical and efficient.

## Example Output:
{
  "plan": [
    { "agent": "decompose-query", "task": "Break the main query about AI's economic impact into sub-questions about job displacement, new job creation, and GDP effects." },
    { "agent": "worker-research", "task": "Execute research for each of the three sub-questions." },
    { "agent": "synthesis-agent", "task": "Combine the research findings into a comprehensive draft answer." },
    { "agent": "evaluator-agent", "task": "Review the draft answer for accuracy, completeness, and adherence to source material." }
  ]
}`,

  'decompose-query': `You are a Query Decomposition Agent. Your function is to break a single complex query into a series of smaller, independent, and fact-based sub-questions.

## Objective:
Create a list of focused questions that can be researched individually.

## Instructions:
1. Read the complex query.
2. Identify the core informational components needed for a complete answer.
3. Formulate 2-4 specific sub-questions.
4. The sub-questions, when answered together, must comprehensively cover the original query.

## Output Format:
- Return a numbered list of questions.`,

  'worker-retrieval': `You are a diligent Retrieval Worker. Your task is to find and extract the most relevant text passages from a provided document to answer a specific sub-question.

## Instructions:
1. Read the <sub_query>.
2. Scan the provided <source_document>.
3. Extract the EXACT text passages that directly answer the sub_query. Do not summarize or interpret.
4. Format your output clearly, indicating the source of each passage.

## Constraints:
- Only include directly relevant text.
- Do not add your own words or explanations. Your job is to extract, not create.`,

  'worker-research': `You are a Research Analyst Agent. Your role is to analyze a collection of raw text passages and distill them into structured, actionable insights.

## Objective:
Transform raw information into a structured summary of findings, relationships, and gaps.

## Instructions:
1. Review all the provided <retrieved_passages>.
2. Identify the most critical facts and data points, listing them as Key Findings.
3. Describe the relationships or connections between these findings.
4. Explicitly state any information that appears to be missing or contradictory (Gaps).`,

  'worker-analysis': `You are a Conclusion-Drawing Agent. You operate one level above research, drawing logical conclusions based on the structured findings provided to you.

## Instructions:
1. Review the <research_summary> which contains key findings, relationships, and gaps.
2. For each original sub-question, formulate a concise conclusion based *only* on the evidence in the summary.
3. Assign a confidence level (High, Medium, Low) to each conclusion based on the strength and completeness of the evidence.

## Constraints:
- Do not re-read the original source documents. Your world is only the <research_summary>.
- Do not conclude beyond what the evidence supports.`,

  'synthesis-agent': `You are a Master Synthesis Agent, an expert writer who assembles the final answer. Your job is to communicate the findings clearly and logically to the end-user.

## Instructions:
1. Review the original <user_query> and the <analysis_conclusions>.
2. Write a comprehensive, direct answer to the user's original query.
3. Structure your response with a main answer first, followed by supporting details drawn from the analysis.
4. List all the source documents that were referenced in the research.
5. Ensure the final text flows logically and is easy to understand.`,

  'shared-state': `You are a Shared State Coordinator. Your role is to consolidate outputs from multiple worker agents into a unified data structure.

## Instructions:
1. Review all worker outputs provided in the <worker_outputs> section.
2. Combine the information into a coherent, structured summary.
3. Preserve all important findings from each worker.
4. Organize the information logically for the synthesis agent.

## Output Format:
**Consolidated Findings:**
- [Key findings from all workers]

**Research Summary:**
- [Combined research insights]

**Analysis Results:**
- [Analytical conclusions]`,

  'evaluator-agent': `You are a Quality Assurance Evaluator. Your function is to perform a final, rigorous check on the synthesized answer before it's delivered to the user.

## Instructions:
1. Review the provided <final_answer>.
2. Answer each question on the following checklist with a 'Yes' or 'No'.
3. Based on the checklist, provide a final 'PASS' or 'FAIL' decision and a brief reason.

## Evaluation Checklist:
- Answers the original question directly: Yes/No
- Contains accurate information: Yes/No
- Contains no unsupported claims or hallucinations: Yes/No
- Is clear, complete, and well-written: Yes/No

## Output Format:
Decision: [PASS/FAIL]
Reason: [Brief explanation]`,

  'response-delivery': `You are a final Response Delivery Agent. Your only job is to prepare the approved answer for display.

## Instructions:
1. Take the <approved_answer>.
2. Perform any final formatting (e.g., ensuring proper markdown).
3. Add the mandatory disclaimer note at the end.
4. Return the final, clean response.

## Disclaimer Note:
"Note: This response is generated based on our internal knowledge base and may not reflect the most current information available online."`,
};


// Initialize LLM (no changes needed)
const initializeLLM = () => {
  return new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 5000,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
};

// Vector search with detailed logging and fallback
const performVectorSearch = traceable(
  async (query: string, topK: number = 3): Promise<string> => {
    try {
      console.log(`🔍 [VECTOR] Searching for: "${query}"`);
      const vectorStorePath = path.join(process.cwd(), 'vectorstore', 'rag-store.index');
      console.log(`📁 [VECTOR] Looking for vectorstore at: ${vectorStorePath}`);
      
      if (!fs.existsSync(vectorStorePath)) { 
        console.warn(`⚠️ [VECTOR] Vectorstore not found at ${vectorStorePath}`);
        return `[Vectorstore Not Available]
Query: ${query}
Status: Local knowledge base not found
Location checked: ${vectorStorePath}

This indicates the vectorstore hasn't been created yet. External research should be used instead.`;
      }
      
      console.log(`✅ [VECTOR] Vectorstore found, loading...`);
      const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
      const vectorStore = await HNSWLib.load(vectorStorePath, embeddings);
      const retriever = vectorStore.asRetriever({ k: topK });
      const relevantDocs = await retriever.getRelevantDocuments(query);
      
      console.log(`📄 [VECTOR] Found ${relevantDocs.length} relevant documents`);
      const context = relevantDocs.map((doc, index) => `[Doc ${index + 1}]: ${doc.pageContent}`).join('\n\n');
      return context || 'No relevant documents found in vectorstore';
    } catch (error) { 
      console.error('💥 [VECTOR] Vector search error:', error); 
      return `Vector search error: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  { name: 'performVectorSearch', tags: ['vector-search', 'retrieval', 'langchain'] }
);

// --- REVISED RAG QUERY PROCESSING with Robust Inputs ---
export const processComplexRAGQuery = traceable(
  async (
    agentId: keyof typeof EXPERT_COMPLEX_PROMPTS,
    userQuery: string,
    context: string = "", // This now primarily carries data between agents
    researchModel: 'exa' | 'perplexity' | 'local' = 'exa'
  ): Promise<string> => {
    console.log(`🔄 [${agentId}] Starting...`);

    try {
      const llm = initializeLLM();
      const systemPrompt = EXPERT_COMPLEX_PROMPTS[agentId];
      let humanMessageContent = '';

      // --- Context-Aware Input Construction using XML-like Tags ---
      switch (agentId) {
        case 'worker-retrieval':
          console.log(`🔍 [${agentId}] Performing research for sub-query: "${userQuery}"`);
          console.log(`🔬 [${agentId}] Research model: ${researchModel}`);
          let retrievedContext = '';
          if (researchModel === 'local') {
            console.log(`💾 [${agentId}] Using local vector search...`);
            retrievedContext = await performVectorSearch(userQuery);
          } else {
            console.log(`🌐 [${agentId}] Using external research with ${researchModel.toUpperCase()}...`);
            try {
              retrievedContext = await performResearch(userQuery, researchModel);
              console.log(`✅ [${agentId}] External research completed, ${retrievedContext.length} characters`);
            } catch (error) {
              console.error(`❌ [${agentId}] External research failed, falling back to vector search:`, error);
              retrievedContext = await performVectorSearch(userQuery);
              console.log(`🔄 [${agentId}] Fallback vector search completed, ${retrievedContext.length} characters`);
            }
          }
          console.log(`📄 [${agentId}] Final retrieved context preview: ${retrievedContext.substring(0, 200)}...`);
          humanMessageContent = `<sub_query>${userQuery}</sub_query>\n\n<source_document>${retrievedContext}</source_document>`;
          break;

        case 'worker-research':
          humanMessageContent = `<retrieved_passages>${context}</retrieved_passages>`;
          break;

        case 'worker-analysis':
          humanMessageContent = `<original_query>${userQuery}</original_query>\n\n<research_summary>${context}</research_summary>`;
          break;

        case 'shared-state':
          humanMessageContent = `<worker_outputs>${context}</worker_outputs>`;
          break;

        case 'synthesis-agent':
          humanMessageContent = `<user_query>${userQuery}</user_query>\n\n<analysis_conclusions>${context}</analysis_conclusions>`;
          break;
          
        case 'evaluator-agent':
          humanMessageContent = `<final_answer>${context}</final_answer>`;
          break;

        case 'response-delivery':
            humanMessageContent = `<approved_answer>${context}</approved_answer>`;
            break;

        default: // For router, decomposer, orchestrator
          humanMessageContent = `<user_query>${userQuery}</user_query>\n\n${context ? `<additional_context>${context}</additional_context>` : ''}`;
          break;
      }
      
      const messages = [ new SystemMessage(systemPrompt), new HumanMessage(humanMessageContent) ];
      
      console.log(`🚀 [${agentId}] Making LangChain call...`);
      const response = await llm.invoke(messages);
      const result = response.content.toString();
      console.log(`✅ [${agentId}] Result received.`);
      
      return result;
      
    } catch (error) {
      console.error(`💥 [${agentId}] LangChain error occurred:`, error);
      return `[ERROR in ${agentId}]: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  { name: 'processComplexRAGQuery', tags: ['rag', 'complex-pipeline', 'langchain'] }
);