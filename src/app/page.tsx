'use client';

import { useState } from 'react';
import styles from './visualization.module.css';
import { nodes } from './data/nodes';
import Node from './components/Node';
import UserPrompt from './components/UserPrompt';
import GenerativeNode from './components/GenerativeNode';
import Connectors from './components/Connectors';
import { generateResponse } from './utils/ragSimulator';

export default function RAGVisualization() {
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});

  const handlePromptSubmit = (prompt: string) => {
    setUserPrompt(prompt);
    
    // Generate responses for all nodes except user-prompt
    const newContent: Record<string, string> = {};
    nodes.forEach(node => {
      if (node.id !== 'user-prompt') {
        newContent[node.id] = generateResponse(node.id, prompt);
      }
    });
    setGeneratedContent(newContent);
  };

  return (
    <div className={styles.container}>
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
                />
              );
            } else {
              return (
                <GenerativeNode 
                  key={node.id} 
                  node={node} 
                  generatedContent={generatedContent[node.id]}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}