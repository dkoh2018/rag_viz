'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import DocumentParticles from '@/components/DocumentParticles'
import WhatCanIDo from '@/components/WhatCanIDo'
import styles from '@/styles/visualization.module.css'

export default function HomePage() {
  const [isFaqOpen, setIsFaqOpen] = useState(false)
  
  return (
    <div className="relative w-full h-dvh overflow-hidden bg-gradient-to-br from-[#1a1d23] via-[#21262d] to-[#1a1d23]">
      
      {/* Single Unified Particle Document */}
      <div className="absolute inset-0">
        <DocumentParticles particleCount={6000} />
      </div>
      
      {/* Buttons - Top Left */}
      <div className="absolute top-6 left-6 flex gap-3 z-50">
        {/* Try Demo Button */}
        <Link 
          href="/rag-retrieval-visualization"
          className={`${styles.statusButton} ${styles.tryDemoButton}`}
          aria-label="Try the demo"
        >
          <span>Try Demo</span>
          <svg 
            width="20" 
            height="20" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M13 7l5 5m0 0l-5 5m5-5H6" 
            />
          </svg>
        </Link>

        {/* What Can I Do Button */}
        <button 
          onClick={() => setIsFaqOpen(true)}
          className={`${styles.statusButton} ${styles.resetButton}`}
          aria-label="What can I do?"
        >
          <span>What can I do?</span>
        </button>
      </div>

      {/* What Can I Do */}
      <WhatCanIDo 
        isOpen={isFaqOpen} 
        onClose={() => setIsFaqOpen(false)} 
      />
      
    </div>
  )
}