import { NodeData } from '../data/nodes';
import styles from '../visualization.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GenerativeNodeProps {
  node: NodeData;
  generatedContent?: string;
  isLoading?: boolean;
  isActiveProcessing?: boolean;
  isPipelineComplete?: boolean;
  showReadyGlow?: boolean;
}

export default function GenerativeNode({ node, generatedContent, isLoading = false, isActiveProcessing = false, isPipelineComplete = false, showReadyGlow = false }: GenerativeNodeProps) {
  // Determine node styling class based on state
  const getNodeClass = () => {
    let classes = styles.node;
    if (showReadyGlow) {
      classes += ` ${styles.nodeReadyStart}`;
    } else if (isPipelineComplete) {
      classes += ` ${styles.nodeCompletionGlow}`;
    } else if (isActiveProcessing) {
      classes += ` ${styles.nodeActiveProcessing}`;
    } else if (isLoading) {
      classes += ` ${styles.nodeWaitingLoading}`;
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
        {isPipelineComplete && <span style={{ marginLeft: '8px', color: '#f59e0b' }}>✨ Complete!</span>}
        {isActiveProcessing && !isPipelineComplete && <span style={{ marginLeft: '8px', color: '#3b82f6' }}>🔥 Processing...</span>}
        {isLoading && !isActiveProcessing && !isPipelineComplete && <span style={{ marginLeft: '8px', color: '#9ca3af' }}>⏳ Loading...</span>}
      </div>
      <div className={styles.generativeContainer}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingDots}>
              <div className={styles.loadingDot}></div>
              <div className={styles.loadingDot}></div>
              <div className={styles.loadingDot}></div>
            </div>
          </div>
        ) : (
          <div className={styles.markdownContainer}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
            >
              {generatedContent || node.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}