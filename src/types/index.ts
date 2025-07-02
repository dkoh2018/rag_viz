// Core types for the RAG visualization system

export interface Position {
  left: string;
  top: string;
}

export interface NodeData {
  id: string;
  label: string;
  content: string;
  position: Position;
  type?: 'input' | 'processor' | 'output';
  category?: 'routing' | 'generation' | 'orchestration' | 'worker' | 'synthesis' | 'evaluation' | 'delivery';
}

export interface ConnectionData {
  id: string;
  from: string;
  to: string;
  path: string;
  label?: string;
  condition?: string;
}

export interface RAGState {
  userPrompt: string;
  generatedContent: Record<string, string>;
  isProcessing: boolean;
  lastUpdated?: Date;
}

export interface ThemeConfig {
  colors: {
    background: string;
    nodeBackground: string;
    nodeBorder: string;
    nodeText: string;
    connectorStroke: string;
    connectorText: string;
  };
  dimensions: {
    nodeWidth: number;
    nodeHeight: number;
    containerWidth: number;
    containerHeight: number;
  };
}

export type NodeResponseGenerator = (nodeId: string, userPrompt: string) => string;