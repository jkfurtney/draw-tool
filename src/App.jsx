import { useEffect, useState } from 'react'
import ScreenContainer from './components/ScreenContainer'
import PickerScreen from './screens/PickerScreen'
import ImageScreen from './screens/ImageScreen'
import { listImages, addImage, getImageBlob, deleteImage } from './lib/db'
import { loadImageBitmap } from './lib/imageProcessing'
import { loadGrid, saveGrid } from './lib/gridSettings'

function App() {
  const [images, setImages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [bitmap, setBitmap] = useState(null)
  const [grid, setGrid] = useState(loadGrid)
  const [error, setError] = useState(null)

  useEffect(() => {
    listImages().then(setImages)
  }, [])

  useEffect(() => {
    saveGrid(grid)
  }, [grid])

  useEffect(() => {
    if (!selectedId) {
      setBitmap(null)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const blob = await getImageBlob(selectedId)
        if (!blob) return
        const bmp = await loadImageBitmap(blob)
        if (!cancelled) setBitmap(bmp)
      } catch (err) {
        console.error('Failed to load image', err)
        if (!cancelled) setError(`Couldn't open that photo: ${err.message || err}`)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [selectedId])

  async function handleUpload(file) {
    try {
      const meta = await addImage(file)
      setImages((prev) => [meta, ...prev])
      setSelectedId(meta.id)
    } catch (err) {
      console.error('Failed to store image', err)
      setError(`Couldn't save that photo: ${err.message || err}`)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteImage(id)
      setImages((prev) => prev.filter((meta) => meta.id !== id))
      if (selectedId === id) setSelectedId(null)
    } catch (err) {
      console.error('Failed to delete image', err)
      setError(`Couldn't delete that photo: ${err.message || err}`)
    }
  }

  return (
    <>
      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="Dismiss">
            &times;
          </button>
        </div>
      )}
      <ScreenContainer>
        <PickerScreen
          images={images}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpload={handleUpload}
          onDelete={handleDelete}
          grid={grid}
          onGridChange={setGrid}
        />
        <ImageScreen title="Original" mode="original" image={bitmap} grid={grid} />
        <ImageScreen title="Greyscale" mode="greyscale" image={bitmap} grid={grid} />
        <ImageScreen title="Three-Value" mode="threevalue" image={bitmap} grid={grid} />
      </ScreenContainer>
    </>
  )
}

export default App
