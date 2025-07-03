import styles from '../styles/visualization.module.css';

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
      <path d="M 480 300 L 590 300" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1060 300 L 2725 300" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="1250" y="280" className={styles.connectorLabel}>Simple Query</text>
      <path d="M 825 500 L 825 610" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="730" y="560" className={styles.connectorLabel}>Complex Query</text>
      <path d="M 825 1000 L 825 1040 L 1035 1040 L 1035 1130" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1280 1260 Q 1330 1260, 1350 910 T 1430 520" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1280 1260 Q 1330 1260, 1350 1090 T 1430 920" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1280 1260 Q 1320 1260, 1430 1320" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1930 520 Q 2000 670 2100 675" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1930 920 L 2100 725" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 1930 1320 Q 2000 1170 2100 775" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2350 900 L 2350 940" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2600 1100 L 2725 940" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 3100 500 Q 3120 500 3300 590" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 3100 730 Q 3120 730 3300 630" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="3180" y="670" className={styles.connectorLabel}>Valid</text>
      <path d="M 3790 620 L 3930 620" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2975 1100 L 2975 1550 L 700 1550 L 700 995" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="2865" y="1175" className={styles.connectorLabel}>Needs Refinement</text>
      <text x="575" y="1050" className={styles.connectorLabel}>Needs Refinement</text>
    </svg>
  );
}