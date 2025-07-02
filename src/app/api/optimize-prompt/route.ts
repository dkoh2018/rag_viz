import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export async function POST(request: NextRequest) {
  console.log('✨ [OPTIMIZE] Prompt optimization API endpoint called');
  
  try {
    const requestData = await request.json();
    console.log('📥 [OPTIMIZE] Request data:', JSON.stringify(requestData, null, 2));
    
    const { userPrompt } = requestData;

    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length === 0) {
      console.error('❌ [OPTIMIZE] Missing or invalid userPrompt');
      return NextResponse.json(
        { error: 'Missing or invalid userPrompt field' },
        { status: 400 }
      );
    }

    console.log(`🎯 [OPTIMIZE] Optimizing prompt: "${userPrompt}"`);

    // Initialize OpenAI with optimization-specific settings
    const llm = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.3, // Lower temperature for more consistent optimization
      maxTokens: 1000,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `
You are a Prompt Optimizer for a RAG system (Perplexity, Exa, etc.).
Your ONLY job is to rewrite the user's next message into an efficient
retrieval prompt. NEVER answer the question itself.

Behavior Rules
──────────────
1. If the user message already contains a substantive question or task,
   rewrite it using the Optimization Framework.
2. If the message is a greeting or contains no actionable request,
   reply with:
   "Please provide a topic or question you'd like optimized."
3. If the request is ambiguous, ask up to **two** concise
   clarification questions, each prefixed with "Clarify:".
4. Output ONLY the optimized prompt (or the clarification request).
   Do not add explanations, greetings, or extra text.

Optimization Framework
──────────────────────
• CLARITY  – Make the core ask unambiguous.  
• FOCUS    – Limit to the 1-2 key points that matter most.  
• PRECISION– Use domain-specific terms that aid retrieval.  
• SCOPE    – Trim anything that would trigger unnecessary API calls.  
• BREVITY  – Keep it short; every token counts.

Examples
────────
User: "how does ml work?"
Optimizer: "Explain the core principles of machine learning, focusing on how training algorithms learn from data. Include key terminology and a brief example."

User: "marketing strategy help"
Optimizer: "What are the essential components of a digital-marketing strategy? Focus on customer targeting and channel selection, citing current best practices."

User: "hi hiw are u"
Optimizer: "Please provide a topic or question you'd like optimized."
`;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`Optimize this prompt for better RAG processing: "${userPrompt}"`)
    ];

    console.log(`🚀 [OPTIMIZE] Making OpenAI optimization call...`);

    const response = await llm.invoke(messages);
    const optimizedPrompt = response.content.toString().trim();

    // Remove quotes if the response is wrapped in them
    const cleanedPrompt = optimizedPrompt.replace(/^["']|["']$/g, '');

    console.log(`✅ [OPTIMIZE] Original: "${userPrompt}"`);
    console.log(`✅ [OPTIMIZE] Optimized: "${cleanedPrompt}"`);

    const result = {
      success: true,
      originalPrompt: userPrompt,
      optimizedPrompt: cleanedPrompt,
      timestamp: new Date().toISOString()
    };

    console.log('📤 [OPTIMIZE] Sending response:', JSON.stringify(result, null, 2));

    return NextResponse.json(result);

  } catch (error) {
    console.error('💥 [OPTIMIZE] Prompt optimization error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during prompt optimization',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}