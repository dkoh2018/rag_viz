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
    content: 'Initial user query that starts the RAG process. This can be a simple question requiring direct retrieval or a complex multi-step query that needs decomposition and orchestration across multiple specialized agents.',
    position: { left: '20px', top: '700px' }
  },
  {
    id: 'router-agent',
    label: 'Router Agent',
    content: 'Analyzes incoming queries to determine processing path. Routes simple queries directly to generation while complex queries are sent to the orchestrator for decomposition and multi-agent coordination.',
    position: { left: '600px', top: '700px' }
  },
  {
    id: 'direct-generation',
    label: 'Direct Generation',
    content: 'Handles straightforward queries that can be answered with simple retrieval and generation. Bypasses complex orchestration for efficiency when dealing with basic information requests.',
    position: { left: '4000px', top: '500px' }
  },
  {
    id: 'orchestrator-agent',
    label: 'Orchestrator Agent',
    content: 'Manages complex query workflows by coordinating multiple worker agents. Handles task distribution, monitors progress, and ensures all sub-tasks are completed before synthesis begins.',
    position: { left: '1000px', top: '1000px' }
  },
  {
    id: 'decompose-query',
    label: 'Decompose Query',
    content: 'Breaks down complex queries into smaller, manageable sub-tasks. Each sub-task is assigned to appropriate worker agents based on the type of processing required (retrieval, research, analysis).',
    position: { left: '1650px', top: '1000px' }
  },
  {
    id: 'worker-retrieval',
    label: 'Worker Agent: Retrieval',
    content: 'Specialized in retrieving relevant documents and information from knowledge bases. Uses semantic search and vector similarity to find the most relevant context for the given query.',
    position: { left: '2350px', top: '600px' }
  },
  {
    id: 'worker-research',
    label: 'Worker Agent: Research',
    content: 'Conducts deeper research tasks that require multiple sources and cross-referencing. Handles complex information gathering that goes beyond simple document retrieval.',
    position: { left: '2350px', top: '1000px' }
  },
  {
    id: 'worker-analysis',
    label: 'Worker Agent: Analysis',
    content: 'Performs analytical tasks such as data interpretation, comparison, and reasoning. Processes retrieved information to extract insights and patterns relevant to the query.',
    position: { left: '2350px', top: '1400px' }
  },
  {
    id: 'shared-state',
    label: 'Shared State',
    content: 'Central coordination point where all worker agents contribute their findings. Maintains consistency across the distributed processing and provides a unified view of all gathered information.',
    position: { left: '3000px', top: '1000px' }
  },
  {
    id: 'synthesis-agent',
    label: 'Synthesis Agent',
    content: 'Combines information from all worker agents into a coherent response. Handles deduplication, conflict resolution, and ensures the final response addresses all aspects of the original query.',
    position: { left: '3650px', top: '1000px' }
  },
  {
    id: 'evaluator-agent',
    label: 'Evaluator Agent',
    content: 'Assesses the quality and completeness of the synthesized response. Checks for accuracy, relevance, and completeness. May trigger refinement loops if the response doesn\'t meet quality thresholds.',
    position: { left: '4200px', top: '1200px' }
  },
  {
    id: 'response-delivery',
    label: 'Response Delivery',
    content: 'Final stage that formats and delivers the response to the user. Handles response formatting, citation management, and ensures the response is presented in the most appropriate format.',
    position: { left: '4750px', top: '850px' }
  },
  {
    id: 'langsmith-logging',
    label: 'LangSmith Logging',
    content: 'Comprehensive logging and monitoring system that tracks all agent interactions, performance metrics, and system behavior. Provides observability for debugging and optimization.',
    position: { left: '5400px', top: '850px' }
  },
  {
    id: 'user-response',
    label: 'User Response',
    content: 'Final response delivered to the user, incorporating all the processing, synthesis, and evaluation steps. Represents the culmination of the entire RAG workflow with comprehensive and accurate information.',
    position: { left: '6050px', top: '850px' }
  }
];