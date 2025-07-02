import { ThemeConfig } from '@/types';

export const THEME: ThemeConfig = {
  colors: {
    background: 'linear-gradient(135deg, #1a1d23 0%, #21262d 50%, #1a1d23 100%)',
    nodeBackground: '#161b22',
    nodeBorder: '#30363d',
    nodeText: '#c9d1d9',
    connectorStroke: '#484f58',
    connectorText: '#8b949e'
  },
  dimensions: {
    nodeWidth: 450,
    nodeHeight: 250,
    containerWidth: 7000,
    containerHeight: 2000
  }
};

export const SCROLLBAR_STYLES = {
  width: '6px',
  height: '6px',
  trackBackground: 'transparent',
  thumbBackground: 'rgba(255, 255, 255, 0.1)',
  thumbBackgroundHover: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '3px'
};