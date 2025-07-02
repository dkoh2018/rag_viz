'use client';

import { useState } from 'react';
import styles from './visualization.module.css';
import { nodes } from './data/nodes';
import UserPrompt from './components/UserPrompt';
import GenerativeNode from './components/GenerativeNode';
import Connectors from './components/Connectors';
import { generateResponse } from './utils/ragSimulator';

export default function RAGVisualization() {
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());

  // Helper functions for loading state management
  const addLoadingNode = (nodeId: string) => {
    setLoadingNodes(prev => new Set([...prev, nodeId]));
    console.log(`⏳ [LOADING] ${nodeId} started loading`);
  };

  const removeLoadingNode = (nodeId: string) => {
    setLoadingNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
    console.log(`✅ [LOADING] ${nodeId} finished loading`);
  };

  const clearAllLoadingNodes = () => {
    setLoadingNodes(new Set());
    console.log(`🧹 [LOADING] All loading states cleared`);
  };

  const handleStop = () => {
    setShouldStop(true);
    
    // IMMEDIATELY abort all ongoing API requests
    if (abortController) {
      abortController.abort();
      console.log('🛑 API requests aborted immediately');
    }
    
    console.log('🛑 RAG Pipeline stopped by user');
  };

  const handleReset = () => {
    // Stop any current processing and abort requests
    setShouldStop(true);
    if (abortController) {
      abortController.abort();
    }
    
    // Reset all state
    setUserPrompt('');
    setGeneratedContent({});
    setIsProcessing(false);
    setShouldStop(false);
    setAbortController(null);
    clearAllLoadingNodes();
    
    console.log('🔄 Website reset by user - reloading page');
    
    // Reload the entire page (like Ctrl+R)
    window.location.reload();
  };

  // Wrapper function to track loading state for individual nodes
  const generateResponseWithLoading = async (nodeId: string, prompt: string, checkShouldStop: () => boolean, signal: AbortSignal) => {
    addLoadingNode(nodeId);
    try {
      const result = await generateResponse(nodeId, prompt, checkShouldStop, signal);
      removeLoadingNode(nodeId);
      return result;
    } catch (error) {
      removeLoadingNode(nodeId);
      throw error;
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    if (isProcessing) return; // Prevent multiple submissions
    
    // Cleanup any existing controller first (extra safety)
    if (abortController) {
      abortController.abort();
    }
    
    // Create new AbortController for this session
    const controller = new AbortController();
    setAbortController(controller);
    
    console.log('💰 [COST PROTECTION] New RAG session started with abort protection');
    
    setUserPrompt(prompt);
    setIsProcessing(true);
    setShouldStop(false);
    
    const newContent: Record<string, string> = {};
    const updateContent = (nodeId: string, content: string) => {
      newContent[nodeId] = content;
      setGeneratedContent({ ...newContent });
    };
    
    const checkShouldStop = () => shouldStop;

    try {
      // Step 1: Router Agent
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 1: Router Agent');
      const routerResponse = await generateResponseWithLoading('router-agent', prompt, checkShouldStop, controller.signal);
      updateContent('router-agent', routerResponse);
      
      // Step 2a: Direct Generation (parallel path)
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 2a: Direct Generation (parallel)');
      const directGenPromise = generateResponseWithLoading('direct-generation', prompt, checkShouldStop, controller.signal);
      
      // Step 2b: Orchestrator Agent  
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 2b: Orchestrator Agent');
      const orchestratorResponse = await generateResponseWithLoading('orchestrator-agent', prompt, checkShouldStop, controller.signal);
      updateContent('orchestrator-agent', orchestratorResponse);
      
      // Step 3: Decompose Query
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 3: Decompose Query');
      const decomposeResponse = await generateResponseWithLoading('decompose-query', prompt, checkShouldStop, controller.signal);
      updateContent('decompose-query', decomposeResponse);
      
      // Step 4: Worker Threads (parallel execution)
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 4: Worker Threads (parallel)');
      const [retrievalResponse, researchResponse, analysisResponse] = await Promise.all([
        generateResponseWithLoading('worker-retrieval', prompt, checkShouldStop, controller.signal),
        generateResponseWithLoading('worker-research', prompt, checkShouldStop, controller.signal),
        generateResponseWithLoading('worker-analysis', prompt, checkShouldStop, controller.signal)
      ]);
      
      updateContent('worker-retrieval', retrievalResponse);
      updateContent('worker-research', researchResponse);
      updateContent('worker-analysis', analysisResponse);
      
      // Step 5: Shared State
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 5: Shared State');
      const sharedStateResponse = await generateResponseWithLoading('shared-state', prompt, checkShouldStop, controller.signal);
      updateContent('shared-state', sharedStateResponse);
      
      // Step 6: Synthesis Agent
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 6: Synthesis Agent');
      const synthesisResponse = await generateResponseWithLoading('synthesis-agent', prompt, checkShouldStop, controller.signal);
      updateContent('synthesis-agent', synthesisResponse);
      
      // Step 7: Evaluator Agent
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 7: Evaluator Agent');
      const evaluatorResponse = await generateResponseWithLoading('evaluator-agent', prompt, checkShouldStop, controller.signal);
      updateContent('evaluator-agent', evaluatorResponse);
      
      // Wait for Direct Generation to complete if not already done
      if (!shouldStop) {
        const directResponse = await directGenPromise;
        updateContent('direct-generation', directResponse);
      }
      
      // Step 8: Response Delivery (combines evaluator and direct generation)
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 8: Response Delivery');
      const responseDeliveryResponse = await generateResponseWithLoading('response-delivery', prompt, checkShouldStop, controller.signal);
      updateContent('response-delivery', responseDeliveryResponse);
      
      // Step 9: LangSmith Logging
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 9: LangSmith Logging');
      const langsmithResponse = await generateResponseWithLoading('langsmith-logging', prompt, checkShouldStop, controller.signal);
      updateContent('langsmith-logging', langsmithResponse);
      
      // Step 10: User Response
      if (shouldStop) throw new Error('Stopped by user');
      console.log('🔄 Step 10: User Response');
      const userResponseResponse = await generateResponseWithLoading('user-response', prompt, checkShouldStop, controller.signal);
      updateContent('user-response', userResponseResponse);
      
      console.log('✅ RAG Pipeline Complete!');
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Stopped by user') {
        console.log('🛑 RAG Pipeline stopped by user - preserving current state');
      } else if (error instanceof Error && error.name === 'AbortError') {
        console.log('🛑 API requests aborted - RAG Pipeline stopped');
      } else {
        console.error('❌ RAG Pipeline Error:', error);
      }
    } finally {
      setIsProcessing(false);
      setShouldStop(false);
      setAbortController(null);
      clearAllLoadingNodes();
    }
  };

  return (
    <div className={styles.container}>
      {/* Control Buttons - Top Left */}
      <div className={styles.controlButtons}>
        <button 
          className={`${styles.statusButton} ${isProcessing ? styles.statusButtonStop : styles.statusButtonReady}`}
          onClick={isProcessing ? handleStop : undefined}
          title={isProcessing ? "Stop RAG Pipeline" : "Ready - No active processing"}
          disabled={!isProcessing}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {isProcessing ? (
              <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
            ) : (
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            )}
          </svg>
          {isProcessing ? 'Stop' : 'Ready'}
        </button>

        <button 
          className={`${styles.statusButton} ${styles.resetButton}`}
          onClick={handleReset}
          title="Reset everything and clear all content"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 21v-5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reset
        </button>
      </div>
      
      <div className={styles.scrollWrapper}>
        <div className={styles.diagramContainer}>
          {/* SVG Layer for Connectors */}
          <Connectors />

          {/* Process Nodes */}
          {nodes.map((node) => {
            if (node.id === 'user-prompt') {
              return (
                <UserPrompt 
                  key={node.id} 
                  node={node} 
                  onPromptSubmit={handlePromptSubmit}
                  isProcessing={isProcessing}
                  submittedPrompt={userPrompt}
                />
              );
            } else {
              return (
                <GenerativeNode 
                  key={node.id} 
                  node={node} 
                  generatedContent={generatedContent[node.id]}
                  isLoading={loadingNodes.has(node.id)}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}