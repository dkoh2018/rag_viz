'use client'

import React, { useRef, useEffect, useState } from 'react'

interface ParticleCanvasProps {
  text: string
  fontSize?: number
  fontWeight?: string
  fontFamily?: string
  particleCount?: number
  scatterColor?: string
  backgroundColor?: string
  particleColor?: string
  className?: string
  disabled?: boolean
  exclusionZones?: { x: number; y: number; width: number; height: number }[]
}

export default function ParticleCanvas({
  text,
  fontSize = 120,
  fontWeight = 'bold',
  fontFamily = 'Arial, sans-serif',
  particleCount = 2000,
  scatterColor = 'white',
  backgroundColor = '#1a1d23',
  particleColor = '#c9d1d9',
  className = '',
  disabled = false,
  exclusionZones = []
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const animationFrameIdRef = useRef<number>()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      setIsMobile(rect.width < 768)
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
      
      const currentFontSize = isMobile ? Math.min(fontSize * 0.5, 40) : fontSize
      ctx.font = `${fontWeight} ${currentFontSize}px ${fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const x = canvas.width / 2
      const y = canvas.height / 2
      
      ctx.fillText(text, x, y)
      ctx.restore()

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return currentFontSize / fontSize
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
            color: particleColor, 
            scatteredColor: scatterColor,
            life: Math.random() * 100 + 50
          }
        }
      }

      return null
    }

    function createInitialParticles(scale: number) {
      const targetParticleCount = Math.floor(particleCount * Math.sqrt((canvas.width * canvas.height) / (400 * 300)))
      for (let i = 0; i < targetParticleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    function animate(scale: number) {
      if (!ctx || !canvas) return
      
      // Properly clear canvas for transparent backgrounds
      if (backgroundColor === 'transparent') {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      if (disabled) {
        // Just draw static particles when disabled
        for (const p of particles) {
          ctx.fillStyle = particleColor
          ctx.fillRect(p.baseX, p.baseY, p.size, p.size)
        }
        animationFrameIdRef.current = requestAnimationFrame(() => animate(scale))
        return
      }

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 150
      const mouseInExclusionZone = isMouseInExclusionZone(mouseX, mouseY)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Skip particle scattering if mouse is in exclusion zone
        if (!mouseInExclusionZone && distance < maxDistance && (isTouchingRef.current || !('ontouchstart' in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 40
          const moveY = Math.sin(angle) * force * 40
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY
          
          ctx.fillStyle = p.scatteredColor
        } else {
          p.x += (p.baseX - p.x) * 0.08
          p.y += (p.baseY - p.y) * 0.08
          ctx.fillStyle = particleColor
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

      // Maintain particle count
      const targetParticleCount = Math.floor(particleCount * Math.sqrt((canvas.width * canvas.height) / (400 * 300)))
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale)
        if (newParticle) particles.push(newParticle)
      }

      animationFrameIdRef.current = requestAnimationFrame(() => animate(scale))
    }

    // Helper function to check if mouse is in exclusion zone
    function isMouseInExclusionZone(mouseX: number, mouseY: number): boolean {
      return exclusionZones.some(zone => 
        mouseX >= zone.x && 
        mouseX <= zone.x + zone.width && 
        mouseY >= zone.y && 
        mouseY <= zone.y + zone.height
      )
    }

    // Initialize
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
      if (disabled) return
      const rect = canvas.getBoundingClientRect()
      mousePositionRef.current = { 
        x: x - rect.left, 
        y: y - rect.top 
      }
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
      if (!disabled) isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: canvas.width / 2, y: canvas.height / 2 }
    }

    const handleMouseLeave = () => {
      if (!('ontouchstart' in window)) {
        mousePositionRef.current = { x: canvas.width / 2, y: canvas.height / 2 }
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
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [text, fontSize, fontWeight, fontFamily, particleCount, scatterColor, backgroundColor, particleColor, disabled, isMobile, exclusionZones])

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full ${disabled ? 'pointer-events-none' : 'touch-none'} ${className}`}
      aria-label={`Interactive particle effect with ${text}`}
    />
  )
}