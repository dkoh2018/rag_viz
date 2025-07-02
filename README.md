# RAG Visualizer

An interactive visualization platform for Retrieval-Augmented Generation (RAG) pipelines that demonstrates multi-agent orchestration, real-time processing flows, and research tool integration.

## Why I Built This

As AI systems become increasingly complex, understanding how RAG pipelines orchestrate multiple agents, route queries, and synthesize information from various sources becomes critical. This visualizer makes the invisible visible - showing how modern RAG systems actually work under the hood.

I wanted to create something that bridges the gap between abstract RAG concepts and their practical implementation, allowing developers, researchers, and stakeholders to see exactly how information flows through these sophisticated systems.

## Features

### 🎯 **Interactive RAG Pipeline Visualization**
- Real-time visualization of multi-agent RAG workflows
- Dynamic node-based architecture showing query routing, research, and synthesis
- Live processing states with visual feedback and loading indicators

### 🔬 **Multi-Modal Research Integration**
- **Exa Labs API** - Semantic web search and content retrieval
- **Perplexity API** - Advanced reasoning and research capabilities  
- **Local Processing** - Custom RAG backend with embedding support
- Switchable research models for different use cases

### 🎨 **Immersive UI/UX**
- Particle-based landing page with interactive "RAG PIPELINE" text
- Glass-morphism design system with modern interactions
- Responsive design optimized for demonstration and exploration

### 🛠 **Technical Architecture**
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI/ML**: LangChain, OpenAI GPT models, ChromaDB for vector storage
- **APIs**: Custom endpoints for RAG processing, embedding, and research
- **State Management**: Custom hooks for visualization state and real-time updates

## Project Structure

```
src/
├── app/
│   ├── api/                    # RAG processing endpoints
│   │   ├── rag/               # Main RAG pipeline API
│   │   ├── embed/             # Embedding generation
│   │   └── test-research/     # Research tool testing
│   ├── components/            # Visualization components
│   │   ├── GenerativeNode.tsx # AI agent nodes
│   │   ├── Connectors.tsx     # Pipeline connections
│   │   └── UserPrompt.tsx     # Input interface
│   └── rag-retrieval-visualization/ # Main demo page
├── components/
│   └── ParticleCanvas.tsx     # Interactive particle system
├── lib/
│   ├── rag-backend-*.ts       # RAG processing logic
│   ├── research-tools.ts      # External API integrations
│   └── rag-simulator.ts       # Demo simulation engine
├── hooks/
│   └── useRAGVisualization.ts # Visualization state management
└── types/
    └── index.ts               # TypeScript definitions
```

## Getting Started

### Prerequisites

```bash
# Required APIs (optional - system works with local fallbacks)
OPENAI_API_KEY=your_openai_key
EXA_API_KEY=your_exa_key  
PERPLEXITY_API_KEY=your_perplexity_key
```

### Installation

```bash
# Clone and install
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the visualization.

### Usage

1. **Landing Page**: Interact with the particle-based RAG PIPELINE text
2. **Try Demo**: Click the demo button to enter the visualization
3. **Enter Query**: Type a research question or complex prompt
4. **Watch Processing**: Observe how the system routes, researches, and synthesizes
5. **Switch Models**: Toggle between Exa, Perplexity, and local processing

## Technical Highlights

### Real-Time RAG Processing
The system demonstrates actual RAG workflows with:
- Query classification and routing logic
- Parallel research agent orchestration  
- Dynamic content synthesis and evaluation
- Streaming responses with abort control

### Research Tool Integration
Built-in support for modern research APIs:
- **Exa Labs**: Semantic search with content extraction
- **Perplexity**: Advanced reasoning and fact-checking
- **Local RAG**: Custom embedding and retrieval pipeline

### Performance Optimizations
- Streaming API responses for real-time feedback
- Optimized particle rendering with exclusion zones
- Efficient state management for complex workflows
- Responsive design with performance monitoring

## Architecture Decisions

**Why Next.js 15?** - Latest React 19 features, optimized bundling, and seamless API routes
**Why LangChain?** - Standardized interfaces for LLM orchestration and tool integration  
**Why Custom Visualization?** - Existing tools don't capture the nuanced flow of modern RAG systems
**Why Multiple Research APIs?** - Demonstrates real-world integration patterns and fallback strategies

## Contributing

This project showcases modern RAG architecture patterns. Areas for extension:
- Additional research tool integrations
- More sophisticated agent orchestration patterns
- Advanced visualization modes (graph view, timeline view)
- Performance analytics and monitoring

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
npm run start
```

The visualization is optimized for demonstration environments and scales well for technical presentations.

---

*Built to demystify RAG systems and showcase the sophistication of modern AI orchestration.*
