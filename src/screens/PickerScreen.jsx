function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString()
}

export default function PickerScreen({ images, selectedId, onSelect, onUpload, onDelete, grid, onGridChange }) {
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
              <button type="button" onClick={() => onSelect(meta.id)}>
                <span className="image-name">{meta.name}</span>
                <span className="image-date">{formatDate(meta.createdAt)}</span>
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
          Divisions: {grid.divisions}
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
