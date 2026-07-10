import ProcessedCanvas from '../components/ProcessedCanvas'

export default function ImageScreen({ title, mode, image, grid }) {
  return (
    <div className="screen image-screen" aria-label={title}>
      <ProcessedCanvas image={image} mode={mode} grid={grid} />
    </div>
  )
}
