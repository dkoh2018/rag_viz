import styles from './visualization.module.css';

export default function RAGVisualization() {
  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        <div className={styles.diagramContainer}>
          {/* SVG Layer for Connectors */}
          <svg className={styles.connectorSvg}>
            <defs>
              <marker 
                id="arrow" 
                viewBox="0 0 10 10" 
                refX="8" 
                refY="5"
                markerWidth="6" 
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#484f58" />
              </marker>
            </defs>

            {/* Connector paths */}
            <path d="M 470 825 L 600 825" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 825 700 C 1500 300, 3000 300, 3990 625" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <text x="2407" y="400" className={styles.connectorLabel}>Simple Query</text>
            <path d="M 825 950 L 1000 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <text x="912" y="1050" className={styles.connectorLabel}>Complex Query</text>
            <path d="M 1450 1125 L 1650 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 2100 1125 C 2200 1125, 2250 725, 2350 725" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 2100 1125 L 2350 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 2100 1125 C 2200 1125, 2250 1525, 2350 1525" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 2800 725 C 2900 725, 2900 1125, 3000 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 2800 1125 L 3000 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 2800 1525 C 2900 1525, 2900 1125, 3000 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 3450 1125 L 3650 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 4100 1125 L 4200 1325" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 4650 1325 L 4750 975" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <text x="4700" y="1165" className={styles.connectorLabel}>Valid</text>
            <path d="M 4440 625 L 4750 950" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 5200 975 L 5400 975" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 5850 975 L 6050 975" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <path d="M 4425 1450 C 4200 1950, 1800 1950, 1225 1185" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <text x="3100" y="1800" className={styles.connectorLabel}>Needs Refinement</text>
          </svg>

          {/* Process Nodes */}
          <div className={styles.node} style={{ left: '20px', top: '700px' }}>
            <div className={styles.nodeLabel}>User Prompt</div>
            <div className={styles.nodeContent}>Initial user query that starts the RAG process. This can be a simple question requiring direct retrieval or a complex multi-step query that needs decomposition and orchestration across multiple specialized agents.</div>
          </div>
          
          <div className={styles.node} style={{ left: '600px', top: '700px' }}>
            <div className={styles.nodeLabel}>Router Agent</div>
            <div className={styles.nodeContent}>Analyzes incoming queries to determine processing path. Routes simple queries directly to generation while complex queries are sent to the orchestrator for decomposition and multi-agent coordination.</div>
          </div>

          <div className={styles.node} style={{ left: '4000px', top: '500px' }}>
            <div className={styles.nodeLabel}>Direct Generation</div>
            <div className={styles.nodeContent}>Handles straightforward queries that can be answered with simple retrieval and generation. Bypasses complex orchestration for efficiency when dealing with basic information requests.</div>
          </div>

          <div className={styles.node} style={{ left: '1000px', top: '1000px' }}>
            <div className={styles.nodeLabel}>Orchestrator Agent</div>
            <div className={styles.nodeContent}>Manages complex query workflows by coordinating multiple worker agents. Handles task distribution, monitors progress, and ensures all sub-tasks are completed before synthesis begins.</div>
          </div>

          <div className={styles.node} style={{ left: '1650px', top: '1000px' }}>
            <div className={styles.nodeLabel}>Decompose Query</div>
            <div className={styles.nodeContent}>Breaks down complex queries into smaller, manageable sub-tasks. Each sub-task is assigned to appropriate worker agents based on the type of processing required (retrieval, research, analysis).</div>
          </div>

          <div className={styles.node} style={{ left: '2350px', top: '600px' }}>
            <div className={styles.nodeLabel}>Worker Agent: Retrieval</div>
            <div className={styles.nodeContent}>Specialized in retrieving relevant documents and information from knowledge bases. Uses semantic search and vector similarity to find the most relevant context for the given query.</div>
          </div>
          
          <div className={styles.node} style={{ left: '2350px', top: '1000px' }}>
            <div className={styles.nodeLabel}>Worker Agent: Research</div>
            <div className={styles.nodeContent}>Conducts deeper research tasks that require multiple sources and cross-referencing. Handles complex information gathering that goes beyond simple document retrieval.</div>
          </div>
          
          <div className={styles.node} style={{ left: '2350px', top: '1400px' }}>
            <div className={styles.nodeLabel}>Worker Agent: Analysis</div>
            <div className={styles.nodeContent}>Performs analytical tasks such as data interpretation, comparison, and reasoning. Processes retrieved information to extract insights and patterns relevant to the query.</div>
          </div>

          <div className={styles.node} style={{ left: '3000px', top: '1000px' }}>
            <div className={styles.nodeLabel}>Shared State</div>
            <div className={styles.nodeContent}>Central coordination point where all worker agents contribute their findings. Maintains consistency across the distributed processing and provides a unified view of all gathered information.</div>
          </div>

          <div className={styles.node} style={{ left: '3650px', top: '1000px' }}>
            <div className={styles.nodeLabel}>Synthesis Agent</div>
            <div className={styles.nodeContent}>Combines information from all worker agents into a coherent response. Handles deduplication, conflict resolution, and ensures the final response addresses all aspects of the original query.</div>
          </div>

          <div className={styles.node} style={{ left: '4200px', top: '1200px' }}>
            <div className={styles.nodeLabel}>Evaluator Agent</div>
            <div className={styles.nodeContent}>Assesses the quality and completeness of the synthesized response. Checks for accuracy, relevance, and completeness. May trigger refinement loops if the response doesn't meet quality thresholds.</div>
          </div>
          
          <div className={styles.node} style={{ left: '4750px', top: '850px' }}>
            <div className={styles.nodeLabel}>Response Delivery</div>
            <div className={styles.nodeContent}>Final stage that formats and delivers the response to the user. Handles response formatting, citation management, and ensures the response is presented in the most appropriate format.</div>
          </div>
          
          <div className={styles.node} style={{ left: '5400px', top: '850px' }}>
            <div className={styles.nodeLabel}>LangSmith Logging</div>
            <div className={styles.nodeContent}>Comprehensive logging and monitoring system that tracks all agent interactions, performance metrics, and system behavior. Provides observability for debugging and optimization.</div>
          </div>
          
          <div className={styles.node} style={{ left: '6050px', top: '850px' }}>
            <div className={styles.nodeLabel}>User Response</div>
            <div className={styles.nodeContent}>Final response delivered to the user, incorporating all the processing, synthesis, and evaluation steps. Represents the culmination of the entire RAG workflow with comprehensive and accurate information.</div>
          </div>
        </div>
      </div>
    </div>
  );
}