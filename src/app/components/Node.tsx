import { NodeData } from '../data/nodes';
import styles from '../visualization.module.css';

interface NodeProps {
  node: NodeData;
}

export default function Node({ node }: NodeProps) {
  const isWorkerAgent = node.id.includes('worker-');
  const nodeClasses = `${styles.node} ${isWorkerAgent ? styles.nodeWorkerAgent : ''}`;
  
  return (
    <div 
      className={nodeClasses}
      data-node-id={node.id}
      style={{ 
        left: node.position.left, 
        top: node.position.top,
        ...(isWorkerAgent && { width: '787px' })
      }}
    >
      <div className={styles.nodeLabel}>{node.label}</div>
      <div className={styles.nodeContent}>{node.content}</div>
    </div>
  );
}