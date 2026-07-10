import { useEffect, useRef, useState } from 'react'
import { getImageBlob } from '../lib/db'

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString()
}

// Decodes each stored blob into an object URL for the <img> thumbnail on demand,
// rather than storing a separate thumbnail — simplest option for a personal-size library.
function useThumbnailUrls(images) {
  const [urls, setUrls] = useState({})
  const fetchedIds = useRef(new Set())

  useEffect(() => {
    let cancelled = false
    const currentIds = new Set(images.map((meta) => meta.id))

    images.forEach((meta) => {
      if (fetchedIds.current.has(meta.id)) return
      fetchedIds.current.add(meta.id)
      getImageBlob(meta.id).then((blob) => {
        if (cancelled || !blob) return
        setUrls((prev) => ({ ...prev, [meta.id]: URL.createObjectURL(blob) }))
      })
    })

    setUrls((prev) => {
      let changed = false
      const next = { ...prev }
      for (const id of Object.keys(prev)) {
        if (!currentIds.has(id)) {
          URL.revokeObjectURL(prev[id])
          delete next[id]
          fetchedIds.current.delete(id)
          changed = true
        }
      }
      return changed ? next : prev
    })

    return () => {
      cancelled = true
    }
  }, [images])

  // Revoke everything on unmount.
  useEffect(() => {
    return () => {
      setUrls((prev) => {
        Object.values(prev).forEach((url) => URL.revokeObjectURL(url))
        return prev
      })
    }
  }, [])

  return urls
}

export default function PickerScreen({ images, selectedId, onSelect, onUpload, onDelete, grid, onGridChange }) {
  const thumbnails = useThumbnailUrls(images)

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (file) onUpload(file)
    event.target.value = ''
  }

  return (
    <div className="screen picker-screen">
      <h1>Your Photos</h1>

      <label className="upload-button">
        Add Photo
        <input type="file" accept="image/*" onChange={handleFileChange} hidden />
      </label>

      {images.length === 0 ? (
        <p className="empty-hint">No photos yet. Add one to get started.</p>
      ) : (
        <ul className="image-list">
          {images.map((meta) => (
            <li key={meta.id} className={meta.id === selectedId ? 'selected' : ''}>
              <button type="button" className="image-row" onClick={() => onSelect(meta.id)}>
                <span className="thumb">
                  {thumbnails[meta.id] && <img src={thumbnails[meta.id]} alt="" />}
                </span>
                <span className="image-info">
                  <span className="image-name">{meta.name}</span>
                  <span className="image-date">{formatDate(meta.createdAt)}</span>
                </span>
              </button>
              <button
                type="button"
                className="delete-button"
                onClick={() => onDelete(meta.id)}
                aria-label={`Delete ${meta.name}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid-controls">
        <label>
          <input
            type="checkbox"
            checked={grid.enabled}
            onChange={(event) => onGridChange({ ...grid, enabled: event.target.checked })}
          />
          Show grid overlay
        </label>
        <label>
          Grid columns: {grid.divisions}
          <input
            type="range"
            min="2"
            max="10"
            value={grid.divisions}
            onChange={(event) => onGridChange({ ...grid, divisions: Number(event.target.value) })}
            disabled={!grid.enabled}
          />
        </label>
      </div>

      <p className="swipe-hint">Swipe right to view the image &rarr;</p>
    </div>
  )
}
