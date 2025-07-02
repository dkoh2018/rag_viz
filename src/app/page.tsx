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
      
      {/* Launch Button - Top Left */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <Link 
          href="/rag-retrieval-visualization"
          className="group relative inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-lg backdrop-blur-[20px] text-white font-medium text-sm tracking-wide transition-all duration-150 ease-out shadow-[0_4px_12px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.25)_inset] border border-white/18 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.3)_inset] focus:outline-none focus:ring-2 focus:ring-blue-400/80 focus:ring-offset-2 focus:ring-offset-transparent active:translate-y-0 active:scale-[0.97] active:shadow-[0_2px_8px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.2)_inset] pointer-events-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)'
          }}
          aria-label="Launch visualization"
        >
          <span>Launch Visualization</span>
          <svg 
            className="w-4 h-4 opacity-80 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M13 7l5 5m0 0l-5 5m5-5H6" 
            />
          </svg>
        </Link>
      </div>
      
    </div>
  )
}