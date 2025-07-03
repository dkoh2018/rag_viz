import { NodeData } from '@/types';

export const RAG_NODES: NodeData[] = [
  {
    id: 'user-prompt',
    label: 'User Prompt',
    content: '',
    position: { left: '20px', top: '150px' },
    type: 'input',
    category: 'routing'
  },
  {
    id: 'router-agent',
    label: 'Router Agent',
    content: '',
    position: { left: '600px', top: '150px' },
    type: 'processor',
    category: 'routing'
  },
  {
    id: 'direct-generation',
    label: 'Direct Generation',
    content: '🎯 DIRECT RESPONSE: For simple query "What is machine learning and how does it work?" - Retrieved relevant docs and generated: This is a direct answer based on knowledge base retrieval.',
    position: { left: '2750px', top: '150px' },
    type: 'processor',
    category: 'generation'
  },
  {
    id: 'orchestrator-agent',
    label: 'Orchestrator Agent',
    content: '🎭 ORCHESTRATION: Breaking down complex query "What is machine learning and how does it work?" into sub-tasks: [retrieval], [research], [analysis]. Coordinating worker agents...',
    position: { left: '600px', top: '625px' },
    type: 'processor',
    category: 'orchestration'
  },
  {
    id: 'decompose-query',
    label: 'Decompose Query',
    content: '🔄 DECOMPOSITION: Query "What is machine learning and how does it work?" split into:\n1. Information retrieval task\n2. Research analysis task\n3. Data processing task',
    position: { left: '810px', top: '1150px' },
    type: 'processor',
    category: 'orchestration'
  },
  {
    id: 'worker-retrieval',
    label: 'Worker Agent: Retrieval',
    content: '📚 RETRIEVAL COMPLETE: Found 15 relevant documents for "What is machine learning and how does it work?". Top matches: knowledge_base_doc_1.pdf, research_paper_3.pdf, manual_section_7.md',
    position: { left: '1450px', top: '350px' },
    type: 'processor',
    category: 'worker'
  },
  {
    id: 'worker-research',
    label: 'Worker Agent: Research',
    content: '🔍 RESEARCH COMPLETE: Cross-referenced 8 sources for "What is machine learning and how does it work?". Identified 3 key themes and 2 potential contradictions requiring synthesis.',
    position: { left: '1450px', top: '750px' },
    type: 'processor',
    category: 'worker'
  },
  {
    id: 'worker-analysis',
    label: 'Worker Agent: Analysis',
    content: '📊 ANALYSIS COMPLETE: Processed data for "What is machine learning and how does it work?". Generated insights: 85% confidence score, 3 supporting arguments, 1 limitation identified.',
    position: { left: '1450px', top: '1150px' },
    type: 'processor',
    category: 'worker'
  },
  {
    id: 'shared-state',
    label: 'Shared State',
    content: '🗃️ STATE UPDATE: Consolidated findings from all workers for "What is machine learning and how does it work?". Retrieved: 15 docs, Research: 8 sources, Analysis: 85% confidence. Ready for synthesis.',
    position: { left: '2125px', top: '550px' },
    type: 'processor',
    category: 'synthesis'
  },
  {
    id: 'synthesis-agent',
    label: 'Synthesis Agent',
    content: '⚡ SYNTHESIS COMPLETE: Combined all worker outputs for "What is machine learning and how does it work?". Generated coherent response integrating retrieval, research, and analysis findings.',
    position: { left: '2125px', top: '950px' },
    type: 'processor',
    category: 'synthesis'
  },
  {
    id: 'evaluator-agent',
    label: 'Evaluator Agent',
    content: '✅ EVALUATION: Response for "What is machine learning and how does it work?" scored: Accuracy: 89%, Completeness: 92%, Relevance: 95%. VERDICT: Approved for delivery.',
    position: { left: '2750px', top: '750px' },
    type: 'processor',
    category: 'evaluation'
  },
  {
    id: 'response-delivery',
    label: 'User Response',
    content: '💬 FINAL OUTPUT: Based on your query "What is machine learning and how does it work?", here is the comprehensive response generated through our RAG pipeline with full traceability and citations.',
    position: { left: '3325px', top: '450px' },
    type: 'output',
    category: 'delivery'
  },
  {
    id: 'langsmith-logging',
    label: 'LangSmith Logging',
    content: '📋 LOGGED: Session for "What is machine learning and how does it work?" - 14 agent interactions, 2.3s total latency, 0 errors. Metrics captured for optimization.',
    position: { left: '3950px', top: '450px' },
    type: 'processor',
    category: 'delivery'
  }
];