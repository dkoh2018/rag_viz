'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface WhatCanIDoProps {
  isOpen: boolean
  onClose: () => void
}

export default function WhatCanIDo({ isOpen, onClose }: WhatCanIDoProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Main Container - Glass morphism design matching your system */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white/8 border border-white/25 rounded-2xl backdrop-filter backdrop-blur-[20px] backdrop-saturate-[150%] shadow-[0_20px_40px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.2),0_2px_8px_rgba(255,255,255,0.1)_inset] transition-all duration-300">
        
        <div className="p-8">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-medium text-white/95 tracking-tight mb-4">
              How to Use This RAG Visualizer
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              See exactly how AI systems like ChatGPT and Perplexity work under the hood
            </p>
          </div>
          
          {/* Key Points - Simplified */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <p className="text-white/80 text-center leading-relaxed">
              <span className="text-white/95 font-medium">RAG</span> = Retrieval-Augmented Generation
              <br />
              <span className="text-white/70">AI searches for relevant information first, then generates better answers</span>
            </p>
          </div>

          {/* Steps Section */}
          <div className="space-y-6 mb-10">
            
            {/* Step 1 */}
            <div 
              className={`group transition-all duration-300 ${hoveredStep === 1 ? 'transform scale-[1.02]' : ''}`}
              onMouseEnter={() => setHoveredStep(1)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="flex items-start space-x-4 bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-white/8 transition-all duration-300">
                <div className="flex-shrink-0 w-8 h-8 bg-white/15 border border-white/25 rounded-lg flex items-center justify-center backdrop-blur mt-0.5">
                  <span className="text-white font-medium text-sm">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-white/95 mb-2">Configure Settings</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Choose your AI model and search provider (Perplexity, Exa, or None for direct generation)
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div 
              className={`group transition-all duration-300 ${hoveredStep === 2 ? 'transform scale-[1.02]' : ''}`}
              onMouseEnter={() => setHoveredStep(2)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="flex items-start space-x-4 bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-white/8 transition-all duration-300">
                <div className="flex-shrink-0 w-8 h-8 bg-white/15 border border-white/25 rounded-lg flex items-center justify-center backdrop-blur mt-0.5">
                  <span className="text-white font-medium text-sm">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-white/95 mb-2">Ask Your Question</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Enter any question you'd like to see processed through the RAG pipeline
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div 
              className={`group transition-all duration-300 ${hoveredStep === 3 ? 'transform scale-[1.02]' : ''}`}
              onMouseEnter={() => setHoveredStep(3)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="flex items-start space-x-4 bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-white/8 transition-all duration-300">
                <div className="flex-shrink-0 w-8 h-8 bg-white/15 border border-white/25 rounded-lg flex items-center justify-center backdrop-blur mt-0.5">
                  <span className="text-white font-medium text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-white/95 mb-2">Watch the Process</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    See your query flow through retrieval, processing, and generation in real-time
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <div className="text-center">
            <button
              onClick={() => {
                onClose()
                router.push('/rag-retrieval-visualization')
              }}
              className="px-8 py-3 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-medium rounded-xl transition-all duration-300 backdrop-blur-[20px] backdrop-saturate-[150%] shadow-[0_8px_16px_rgba(0,0,0,0.2),0_2px_8px_rgba(255,255,255,0.1)_inset] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3),0_2px_8px_rgba(255,255,255,0.15)_inset]"
            >
              Got it, take me to the demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
