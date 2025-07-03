'use client'

import React from 'react'
import Link from 'next/link'

interface WhatCanIDoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WhatCanIDoModal({ isOpen, onClose }: WhatCanIDoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md backdrop-saturate-150"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white/5 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-3xl shadow-2xl shadow-black/50 flex flex-col animate-in zoom-in-95 duration-300 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:opacity-50 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/20 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-200 z-50 backdrop-blur-xl"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden p-8 seamless-scroll relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent mb-2">What can you do here?</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto"></div>
          </div>
          
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02]">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                Watch AI think in real-time
              </h3>
              <p className="text-gray-300/90">Type any research question and see how modern AI systems break down complex queries, search for information, and synthesize responses through multiple specialized agents working together.</p>
            </div>

            <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02]">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                Try different research modes
              </h3>
              <p className="text-gray-300/90">Switch between Exa Labs semantic search, Perplexity advanced reasoning, and local processing to see how different AI tools approach the same problem with unique strengths.</p>
            </div>

            <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02]">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50"></div>
                Explore with sample queries
              </h3>
              <div className="bg-white/5 rounded-xl p-5 border border-white/15 backdrop-blur-sm">
                <p className="text-sm text-gray-400 mb-3 font-medium">Try asking:</p>
                <ul className="text-sm space-y-2 text-gray-300">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white/40"></span>"How do neural networks learn?"</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white/40"></span>"What are the latest developments in quantum computing?"</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white/40"></span>"Compare different approaches to climate change mitigation"</li>
                </ul>
              </div>
            </div>

            <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02]">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-400 shadow-lg shadow-orange-400/50"></div>
                Understand the process
              </h3>
              <p className="text-gray-300/90">Each visualization shows query routing, parallel research, content synthesis, and quality evaluation - the same workflow powering ChatGPT, Claude, and other advanced AI systems.</p>
            </div>
          </div>

          <div className="mt-8 pt-6">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
            <Link
              href="/rag-retrieval-visualization"
              className="block w-full px-6 py-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 hover:from-green-500/30 hover:to-blue-500/30 border border-white/30 hover:border-white/40 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:opacity-50 text-center"
            >
              <span className="relative z-10">Got it, let me try! ✨</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}