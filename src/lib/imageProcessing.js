// iOS Safari can choke on very large canvases, so downscale on load.
const MAX_DIMENSION = 2000

export async function loadImageBitmap(blob, maxDim = MAX_DIMENSION) {
  const bitmap = await createImageBitmap(blob)
  if (bitmap.width <= maxDim && bitmap.height <= maxDim) return bitmap

  const scale = maxDim / Math.max(bitmap.width, bitmap.height)
  const resized = await createImageBitmap(bitmap, {
    resizeWidth: Math.round(bitmap.width * scale),
    resizeHeight: Math.round(bitmap.height * scale),
    resizeQuality: 'high',
  })
  bitmap.close()
  return resized
}

export function computeContainRect(containerW, containerH, imgW, imgH) {
  const scale = Math.min(containerW / imgW, containerH / imgH)
  const w = imgW * scale
  const h = imgH * scale
  return { x: (containerW - w) / 2, y: (containerH - h) / 2, w, h }
}

// rect must be in device-pixel coordinates (canvas transform is ignored by getImageData/putImageData).
export function applyGreyscale(ctx, rect) {
  const { x, y, w, h } = rect
  const imgData = ctx.getImageData(x, y, w, h)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const luma = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
    d[i] = d[i + 1] = d[i + 2] = luma
  }
  ctx.putImageData(imgData, x, y)
}

export function applyThreeValue(ctx, rect, thresholds = [85, 170]) {
  const { x, y, w, h } = rect
  const imgData = ctx.getImageData(x, y, w, h)
  const d = imgData.data
  const [lo, hi] = thresholds
  for (let i = 0; i < d.length; i += 4) {
    const luma = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
    const value = luma < lo ? 0 : luma < hi ? 128 : 255
    d[i] = d[i + 1] = d[i + 2] = value
  }
  ctx.putImageData(imgData, x, y)
}

// rect here is in CSS-pixel coordinates (drawn through the canvas's dpr transform).
// `divisions` sets the column count; cells are square, so rows fall out of
// that cell size and the bottom row may be partial if it doesn't divide evenly.
export function drawGrid(ctx, rect, divisions) {
  if (!divisions || divisions < 2) return
  ctx.save()
  ctx.strokeStyle = 'rgba(255, 60, 60, 0.7)'
  ctx.lineWidth = 1

  const cellSize = rect.w / divisions

  for (let i = 1; i < divisions; i++) {
    const x = rect.x + cellSize * i
    ctx.beginPath()
    ctx.moveTo(x, rect.y)
    ctx.lineTo(x, rect.y + rect.h)
    ctx.stroke()
  }

  for (let y = rect.y + cellSize; y < rect.y + rect.h; y += cellSize) {
    ctx.beginPath()
    ctx.moveTo(rect.x, y)
    ctx.lineTo(rect.x + rect.w, y)
    ctx.stroke()
  }

  ctx.restore()
}
