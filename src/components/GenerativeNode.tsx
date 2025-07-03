import { NodeData } from '@/types';
import styles from '../styles/visualization.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMemo } from 'react';

interface GenerativeNodeProps {
  node: NodeData;
  generatedContent?: string;
  isLoading?: boolean;
  isActiveProcessing?: boolean;
  isPipelineComplete?: boolean;
  showReadyGlow?: boolean;
  isSimultaneousWorking?: boolean;
}

export default function GenerativeNode({ node, generatedContent, isLoading = false, isActiveProcessing = false, isPipelineComplete = false, showReadyGlow = false, isSimultaneousWorking = false }: GenerativeNodeProps) {
  // Determine node styling class based on state
  const getNodeClass = () => {
    let classes = styles.node;
    if (showReadyGlow) {
      classes += ` ${styles.nodeReadyStart}`;
    } else if (isPipelineComplete) {
      classes += ` ${styles.nodeCompletionGlow}`;
    } else if (isSimultaneousWorking) {
      classes += ` ${styles.nodeSimultaneousWorking}`;
    } else if (isActiveProcessing) {
      classes += ` ${styles.nodeActiveProcessing}`;
    } else if (isLoading) {
      classes += ` ${styles.nodeWaitingLoading}`;
    }
    return classes;
  };

  // Dual badge router agent display logic
  const routerDisplayInfo = useMemo(() => {
    if (node.id !== 'router-agent') return null;
    
    const hasGeneratedContent = generatedContent && generatedContent !== node.content;
    const content = generatedContent || '';
    const lowerContent = content.toLowerCase();
    
    if (!hasGeneratedContent) {
      // Show both badges when no processing has happened yet
      return {
        showBoth: true,
        badges: [
          { type: 'Simple Query', className: styles.routerQueryTypeSimple, icon: '⚡' },
          { type: 'Complex Query', className: styles.routerQueryTypeComplex, icon: '🔍' }
        ]
      };
    }
    
    // Show only the relevant badge after processing
    if (lowerContent.includes('simple')) {
      return { 
        showBoth: false,
        activeBadge: { type: 'Simple Query', className: styles.routerQueryTypeSimple, icon: '⚡' }
      };
    } else if (lowerContent.includes('complex')) {
      return { 
        showBoth: false,
        activeBadge: { type: 'Complex Query', className: styles.routerQueryTypeComplex, icon: '🔍' }
      };
    }
    
    return null;
  }, [node.id, node.content, generatedContent]);

  return (
    <div
      className={getNodeClass()}
      style={{
        left: node.position.left,
        top: node.position.top,
        position: 'absolute' // Ensure position is absolute
      }}
    >
      {/* Dual badge router agent display */}
      {routerDisplayInfo && (
        <div className={styles.routerOverlay}>
          {routerDisplayInfo.showBoth && routerDisplayInfo.badges ? (
            // Show both badges initially
            <div className={styles.routerDualBadges}>
              {routerDisplayInfo.badges.map((badge, index) => (
                <div key={index} className={`${styles.routerBadge} ${badge.className} ${styles.routerBadgeInitial}`}>
                  <span className={styles.routerIcon}>{badge.icon}</span>
                  <span className={styles.routerType}>{badge.type}</span>
                </div>
              ))}
            </div>
          ) : routerDisplayInfo.activeBadge ? (
            // Show only the active badge after processing
            <div className={`${styles.routerBadge} ${routerDisplayInfo.activeBadge.className} ${styles.routerBadgeActive}`}>
              <span className={styles.routerIcon}>{routerDisplayInfo.activeBadge.icon}</span>
              <span className={styles.routerType}>{routerDisplayInfo.activeBadge.type}</span>
            </div>
          ) : null}
        </div>
      )}
      <div className={styles.nodeLabel}>
        {node.label}
        {isPipelineComplete && <span style={{ marginLeft: '8px', color: '#f59e0b' }}>✨ Complete!</span>}
        {isSimultaneousWorking && !isPipelineComplete && <span style={{ marginLeft: '8px', color: '#f59e0b' }}>🔥 Working...</span>}
        {isActiveProcessing && !isPipelineComplete && !isSimultaneousWorking && <span style={{ marginLeft: '8px', color: '#3b82f6' }}>🔥 Processing...</span>}
        {isLoading && !isActiveProcessing && !isPipelineComplete && !isSimultaneousWorking && <span style={{ marginLeft: '8px', color: '#9ca3af' }}>⏳ Loading...</span>}
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
            {node.id === 'router-agent' && routerDisplayInfo && !routerDisplayInfo.showBoth ? (
              // For router agent, show only clean status when decision is made
              <div className={styles.routerStatus}>
              </div>
            ) : (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
              >
                {generatedContent || node.content}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}