'use client';

import { useState } from 'react';
import { NodeData } from '../data/nodes';
import styles from '../visualization.module.css';

interface UserPromptProps {
  node: NodeData;
}

export default function UserPrompt({ node }: UserPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (prompt.trim()) {
      console.log('Sending prompt:', prompt);
      // TODO: Add your prompt handling logic here
      setPrompt('');
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    setIsTyping(value.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
      <div className={styles.nodeLabel}>{node.label}</div>
      <div className={styles.userPromptContainer}>
        <textarea
          className={styles.userPromptInput}
          value={prompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter your query to start the RAG process..."
          rows={4}
        />
        <button
          className={`${styles.sendButton} ${isTyping ? styles.sendButtonActive : ''}`}
          onClick={handleSend}
          disabled={!isTyping}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}