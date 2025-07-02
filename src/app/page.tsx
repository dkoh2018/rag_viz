import styles from './visualization.module.css';
import { nodes } from './data/nodes';
import Node from './components/Node';
import UserPrompt from './components/UserPrompt';
import Connectors from './components/Connectors';

export default function RAGVisualization() {
  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        <div className={styles.diagramContainer}>
          {/* SVG Layer for Connectors */}
          <Connectors />

          {/* Process Nodes */}
          {nodes.map((node) => (
            node.id === 'user-prompt' ? (
              <UserPrompt key={node.id} node={node} />
            ) : (
              <Node key={node.id} node={node} />
            )
          ))}
        </div>
      </div>
    </div>
  );
}