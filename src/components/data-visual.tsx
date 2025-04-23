"use client"

import { useEffect, useRef } from "react"

export default function DataVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Data points
    const dataPoints: { x: number; y: number; size: number; speed: number }[] = []
    const numPoints = 100

    for (let i = 0; i < numPoints; i++) {
      dataPoints.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
      })
    }

    // Lines connecting points
    const connections: { from: number; to: number; opacity: number }[] = []
    const numConnections = 50

    for (let i = 0; i < numConnections; i++) {
      connections.push({
        from: Math.floor(Math.random() * numPoints),
        to: Math.floor(Math.random() * numPoints),
        opacity: Math.random() * 0.2 + 0.1,
      })
    }

    // Animation
    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      connections.forEach((conn) => {
        const from = dataPoints[conn.from]
        const to = dataPoints[conn.to]

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = `rgba(251, 80, 40, ${conn.opacity})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Draw points
      dataPoints.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(251, 80, 40, 0.8)"
        ctx.fill()

        // Move points
        point.y += point.speed
        if (point.y > canvas.height) {
          point.y = 0
          point.x = Math.random() * canvas.width
        }
      })

      // Add occasional data text
      if (Math.random() > 0.97) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        ctx.font = "10px monospace"
        ctx.fillStyle = "rgba(251, 80, 40, 0.7)"
        ctx.fillText(`${Math.floor(Math.random() * 1000)}`, x, y)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
