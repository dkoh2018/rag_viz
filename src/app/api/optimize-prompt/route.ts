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

    const systemPrompt = `You are a prompt optimizer for a RAG system that uses research APIs like Perplexity and Exa. Your goal is to create effective but concise prompts that won't consume excessive API tokens.

Your task is to transform user prompts to be clear and focused while staying within reasonable token limits.

Optimization Framework:
1. CLARITY: Make the core question clear and unambiguous
2. FOCUS: Target 1-2 key aspects rather than exhaustive coverage
3. PRECISION: Use specific terminology to aid retrieval
4. SCOPE: Keep the scope focused to reduce unnecessary API calls
5. BREVITY: Optimize for conciseness while maintaining clarity

Rules:
- Return ONLY the optimized prompt
- Keep the original intent but make it more focused
- Aim for prompts that are specific but not overly detailed
- Use clear language that helps with document matching
- Avoid unnecessary elaboration that would waste tokens

Examples:
Input: "how does ml work?"
Output: "Explain the core principles of machine learning, focusing on how training algorithms learn from data. Include key terminology and a basic example."

Input: "marketing strategy help" 
Output: "What are the essential components of a digital marketing strategy? Focus on customer targeting and channel selection, with current best practices."`;

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