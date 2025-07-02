import { NodeData } from '../data/nodes';
import styles from '../visualization.module.css';

interface GenerativeNodeProps {
  node: NodeData;
  generatedContent?: string;
  isLoading?: boolean;
}

export default function GenerativeNode({ node, generatedContent, isLoading = false }: GenerativeNodeProps) {
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
        {isLoading && <span style={{ marginLeft: '8px', color: '#9ca3af' }}>⏳ Loading...</span>}
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
          <textarea
            className={styles.generativeOutput}
            value={generatedContent || node.content}
            readOnly
            rows={4}
          />
        )}
      </div>
    </div>
  );
}