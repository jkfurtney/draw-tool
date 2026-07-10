# Sketch Reference Tool

A single-page, client-side web app for turning photos into drawing/painting references: greyscale and three-value (light/mid/dark) versions of an image, with an optional grid overlay for grid-method transfer. Built as a PWA for use on an iPad.

Photos are stored locally in the browser (IndexedDB) — nothing is uploaded to a server.

Swipe between screens:

1. **Photos** — pick a stored photo or upload a new one; grid overlay controls live here
2. **Original** — the photo, fit to screen
3. **Greyscale**
4. **Three-Value**

## Stack

- Vite + React (plain JS)
- `idb-keyval` for local image storage
- `vite-plugin-pwa` for the manifest + service worker

## Development

```
npm install
npm run dev
```

See `CLAUDE.md` for architecture notes and known iOS/Safari quirks.
