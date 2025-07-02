import { NextRequest, NextResponse } from 'next/server';
import { processRAGQuery } from '@/lib/rag-backend';

export async function POST(request: NextRequest) {
  console.log('🌐 [API] RAG API endpoint called');
  
  try {
    const requestData = await request.json();
    console.log('📥 [API] Request data:', JSON.stringify(requestData, null, 2));
    
    const { agentId, userQuery, context, researchModel = 'exa' } = requestData;

    if (!agentId || !userQuery) {
      console.error('❌ [API] Missing required fields:', { agentId: !!agentId, userQuery: !!userQuery });
      return NextResponse.json(
        { error: 'Missing required fields: agentId and userQuery' },
        { status: 400 }
      );
    }

    console.log(`🎯 [API] Processing query for agent: ${agentId}`);
    console.log(`📝 [API] Query: "${userQuery}"`);
    console.log(`🔬 [API] Research Model: ${researchModel.toUpperCase()}`);

    // Process the query through the specified RAG agent
    const response = await processRAGQuery(agentId, userQuery, context, researchModel);
    
    console.log(`✅ [API] Response from ${agentId}:`, response);

    const result = {
      success: true,
      agentId,
      response,
      timestamp: new Date().toISOString()
    };
    
    console.log('📤 [API] Sending response:', JSON.stringify(result, null, 2));
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('💥 [API] RAG API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}