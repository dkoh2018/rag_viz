import { NextRequest, NextResponse } from 'next/server';
import { performExaSearch, performPerplexityResearch } from '@/lib/research-tools';

// Test endpoint to verify research APIs are working
export async function POST(request: NextRequest) {
  console.log('🧪 [TEST] Research API test endpoint called');
  
  try {
    const requestData = await request.json();
    const { tool = 'exa', query = 'test query' } = requestData;
    
    console.log(`🧪 [TEST] Testing ${tool.toUpperCase()} with query: "${query}"`);
    
    let result;
    const startTime = Date.now();
    
    switch (tool) {
      case 'exa':
        result = await performExaSearch(query, 2); // Limit to 2 results for testing
        break;
      case 'perplexity':
        result = await performPerplexityResearch(query);
        break;
      default:
        throw new Error(`Unknown tool: ${tool}`);
    }
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ [TEST] ${tool.toUpperCase()} test completed in ${duration}ms`);
    console.log(`📊 [TEST] Result length: ${result.length} characters`);
    
    return NextResponse.json({
      success: true,
      tool,
      query,
      duration: `${duration}ms`,
      resultLength: result.length,
      result: result.substring(0, 500) + (result.length > 500 ? '...[truncated]' : ''), // Truncate for readability
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 [TEST] Research API test error:', error);
    return NextResponse.json(
      { 
        error: 'Research API test failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}