import { NodeResponseGenerator } from '@/types';

/**
 * Simple echo response generator
 * Returns the user prompt as-is for all nodes
 * 
 * @param nodeId - The ID of the node requesting a response
 * @param userPrompt - The user's input prompt
 * @returns The user prompt echoed back
 */
export const generateResponse: NodeResponseGenerator = (nodeId: string, userPrompt: string): string => {
  return userPrompt;
};

/**
 * Advanced RAG simulation (for future use)
 * Uncomment and modify this function when implementing real backend
 */
/*
export const generateAdvancedResponse: NodeResponseGenerator = (nodeId: string, userPrompt: string): string => {
  const responses: Record<string, (prompt: string) => string> = {
    'router-agent': (prompt) => 
      `🔀 ROUTING: "${prompt}" → ${prompt.length > 50 ? 'complex' : 'simple'}`,
    'worker-retrieval': (prompt) => 
      `📚 RETRIEVED: Found docs for "${prompt}"`,
    // Add more node-specific responses here...
  };

  return responses[nodeId]?.(userPrompt) || `Processing "${userPrompt}"...`;
};
*/