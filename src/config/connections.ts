import { ConnectionData } from '@/types';

export const RAG_CONNECTIONS: ConnectionData[] = [
  {
    id: 'user-to-router',
    from: 'user-prompt',
    to: 'router-agent',
    path: 'M 470 825 L 600 825'
  },
  {
    id: 'router-to-direct',
    from: 'router-agent',
    to: 'direct-generation',
    path: 'M 825 700 C 1500 300, 3000 300, 3990 625',
    label: 'Simple Query',
    condition: 'simple'
  },
  {
    id: 'router-to-orchestrator',
    from: 'router-agent',
    to: 'orchestrator-agent',
    path: 'M 825 950 L 1000 1125',
    label: 'Complex Query',
    condition: 'complex'
  },
  {
    id: 'orchestrator-to-decompose',
    from: 'orchestrator-agent',
    to: 'decompose-query',
    path: 'M 1450 1125 L 1650 1125'
  },
  {
    id: 'decompose-to-retrieval',
    from: 'decompose-query',
    to: 'worker-retrieval',
    path: 'M 2100 1125 C 2200 1125, 2250 725, 2350 725'
  },
  {
    id: 'decompose-to-research',
    from: 'decompose-query',
    to: 'worker-research',
    path: 'M 2100 1125 L 2350 1125'
  },
  {
    id: 'decompose-to-analysis',
    from: 'decompose-query',
    to: 'worker-analysis',
    path: 'M 2100 1125 C 2200 1125, 2250 1525, 2350 1525'
  },
  {
    id: 'retrieval-to-shared',
    from: 'worker-retrieval',
    to: 'shared-state',
    path: 'M 2800 725 C 2900 725, 2900 1125, 3000 1125'
  },
  {
    id: 'research-to-shared',
    from: 'worker-research',
    to: 'shared-state',
    path: 'M 2800 1125 L 3000 1125'
  },
  {
    id: 'analysis-to-shared',
    from: 'worker-analysis',
    to: 'shared-state',
    path: 'M 2800 1525 C 2900 1525, 2900 1125, 3000 1125'
  },
  {
    id: 'shared-to-synthesis',
    from: 'shared-state',
    to: 'synthesis-agent',
    path: 'M 3450 1125 L 3650 1125'
  },
  {
    id: 'synthesis-to-evaluator',
    from: 'synthesis-agent',
    to: 'evaluator-agent',
    path: 'M 4100 1125 L 4200 1325'
  },
  {
    id: 'evaluator-to-delivery',
    from: 'evaluator-agent',
    to: 'response-delivery',
    path: 'M 4650 1325 L 4750 975',
    label: 'Valid'
  },
  {
    id: 'direct-to-delivery',
    from: 'direct-generation',
    to: 'response-delivery',
    path: 'M 4440 625 L 4750 950'
  },
  {
    id: 'delivery-to-logging',
    from: 'response-delivery',
    to: 'langsmith-logging',
    path: 'M 5200 975 L 5400 975'
  },
  {
    id: 'evaluator-feedback',
    from: 'evaluator-agent',
    to: 'orchestrator-agent',
    path: 'M 4425 1450 C 4200 1950, 1800 1950, 1225 1185',
    label: 'Needs Refinement'
  }
];