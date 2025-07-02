import { NodeData } from '../data/nodes';
import styles from '../visualization.module.css';

interface GenerativeNodeProps {
  node: NodeData;
  generatedContent?: string;
}

export default function GenerativeNode({ node, generatedContent }: GenerativeNodeProps) {
  return (
    <div 
      className={styles.node} 
      style={{ 
        left: node.position.left, 
        top: node.position.top 
      }}
    >
      <div className={styles.nodeLabel}>{node.label}</div>
      <div className={styles.generativeContainer}>
        <textarea
          className={styles.generativeOutput}
          value={generatedContent || node.content}
          readOnly
          rows={4}
        />
      </div>
    </div>
  );
}