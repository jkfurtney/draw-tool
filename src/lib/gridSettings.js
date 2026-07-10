const STORAGE_KEY = 'grid-settings'
const DEFAULT_GRID = { enabled: true, divisions: 5 }

export function loadGrid() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_GRID
    const parsed = JSON.parse(raw)
    return {
      enabled: Boolean(parsed.enabled),
      divisions: Number(parsed.divisions) || DEFAULT_GRID.divisions,
    }
  } catch {
    return DEFAULT_GRID
  }
}

export function saveGrid(grid) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid))
  } catch {
    // ignore write failures (e.g. private browsing storage restrictions)
  }
}
