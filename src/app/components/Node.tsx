import { NodeData } from '../data/nodes';
import styles from '../visualization.module.css';

interface NodeProps {
  node: NodeData;
}

export default function Node({ node }: NodeProps) {
  return (
    <div 
      className={styles.node} 
      style={{ 
        left: node.position.left, 
        top: node.position.top 
      }}
    >
      <div className={styles.nodeLabel}>{node.label}</div>
      <div className={styles.nodeContent}>{node.content}</div>
    </div>
  );
}