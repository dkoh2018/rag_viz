'use client'

import React from 'react'
import Link from 'next/link'
import ParticleCanvas from '@/components/ParticleCanvas'

export default function HomePage() {
  return (
    <div className="relative w-full h-dvh overflow-hidden bg-gradient-to-br from-[#1a1d23] via-[#21262d] to-[#1a1d23]">
      
      {/* Particle Effect */}
      <div className="absolute inset-0">
        <ParticleCanvas
          text="RAG PIPELINE"
          fontSize={120}
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          particleCount={4000}
          scatterColor="white"
          backgroundColor="transparent"
          particleColor="#c9d1d9"
        />
      </div>
      
      {/* Demo Button - Top Left */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <Link 
          href="/rag-retrieval-visualization"
          className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/40 border border-white/10 text-white/90 font-medium text-sm tracking-tight transition-all duration-200 ease-out hover:bg-black/60 hover:border-white/20 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 backdrop-blur-md pointer-events-auto"
          aria-label="Try the demo"
        >
          <span>Try Demo</span>
          <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center transition-all duration-200 group-hover:bg-white/30 group-hover:translate-x-0.5">
            <svg 
              className="w-2.5 h-2.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={3}
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </div>
        </Link>
      </div>
      
    </div>
  )
}