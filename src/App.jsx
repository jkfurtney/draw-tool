import { useEffect, useState } from 'react'
import ScreenContainer from './components/ScreenContainer'
import PickerScreen from './screens/PickerScreen'
import ImageScreen from './screens/ImageScreen'
import { listImages, addImage, getImageBlob, deleteImage } from './lib/db'
import { loadImageBitmap } from './lib/imageProcessing'

function App() {
  const [images, setImages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [bitmap, setBitmap] = useState(null)
  const [grid, setGrid] = useState({ enabled: false, divisions: 4 })

  useEffect(() => {
    listImages().then(setImages)
  }, [])

  useEffect(() => {
    if (!selectedId) {
      setBitmap(null)
      return
    }
    let cancelled = false
    getImageBlob(selectedId).then(async (blob) => {
      if (!blob) return
      const bmp = await loadImageBitmap(blob)
      if (!cancelled) setBitmap(bmp)
    })
    return () => {
      cancelled = true
    }
  }, [selectedId])

  async function handleUpload(file) {
    const meta = await addImage(file)
    setImages((prev) => [meta, ...prev])
    setSelectedId(meta.id)
  }

  async function handleDelete(id) {
    await deleteImage(id)
    setImages((prev) => prev.filter((meta) => meta.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  return (
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
  )
}

export default App
