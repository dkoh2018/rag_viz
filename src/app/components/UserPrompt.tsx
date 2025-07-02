'use client';

import { useState, useEffect } from 'react';
import { NodeData } from '../data/nodes';
import styles from '../visualization.module.css';

interface UserPromptProps {
  node: NodeData;
  onPromptSubmit: (prompt: string) => void;
  isProcessing?: boolean;
  submittedPrompt?: string;
  showReadyGlow?: boolean;
}

export default function UserPrompt({ node, onPromptSubmit, isProcessing = false, submittedPrompt = '', showReadyGlow = false }: UserPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Reset internal state when submittedPrompt is cleared (reset)
  useEffect(() => {
    if (submittedPrompt === '' && !isProcessing) {
      setPrompt('');
      setIsTyping(false);
    }
  }, [submittedPrompt, isProcessing]);

  // Use submitted prompt if processing, otherwise use current input
  const displayPrompt = isProcessing ? submittedPrompt : prompt;
  const isInputDisabled = isProcessing;

  const handleSend = () => {
    if (prompt.trim() && !isProcessing) {
      onPromptSubmit(prompt.trim());
      // Don't clear the prompt anymore - it will be preserved via submittedPrompt
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isProcessing) return; // Prevent changes during processing
    
    const value = e.target.value;
    setPrompt(value);
    setIsTyping(value.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isProcessing && !isOptimizing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOptimize = async () => {
    if (!prompt.trim() || isProcessing || isOptimizing) return;

    setIsOptimizing(true);
    console.log('✨ [OPTIMIZE] Starting prompt optimization...');

    try {
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt: prompt.trim()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.optimizedPrompt) {
        console.log('✅ [OPTIMIZE] Prompt optimized successfully');
        console.log('📝 [OPTIMIZE] Original:', prompt);
        console.log('✨ [OPTIMIZE] Optimized:', data.optimizedPrompt);
        
        // Replace the prompt with optimized version
        setPrompt(data.optimizedPrompt);
        setIsTyping(data.optimizedPrompt.trim().length > 0);
      } else {
        throw new Error('Optimization failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ [OPTIMIZE] Optimization error:', error);
      // Could add toast notification here in the future
    } finally {
      setIsOptimizing(false);
    }
  };

  // Determine node styling class
  const getNodeClass = () => {
    let classes = styles.node;
    if (showReadyGlow) {
      classes += ` ${styles.nodeReadyStart}`;
    }
    return classes;
  };

  return (
    <div 
      className={getNodeClass()} 
      style={{ 
        left: node.position.left, 
        top: node.position.top 
      }}
    >
      <div className={styles.nodeLabel}>
        {node.label}
        {isProcessing && <span style={{ marginLeft: '8px', color: '#ff6b35' }}>🔄 Processing...</span>}
        {isOptimizing && <span style={{ marginLeft: '8px', color: '#8b5cf6' }}>✨ Optimizing...</span>}
      </div>
      <div className={styles.userPromptContainer}>
        <textarea
          className={`${styles.userPromptInput} ${isProcessing ? styles.userPromptDisabled : ''}`}
          value={displayPrompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isProcessing ? "Processing your query..." : isOptimizing ? "Optimizing your prompt..." : "What is machine learning and how does it work?"}
          rows={3}
          disabled={isInputDisabled || isOptimizing}
        />
        <div className={styles.promptButtons}>
          <button
            className={`${styles.optimizeButton} ${(isTyping && !isProcessing && !isOptimizing) ? styles.optimizeButtonActive : ''} ${isOptimizing ? styles.optimizeButtonLoading : ''}`}
            onClick={handleOptimize}
            disabled={!isTyping || isProcessing || isOptimizing}
            title="Optimize prompt for better results"
          >
            {isOptimizing ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <button
            className={`${styles.sendButton} ${(isTyping && !isProcessing && !isOptimizing) ? styles.sendButtonActive : ''}`}
            onClick={handleSend}
            disabled={!isTyping || isProcessing || isOptimizing}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}