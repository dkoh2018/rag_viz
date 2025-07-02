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
      <path d="M 470 825 L 600 825" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 825 700 C 1500 300, 3000 300, 3990 625" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="2407" y="400" className={styles.connectorLabel}>Simple Query</text>
      <path d="M 825 950 L 1000 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="912" y="1050" className={styles.connectorLabel}>Complex Query</text>
      <path d="M 1450 1125 L 1650 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2100 1125 C 2200 1125, 2250 725, 2350 725" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2100 1125 L 2350 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2100 1125 C 2200 1125, 2250 1525, 2350 1525" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2800 725 C 2900 725, 2900 1125, 3000 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2800 1125 L 3000 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 2800 1525 C 2900 1525, 2900 1125, 3000 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 3450 1125 L 3650 1125" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 4100 1125 L 4200 1325" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 4650 1325 L 4750 975" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="4700" y="1165" className={styles.connectorLabel}>Valid</text>
      <path d="M 4440 625 L 4750 950" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 5200 975 L 5400 975" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 5850 975 L 6050 975" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d="M 4425 1450 C 4200 1950, 1800 1950, 1225 1185" stroke="#484f58" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="3100" y="1800" className={styles.connectorLabel}>Needs Refinement</text>
    </svg>
  );
}