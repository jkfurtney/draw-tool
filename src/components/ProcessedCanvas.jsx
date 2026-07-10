import { useEffect, useRef, useState } from 'react'
import { computeContainRect, drawGrid, applyGreyscale, applyThreeValue } from '../lib/imageProcessing'

export default function ProcessedCanvas({ image, mode, grid }) {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setSize({ w: width, h: height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size.w === 0 || size.h === 0) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size.w * dpr
    canvas.height = size.h * dpr
    canvas.style.width = `${size.w}px`
    canvas.style.height = `${size.h}px`

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size.w, size.h)

    if (!image) return

    const rect = computeContainRect(size.w, size.h, image.width, image.height)
    ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h)

    if (mode !== 'original') {
      // getImageData/putImageData ignore the ctx transform, so convert to device pixels.
      const deviceRect = {
        x: Math.round(rect.x * dpr),
        y: Math.round(rect.y * dpr),
        w: Math.round(rect.w * dpr),
        h: Math.round(rect.h * dpr),
      }
      if (mode === 'greyscale') applyGreyscale(ctx, deviceRect)
      if (mode === 'threevalue') applyThreeValue(ctx, deviceRect)
    }

    if (grid?.enabled) drawGrid(ctx, rect, grid.divisions)
  }, [image, mode, grid, size])

  return (
    <div ref={wrapperRef} className="canvas-wrapper">
      <canvas ref={canvasRef} />
      {!image && <p className="empty-hint">Select a photo on the first screen</p>}
    </div>
  )
}
