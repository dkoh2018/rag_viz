'use client';

import { useState, useEffect } from 'react';
import { NodeData } from '../data/nodes';
import styles from '../visualization.module.css';

interface UserPromptProps {
  node: NodeData;
  onPromptSubmit: (prompt: string) => void;
  isProcessing?: boolean;
  submittedPrompt?: string;
}

export default function UserPrompt({ node, onPromptSubmit, isProcessing = false, submittedPrompt = '' }: UserPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
    if (e.key === 'Enter' && !e.shiftKey && !isProcessing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className={styles.node} 
      style={{ 
        left: node.position.left, 
        top: node.position.top 
      }}
    >
      <div className={styles.nodeLabel}>
        {node.label}
        {isProcessing && <span style={{ marginLeft: '8px', color: '#ff6b35' }}>🔄 Processing...</span>}
      </div>
      <div className={styles.userPromptContainer}>
        <textarea
          className={`${styles.userPromptInput} ${isProcessing ? styles.userPromptDisabled : ''}`}
          value={displayPrompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isProcessing ? "Processing your query..." : "Enter your query to start the RAG process..."}
          rows={4}
          disabled={isInputDisabled}
        />
        <button
          className={`${styles.sendButton} ${(isTyping && !isProcessing) ? styles.sendButtonActive : ''}`}
          onClick={handleSend}
          disabled={!isTyping || isProcessing}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}