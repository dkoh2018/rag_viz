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
      <path d="M 1000 250 L 2830 250" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="1265" y="220" className={styles.connectorLabel}>Simple Query</text>
      <path d="M 825 450 L 825 560" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="730" y="510" className={styles.connectorLabel}>Complex Query</text>
      <path d="M 825 950 L 825 990 L 1035 990 L 1035 1080" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1280 1210 Q 1330 1210, 1350 860 T 1430 470" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1280 1210 Q 1330 1210, 1350 1040 T 1430 870" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1280 1210 Q 1320 1210, 1430 1270" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1930 470 Q 2000 620 2100 625" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1930 870 L 2100 675" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1930 1270 Q 2000 1120 2100 725" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2350 850 L 2350 890" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2600 1050 L 2725 890" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 3100 450 Q 3120 450 3300 540" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 3100 680 Q 3120 680 3300 580" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="3180" y="620" className={styles.connectorLabel}>Valid</text>
      <path d="M 3700 750 L 3875 875" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 4125 690 L 4125 450" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2975 1050 L 2975 1500 L 700 1500 L 700 965" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="2865" y="1125" className={styles.connectorLabel}>Needs Refinement</text>
      <text x="575" y="1000" className={styles.connectorLabel}>Needs Refinement</text>
    </svg>
  );
}