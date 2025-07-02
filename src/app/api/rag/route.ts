import { NextRequest, NextResponse } from 'next/server';
import { processVisualRAGQuery } from '@/lib/rag-backend-simple';
import { processComplexRAGQuery } from '@/lib/rag-backend-complex';

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

    // Define which agents use simple vs complex processing
    const simpleAgents = ['router-agent', 'direct-generation', 'response-delivery', 'langsmith-logging', 'user-response'];
    const complexAgents = ['orchestrator-agent', 'decompose-query', 'worker-retrieval', 'worker-research', 'worker-analysis', 'shared-state', 'synthesis-agent', 'evaluator-agent'];
    
    let response: string;
    
    if (simpleAgents.includes(agentId)) {
      console.log(`🚀 [API] Using SIMPLE backend for ${agentId}`);
      response = await processVisualRAGQuery(agentId as any, userQuery, context, researchModel);
    } else if (complexAgents.includes(agentId)) {
      console.log(`🚀 [API] Using COMPLEX backend for ${agentId}`);
      response = await processComplexRAGQuery(agentId, userQuery, context, researchModel);
    } else {
      console.log(`⚠️ [API] Unknown agent ${agentId}, defaulting to complex backend`);
      response = await processComplexRAGQuery(agentId, userQuery, context, researchModel);
    }
    
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