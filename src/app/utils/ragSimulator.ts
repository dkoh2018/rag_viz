// RAG Backend Integration with rate limiting protection and immediate cancellation
export const generateResponse = async (
  nodeId: string, 
  userPrompt: string, 
  shouldStop?: () => boolean,
  abortSignal?: AbortSignal,
  researchModel: 'exa' | 'perplexity' | 'local' = 'exa'
): Promise<string> => {
  try {
    // Check if already aborted before starting
    if (abortSignal?.aborted) {
      throw new DOMException('Request was aborted', 'AbortError');
    }
    
    // Check shouldStop before delay
    if (shouldStop && shouldStop()) {
      throw new Error('Stopped by user');
    }
    
    // Add small delay to prevent rate limiting, but make it interruptible
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 500);
      
      if (abortSignal) {
        abortSignal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new DOMException('Request was aborted', 'AbortError'));
        });
      }
    });
    
    // Final check before API call
    if (shouldStop && shouldStop()) {
      throw new Error('Stopped by user');
    }
    
    if (abortSignal?.aborted) {
      throw new DOMException('Request was aborted', 'AbortError');
    }
    
    console.log(`💰 [COST PROTECTION] Making API call for ${nodeId}`);
    
    const response = await fetch('/api/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: nodeId,
        userQuery: userPrompt,
        context: '', // Can be enhanced later with context passing
        researchModel: researchModel
      }),
      signal: abortSignal // CRITICAL: This will cancel the fetch immediately
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ [COST PROTECTION] API call completed for ${nodeId}`);
    return data.response || `Error: No response from ${nodeId}`;
    
  } catch (error) {
    if (error instanceof Error && error.message === 'Stopped by user') {
      console.log(`🛑 [COST PROTECTION] ${nodeId} stopped by user flag`);
      throw error; // Re-throw stop errors
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log(`🛑 [COST PROTECTION] ${nodeId} API call aborted immediately`);
      throw error; // Re-throw abort errors
    }
    console.error(`Error calling RAG API for ${nodeId}:`, error);
    // Fallback to echo for development
    return `[DEV MODE] ${userPrompt}`;
  }
};