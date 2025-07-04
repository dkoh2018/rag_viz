'use client'
import React from 'react'

interface WhatCanIDoProps {
  isOpen: boolean
  onClose: () => void
}

export default function WhatCanIDo({ isOpen, onClose }: WhatCanIDoProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Main Container */}
      <div className="relative w-full max-w-2xl min-h-[400px] rounded-2xl overflow-hidden transform transition-all duration-300 scale-100"
           style={{
             background: 'rgba(255, 255, 255, 0.05)',
             backdropFilter: 'blur(16px) saturate(150%)',
             border: '1px solid rgba(255, 255, 255, 0.2)',
             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)'
           }}>
        
      </div>
    </div>
  )
}
