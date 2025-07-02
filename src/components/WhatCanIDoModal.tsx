'use client'

import React from 'react'

interface WhatCanIDoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WhatCanIDoModal({ isOpen, onClose }: WhatCanIDoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 z-10"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden p-8 seamless-scroll">
          <h2 className="text-2xl font-semibold text-white mb-6">What can you do here?</h2>
          
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Watch AI think in real-time</h3>
              <p>Type any research question and see how modern AI systems break down complex queries, search for information, and synthesize responses through multiple specialized agents working together.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">Try different research modes</h3>
              <p>Switch between Exa Labs semantic search, Perplexity advanced reasoning, and local processing to see how different AI tools approach the same problem with unique strengths.</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">Explore with sample queries</h3>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Try asking:</p>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>"How do neural networks learn?"</li>
                  <li>"What are the latest developments in quantum computing?"</li>
                  <li>"Compare different approaches to climate change mitigation"</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">Understand the process</h3>
              <p>Each visualization shows query routing, parallel research, content synthesis, and quality evaluation - the same workflow powering ChatGPT, Claude, and other advanced AI systems.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              Got it, let me try
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}