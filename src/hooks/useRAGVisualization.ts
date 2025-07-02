'use client';

import { useState, useCallback } from 'react';
import { RAGState } from '@/types';
import { generateResponse } from '@/lib/rag-simulator';
import { RAG_NODES } from '@/config/nodes';

export const useRAGVisualization = () => {
  const [ragState, setRagState] = useState<RAGState>({
    userPrompt: '',
    generatedContent: {},
    isProcessing: false
  });

  const handlePromptSubmit = useCallback((prompt: string) => {
    setRagState(prev => ({ ...prev, isProcessing: true }));
    
    // Generate responses for all nodes except user-prompt
    const newContent: Record<string, string> = {};
    RAG_NODES.forEach(node => {
      if (node.id !== 'user-prompt') {
        newContent[node.id] = generateResponse(node.id, prompt);
      }
    });

    setRagState({
      userPrompt: prompt,
      generatedContent: newContent,
      isProcessing: false,
      lastUpdated: new Date()
    });
  }, []);

  const resetState = useCallback(() => {
    setRagState({
      userPrompt: '',
      generatedContent: {},
      isProcessing: false
    });
  }, []);

  return {
    ragState,
    handlePromptSubmit,
    resetState,
    isProcessing: ragState.isProcessing
  };
};