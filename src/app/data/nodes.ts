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
    content: '',
    position: { left: '20px', top: '100px' }
  },
  {
    id: 'router-agent',
    label: 'Router Agent',
    content: 'Query Classification: Analyzed input complexity and determined this requires multi-step reasoning. Routing to orchestrator for comprehensive processing rather than direct retrieval.',
    position: { left: '600px', top: '100px' }
  },
  {
    id: 'direct-generation',
    label: 'Direct Generation',
    content: 'Simple Query Path: For straightforward factual queries, this agent retrieves relevant documents and generates immediate responses using basic retrieval-augmented generation.',
    position: { left: '2750px', top: '100px' }
  },
  {
    id: 'orchestrator-agent',
    label: 'Orchestrator Agent',
    content: 'Task Coordination: Decomposing complex query into manageable sub-tasks. Initializing parallel worker agents for retrieval, research analysis, and data processing operations.',
    position: { left: '600px', top: '575px' }
  },
  {
    id: 'decompose-query',
    label: 'Decompose Query',
    content: 'Query Breakdown: Segmenting main question into focused sub-queries:\n• Document retrieval for machine learning definitions\n• Research synthesis for implementation mechanisms\n• Analysis of practical applications and limitations',
    position: { left: '810px', top: '1100px' }
  },
  {
    id: 'worker-retrieval',
    label: 'Worker Agent: Retrieval',
    content: 'Document Retrieval: Vector search completed across knowledge base. Retrieved 15 relevant documents with semantic similarity scores. Primary sources include technical documentation and research papers.',
    position: { left: '1450px', top: '300px' }
  },
  {
    id: 'worker-research',
    label: 'Worker Agent: Research',
    content: 'Research Analysis: Cross-referenced multiple sources to identify key concepts, relationships, and potential knowledge gaps. Analyzed 8 primary sources for consistency and complementary information.',
    position: { left: '1450px', top: '700px' }
  },
  {
    id: 'worker-analysis',
    label: 'Worker Agent: Analysis',
    content: 'Data Analysis: Processed retrieved information to extract key insights and generate confidence metrics. Identified supporting evidence, potential limitations, and areas requiring additional context.',
    position: { left: '1450px', top: '1100px' }
  },
  {
    id: 'shared-state',
    label: 'Shared State',
    content: 'State Management: Aggregating outputs from all worker agents. Consolidating retrieval results, research findings, and analytical insights into unified knowledge representation for synthesis.',
    position: { left: '2125px', top: '500px' }
  },
  {
    id: 'synthesis-agent',
    label: 'Synthesis Agent',
    content: 'Response Synthesis: Combining all worker outputs into coherent, comprehensive response. Integrating retrieved documents, research analysis, and insights while maintaining logical flow and accuracy.',
    position: { left: '2125px', top: '900px' }
  },
  {
    id: 'evaluator-agent',
    label: 'Evaluator Agent',
    content: 'Quality Evaluation: Assessing response quality across multiple dimensions including accuracy, completeness, and relevance. Validation against source materials and coherence checks completed successfully.',
    position: { left: '2750px', top: '700px' }
  },
  {
    id: 'response-delivery',
    label: 'Response Delivery',
    content: 'Response Formatting: Structuring final output with proper citations, confidence indicators, and source attribution. Preparing user-facing response with transparency about information sources and limitations.',
    position: { left: '3325px', top: '400px' }
  },
  {
    id: 'langsmith-logging',
    label: 'LangSmith Logging',
    content: 'Observability Tracking: Recording complete session metadata including agent interactions, processing latency, error rates, and performance metrics for system optimization and debugging.',
    position: { left: '3900px', top: '700px' }
  },
  {
    id: 'user-response',
    label: 'User Response',
    content: 'Final Output: Comprehensive response delivered to user with full traceability through the RAG pipeline. Includes source citations, confidence metrics, and transparent indication of information provenance.',
    position: { left: '3900px', top: '100px' }
  }
];