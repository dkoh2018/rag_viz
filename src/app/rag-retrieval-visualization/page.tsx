'use client';

import { useState } from 'react';
import styles from '../visualization.module.css';
import { nodes } from '../data/nodes';
import UserPrompt from '../components/UserPrompt';
import GenerativeNode from '../components/GenerativeNode';
import Connectors from '../components/Connectors';
import { generateResponse } from '../utils/ragSimulator';

export default function RAGVisualization() {
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());
  const [currentProcessingNode, setCurrentProcessingNode] = useState<string | null>(null);
  const [researchModel, setResearchModel] = useState<'exa' | 'perplexity' | 'local'>('exa');
  const [showFinalResponseGlow, setShowFinalResponseGlow] = useState(false);
  const [isSimultaneousWorking, setIsSimultaneousWorking] = useState(false);

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
    setCurrentProcessingNode(null);
    console.log(`🧹 [LOADING] All loading states cleared`);
  };

  const setActiveProcessingNode = (nodeId: string | null) => {
    setCurrentProcessingNode(nodeId);
    if (nodeId) {
      console.log(`🔥 [ACTIVE] ${nodeId} is now actively processing`);
    } else {
      console.log(`🔥 [ACTIVE] No node actively processing`);
    }
  };

  const handleResearchModelToggle = () => {
    let newModel: 'exa' | 'perplexity' | 'local';
    if (researchModel === 'exa') {
      newModel = 'perplexity';
    } else if (researchModel === 'perplexity') {
      newModel = 'local';
    } else {
      newModel = 'exa';
    }
    setResearchModel(newModel);
    console.log(`🔄 [RESEARCH] Switched to ${newModel.toUpperCase()} for retrieval`);
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
  const generateResponseWithLoading = async (nodeId: string, prompt: string, checkShouldStop: () => boolean, signal: AbortSignal, context: string = '') => {
    addLoadingNode(nodeId);
    setActiveProcessingNode(nodeId); // Mark as actively processing
    try {
      const result = await generateResponse(nodeId, prompt, checkShouldStop, signal, researchModel, context);
      removeLoadingNode(nodeId);
      
      // Keep response-delivery node glowing until pipeline complete
      if (nodeId !== 'response-delivery') {
        setActiveProcessingNode(null); // Clear active processing for other nodes
      }
      // response-delivery stays active until pipeline completion
      
      return result;
    } catch (error) {
      removeLoadingNode(nodeId);
      setActiveProcessingNode(null); // Clear active processing on error
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
    
    // Clear all previous state for new query
    setGeneratedContent({});
    clearAllLoadingNodes();
    setUserPrompt(prompt);
    setIsProcessing(true);
    setShouldStop(false);
    setShowFinalResponseGlow(false); // Reset green glow when starting new processing
    
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
      
      // Parse router decision
      const isSimpleQuery = routerResponse.toLowerCase().includes('simple');
      const isComplexQuery = routerResponse.toLowerCase().includes('complex');
      
      console.log(`🧭 [ROUTER] Decision: ${isSimpleQuery ? 'SIMPLE' : isComplexQuery ? 'COMPLEX' : 'UNKNOWN'} query`);
      
      if (isSimpleQuery) {
        // SIMPLE QUERY PATH: Router → Direct Generation → Response Delivery → Logging → User Response
        console.log('🚀 [SIMPLE PATH] Executing simple query pipeline');
        
        // Step 2: Direct Generation
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 2: Direct Generation');
        const directResponse = await generateResponseWithLoading('direct-generation', prompt, checkShouldStop, controller.signal);
        updateContent('direct-generation', directResponse);
        
        // Step 3: Response Delivery
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 3: Response Delivery');
        const responseDeliveryResponse = await generateResponseWithLoading('response-delivery', prompt, checkShouldStop, controller.signal, directResponse);
        updateContent('response-delivery', responseDeliveryResponse);
        
        // Step 4: LangSmith Logging
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 4: LangSmith Logging');
        const langsmithResponse = await generateResponseWithLoading('langsmith-logging', prompt, checkShouldStop, controller.signal, responseDeliveryResponse);
        updateContent('langsmith-logging', langsmithResponse);
        
        console.log('✅ Simple Query Pipeline Complete!');
        
      } else if (isComplexQuery) {
        // COMPLEX QUERY PATH: Router → Orchestrator → Full multi-agent pipeline
        console.log('🚀 [COMPLEX PATH] Executing complex query pipeline');
        
        // Step 2: Orchestrator Agent  
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 2: Orchestrator Agent');
        const orchestratorResponse = await generateResponseWithLoading('orchestrator-agent', prompt, checkShouldStop, controller.signal);
        updateContent('orchestrator-agent', orchestratorResponse);
        
        // Step 3: Decompose Query
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 3: Decompose Query');
        const decomposeResponse = await generateResponseWithLoading('decompose-query', prompt, checkShouldStop, controller.signal);
        updateContent('decompose-query', decomposeResponse);
        
        // Step 4: Worker Threads (sequential execution with context passing)
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 4: Worker Threads (sequential)');
        
        // Start simultaneous working illusion - all workers glow yellow
        setIsSimultaneousWorking(true);
        console.log('✨ [UI ILLUSION] All worker agents now glowing simultaneously (yellow)');
        
        // Step 4a: Retrieval Worker (gets research data)
        const retrievalResponse = await generateResponseWithLoading('worker-retrieval', prompt, checkShouldStop, controller.signal);
        updateContent('worker-retrieval', retrievalResponse);
        
        // Step 4b: Research Worker (analyzes retrieved data)
        const researchResponse = await generateResponseWithLoading('worker-research', prompt, checkShouldStop, controller.signal, retrievalResponse);
        updateContent('worker-research', researchResponse);
        
        // Step 4c: Analysis Worker (draws conclusions from research)
        const analysisResponse = await generateResponseWithLoading('worker-analysis', prompt, checkShouldStop, controller.signal, researchResponse);
        updateContent('worker-analysis', analysisResponse);
        
        // Stop simultaneous working illusion - analysis complete
        setIsSimultaneousWorking(false);
        console.log('🎯 [UI ILLUSION] Worker analysis complete - stopping simultaneous glow');
        
        // Step 5: Shared State (consolidate all worker outputs)
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 5: Shared State');
        const workerOutputs = `
RETRIEVAL WORKER OUTPUT:
${retrievalResponse}

RESEARCH WORKER OUTPUT:
${researchResponse}

ANALYSIS WORKER OUTPUT:
${analysisResponse}
        `.trim();
        const sharedStateResponse = await generateResponseWithLoading('shared-state', prompt, checkShouldStop, controller.signal, workerOutputs);
        updateContent('shared-state', sharedStateResponse);
        
        // Step 6: Synthesis Agent (use shared state results)
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 6: Synthesis Agent');
        const synthesisResponse = await generateResponseWithLoading('synthesis-agent', prompt, checkShouldStop, controller.signal, sharedStateResponse);
        updateContent('synthesis-agent', synthesisResponse);
        
        // Step 7: Evaluator Agent (evaluate synthesis response)
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 7: Evaluator Agent');
        const evaluatorResponse = await generateResponseWithLoading('evaluator-agent', prompt, checkShouldStop, controller.signal, synthesisResponse);
        updateContent('evaluator-agent', evaluatorResponse);
        
        // Step 8: Response Delivery (deliver synthesis response)
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 8: Response Delivery');
        const responseDeliveryResponse = await generateResponseWithLoading('response-delivery', prompt, checkShouldStop, controller.signal, synthesisResponse);
        updateContent('response-delivery', responseDeliveryResponse);
        
        // Step 9: LangSmith Logging
        if (shouldStop) throw new Error('Stopped by user');
        console.log('🔄 Step 9: LangSmith Logging');
        const langsmithResponse = await generateResponseWithLoading('langsmith-logging', prompt, checkShouldStop, controller.signal);
        updateContent('langsmith-logging', langsmithResponse);
        
        console.log('✅ Complex Query Pipeline Complete!');
        
      } else {
        // Fallback: treat as complex if router decision is unclear
        console.log('⚠️ [ROUTER] Unclear decision, defaulting to complex path');
        console.log('🚀 [COMPLEX PATH] Executing complex query pipeline (fallback)');
        
        // Execute complex path as fallback...
        // (Same complex path code as above, but I'll keep it brief to avoid duplication)
        const orchestratorResponse = await generateResponseWithLoading('orchestrator-agent', prompt, checkShouldStop, controller.signal);
        updateContent('orchestrator-agent', orchestratorResponse);
        
        const decomposeResponse = await generateResponseWithLoading('decompose-query', prompt, checkShouldStop, controller.signal);
        updateContent('decompose-query', decomposeResponse);
        
        // Worker Threads (sequential execution with context passing)
        const retrievalResponse = await generateResponseWithLoading('worker-retrieval', prompt, checkShouldStop, controller.signal);
        updateContent('worker-retrieval', retrievalResponse);
        
        const researchResponse = await generateResponseWithLoading('worker-research', prompt, checkShouldStop, controller.signal, retrievalResponse);
        updateContent('worker-research', researchResponse);
        
        const analysisResponse = await generateResponseWithLoading('worker-analysis', prompt, checkShouldStop, controller.signal, researchResponse);
        updateContent('worker-analysis', analysisResponse);
        
        // Shared State (consolidate all worker outputs)
        const workerOutputs = `
RETRIEVAL WORKER OUTPUT:
${retrievalResponse}

RESEARCH WORKER OUTPUT:
${researchResponse}

ANALYSIS WORKER OUTPUT:
${analysisResponse}
        `.trim();
        const sharedStateResponse = await generateResponseWithLoading('shared-state', prompt, checkShouldStop, controller.signal, workerOutputs);
        updateContent('shared-state', sharedStateResponse);
        
        const synthesisResponse = await generateResponseWithLoading('synthesis-agent', prompt, checkShouldStop, controller.signal, sharedStateResponse);
        updateContent('synthesis-agent', synthesisResponse);
        
        const evaluatorResponse = await generateResponseWithLoading('evaluator-agent', prompt, checkShouldStop, controller.signal, synthesisResponse);
        updateContent('evaluator-agent', evaluatorResponse);
        
        const responseDeliveryResponse = await generateResponseWithLoading('response-delivery', prompt, checkShouldStop, controller.signal, synthesisResponse);
        updateContent('response-delivery', responseDeliveryResponse);
        
        const langsmithResponse = await generateResponseWithLoading('langsmith-logging', prompt, checkShouldStop, controller.signal);
        updateContent('langsmith-logging', langsmithResponse);
        
        console.log('✅ Complex Query Pipeline Complete (fallback)!');
      }
      
      // Keep response-delivery glowing with completion state, then show green glow
      setTimeout(() => {
        setActiveProcessingNode(null);
        setShowFinalResponseGlow(true);
        console.log('🔥 [ACTIVE] Final glow cleared - showing green completion glow');
      }, 3000); // 3 seconds to show completion, then green glow
      
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
      {/* Mobile/Small Screen Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl lg:hidden">
        <div className="relative w-full max-w-md bg-white/5 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-3xl shadow-2xl shadow-black/50 p-8 text-center before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:opacity-50 overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Better on Desktop</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">This RAG visualization works best on larger screens. For the optimal experience, please view on a desktop or tablet.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-400/60"></span>
                <span>Recommended: 1024px+ width</span>
              </div>
              <a 
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>

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
        
        {/* Research Model Toggle Button */}
        <button 
          className={`${styles.statusButton} ${styles.researchModelButton} ${
            researchModel === 'exa' ? styles.researchModelExa :
            researchModel === 'perplexity' ? styles.researchModelPerplexity :
            styles.researchModelLocal
          }`}
          onClick={handleResearchModelToggle}
          title={`Current: ${researchModel.toUpperCase()} - Click to cycle through research models`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {researchModel.toUpperCase()}
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
                  showReadyGlow={!isProcessing && userPrompt === ''}
                />
              );
            } else {
              const isWorkerAgent = node.id.includes('worker-');
              
              return (
                <GenerativeNode 
                  key={node.id} 
                  node={node} 
                  generatedContent={generatedContent[node.id]}
                  isLoading={loadingNodes.has(node.id)}
                  isActiveProcessing={currentProcessingNode === node.id}
                  isPipelineComplete={!isProcessing && generatedContent[node.id] && !showFinalResponseGlow}
                  showReadyGlow={node.id === 'response-delivery' && showFinalResponseGlow}
                  isSimultaneousWorking={isWorkerAgent && isSimultaneousWorking}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}