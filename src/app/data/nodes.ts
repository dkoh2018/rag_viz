export interface NodeData {
  id: string;
  label: string;
  content: string;
  position: {
    left: string;
    top: string;
  };
}

export const nodes: NodeData[] = [
  {
    id: 'user-prompt',
    label: 'User Prompt',
    content: 'What is machine learning and how does it work?',
    position: { left: '20px', top: '700px' }
  },
  {
    id: 'router-agent',
    label: 'Router Agent',
    content: '🔀 ROUTING ANALYSIS: Query "What is machine learning and how does it work?" classified as complex - routing to orchestrator for multi-agent processing.',
    position: { left: '600px', top: '700px' }
  },
  {
    id: 'direct-generation',
    label: 'Direct Generation',
    content: '🎯 DIRECT RESPONSE: For simple query "What is machine learning and how does it work?" - Retrieved relevant docs and generated: This is a direct answer based on knowledge base retrieval.',
    position: { left: '4000px', top: '500px' }
  },
  {
    id: 'orchestrator-agent',
    label: 'Orchestrator Agent',
    content: '🎭 ORCHESTRATION: Breaking down complex query "What is machine learning and how does it work?" into sub-tasks: [retrieval], [research], [analysis]. Coordinating worker agents...',
    position: { left: '1000px', top: '1000px' }
  },
  {
    id: 'decompose-query',
    label: 'Decompose Query',
    content: '🔄 DECOMPOSITION: Query "What is machine learning and how does it work?" split into:\n1. Information retrieval task\n2. Research analysis task\n3. Data processing task',
    position: { left: '1650px', top: '1000px' }
  },
  {
    id: 'worker-retrieval',
    label: 'Worker Agent: Retrieval',
    content: '📚 RETRIEVAL COMPLETE: Found 15 relevant documents for "What is machine learning and how does it work?". Top matches: knowledge_base_doc_1.pdf, research_paper_3.pdf, manual_section_7.md',
    position: { left: '2350px', top: '600px' }
  },
  {
    id: 'worker-research',
    label: 'Worker Agent: Research',
    content: '🔍 RESEARCH COMPLETE: Cross-referenced 8 sources for "What is machine learning and how does it work?". Identified 3 key themes and 2 potential contradictions requiring synthesis.',
    position: { left: '2350px', top: '1000px' }
  },
  {
    id: 'worker-analysis',
    label: 'Worker Agent: Analysis',
    content: '📊 ANALYSIS COMPLETE: Processed data for "What is machine learning and how does it work?". Generated insights: 85% confidence score, 3 supporting arguments, 1 limitation identified.',
    position: { left: '2350px', top: '1400px' }
  },
  {
    id: 'shared-state',
    label: 'Shared State',
    content: '🗃️ STATE UPDATE: Consolidated findings from all workers for "What is machine learning and how does it work?". Retrieved: 15 docs, Research: 8 sources, Analysis: 85% confidence. Ready for synthesis.',
    position: { left: '3000px', top: '1000px' }
  },
  {
    id: 'synthesis-agent',
    label: 'Synthesis Agent',
    content: '⚡ SYNTHESIS COMPLETE: Combined all worker outputs for "What is machine learning and how does it work?". Generated coherent response integrating retrieval, research, and analysis findings.',
    position: { left: '3650px', top: '1000px' }
  },
  {
    id: 'evaluator-agent',
    label: 'Evaluator Agent',
    content: '✅ EVALUATION: Response for "What is machine learning and how does it work?" scored: Accuracy: 89%, Completeness: 92%, Relevance: 95%. VERDICT: Approved for delivery.',
    position: { left: '4200px', top: '1200px' }
  },
  {
    id: 'response-delivery',
    label: 'Response Delivery',
    content: '📤 DELIVERING: Final response for "What is machine learning and how does it work?" formatted with citations, confidence scores, and source references. Ready for user.',
    position: { left: '4750px', top: '850px' }
  },
  {
    id: 'langsmith-logging',
    label: 'LangSmith Logging',
    content: '📋 LOGGED: Session for "What is machine learning and how does it work?" - 14 agent interactions, 2.3s total latency, 0 errors. Metrics captured for optimization.',
    position: { left: '5400px', top: '850px' }
  },
  {
    id: 'user-response',
    label: 'User Response',
    content: '💬 FINAL OUTPUT: Based on your query "What is machine learning and how does it work?", here is the comprehensive response generated through our RAG pipeline with full traceability and citations.',
    position: { left: '6050px', top: '850px' }
  }
];