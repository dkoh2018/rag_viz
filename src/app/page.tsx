import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            RAG Visualization Suite
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Explore advanced Retrieval-Augmented Generation systems through interactive visualizations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 max-w-2xl mx-auto">
          <Link 
            href="/rag-retrieval-visualization"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3">
                RAG Pipeline Visualization
              </h3>
              <p className="text-blue-100 mb-4">
                Watch intelligent agents collaborate in real-time as they process complex queries through retrieval, research, and synthesis
              </p>
              <div className="flex items-center text-white font-medium">
                Launch Visualization
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-400/20 to-blue-400/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>

        <div className="mt-12 text-gray-400">
          <p className="text-sm">
            Built with Next.js • Powered by advanced AI agents
          </p>
        </div>
      </div>
    </div>
  );
}