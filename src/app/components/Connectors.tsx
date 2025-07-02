import styles from '../visualization.module.css';

export default function Connectors() {
  return (
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
      <path d="M 480 250 L 590 250" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1000 250 C 2000 200, 3000 200, 4130 250" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="1265" y="220" className={styles.connectorLabel}>Simple Query</text>
      <path d="M 825 450 L 825 470 L 1200 470 L 1230 470" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="1025" y="490" className={styles.connectorLabel}>Complex Query</text>
      <path d="M 1730 470 L 1870 470 L 1870 685" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2110 850 Q 2200 850, 2200 660 Q 2200 450, 2325 450" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2110 850 L 2325 850" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2110 850 Q 2200 850, 2200 1040 Q 2200 1250, 2325 1250" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2810 470 Q 2900 470, 2900 660 Q 2900 850, 2990 825" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2810 850 L 2990 850" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2810 1250 Q 2900 1250, 2900 1040 Q 2900 850, 2990 875" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 3460 850 L 3560 850" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 4035 850 L 4140 850" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 4380 450 L 4380 450 L 4680 565 L 4980 450" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 4380 680 L 4380 680 L 4680 565 L 4980 450" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="4480" y="620" className={styles.connectorLabel}>Valid</text>
      <path d="M 5210 250 L 5340 250" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 5810 250 L 5940 250" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 4380 1050 L 4380 1500 L 1475 1500 L 1475 665" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="4280" y="1250" className={styles.connectorLabel}>Needs Refinement</text>
      <text x="1360" y="875" className={styles.connectorLabel}>Needs Refinement</text>
    </svg>
  );
}