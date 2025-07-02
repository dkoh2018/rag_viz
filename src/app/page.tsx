'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'

// RAG Pipeline text path for particle effect
const RAG_TEXT_CONFIG = {
  text: 'RAG PIPELINE',
  fontSize: 120,
  fontWeight: 'bold',
  fontFamily: 'Inter, system-ui, sans-serif'
}

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
    }[] = []

    let textImageData: ImageData | null = null

    function createTextImage() {
      if (!ctx || !canvas) return 0

      ctx.fillStyle = 'white'
      ctx.save()
      
      const fontSize = isMobile ? 60 : RAG_TEXT_CONFIG.fontSize
      // Use a web-safe font as fallback
      ctx.font = `${RAG_TEXT_CONFIG.fontWeight} ${fontSize}px Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const x = canvas.width / 2
      const y = canvas.height / 2 - 40
      
      ctx.fillText(RAG_TEXT_CONFIG.text, x, y)
      ctx.restore()

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return fontSize / RAG_TEXT_CONFIG.fontSize
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1.5 + 0.8,
            color: 'white', 
            scatteredColor: '#3b82f6', // Blue scatter effect matching your theme
            life: Math.random() * 100 + 50
          }
        }
      }

      return null
    }

    function createInitialParticles(scale: number) {
      const baseParticleCount = 2000 // Reduced from 6000
      const particleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return
      
      // Dark background matching your theme
      ctx.fillStyle = '#1a1d23'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 200

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && (isTouchingRef.current || !('ontouchstart' in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 50
          const moveY = Math.sin(angle) * force * 50
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY
          
          ctx.fillStyle = p.scatteredColor
        } else {
          p.x += (p.baseX - p.x) * 0.08
          p.y += (p.baseY - p.y) * 0.08
          ctx.fillStyle = '#c9d1d9' // Light gray matching your theme
        }

        ctx.fillRect(p.x, p.y, p.size, p.size)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle(scale)
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      const baseParticleCount = 2000 // Reduced from 6000
      const targetParticleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale)
        if (newParticle) particles.push(newParticle)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    // Initialize mouse position to center
    mousePositionRef.current = { x: canvas.width / 2, y: canvas.height / 2 }
    
    const scale = createTextImage()
    createInitialParticles(scale)
    animate(scale)

    const handleResize = () => {
      updateCanvasSize()
      const newScale = createTextImage()
      particles = []
      createInitialParticles(newScale)
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
      // Debugging - remove this after testing
      console.log('Mouse position:', x, y)
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!('ontouchstart' in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-gradient-to-br from-[#1a1d23] via-[#21262d] to-[#1a1d23]">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full touch-none z-10"
        aria-label="Interactive particle effect with RAG Pipeline text"
      />
      
      {/* Content positioned below particles */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-32 px-6 z-0 pointer-events-none">
        <div className="text-center space-y-8">
          <p className="text-xl md:text-2xl text-white/90 leading-tight font-medium tracking-wide">
            Interactive visualization of multi-agent RAG systems
          </p>

          <Link 
            href="/rag-retrieval-visualization"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white/8 border border-white/15 backdrop-blur-xl text-white font-medium text-lg transition-all duration-300 hover:bg-white/12 hover:border-white/25 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-[0.98] hover:scale-[1.02] pointer-events-auto"
          >
            <span className="tracking-wide">Launch Visualization</span>
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2.5}
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

      {/* Subtle footer */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <p className="text-white/40 text-sm font-light tracking-wider">
          RAG Pipeline Visualizer
        </p>
      </div>
    </div>
  )
}