# Drawing helper app

The goal in this project is to make a single page web application that runs all on the client side. This will be used on an iPad and will be a PWA. The purpose is to help with making drawings and watercolor paintings from pictures. The page should use browser local storage to keep images the user has uploaded previously and let the user select one of those if there are any.

The app should be based on screens that you can swipe left to right
for. The left most screen should be the picture selection, the next
should be the original image stretched to fit in the page but with the
aspect ratio retained. The next right screen should be a greyscale
images, next right should be a 3 value statement of the same image.
The left most screen should have options for putting a grid on the drawing.

## Tech stack

- Vite + React (plain JS, no TypeScript) — `npm run dev` / `npm run build` / `npm run preview`
- `idb-keyval` for local image storage (IndexedDB, not localStorage — images exceed localStorage's size limits)
- `vite-plugin-pwa` for the manifest + service worker (autoUpdate)
- No backend, no network calls — everything runs and persists client-side

## Structure

- `src/lib/db.js` — IndexedDB access: `addImage`, `listImages`, `getImageBlob`, `deleteImage`
- `src/lib/imageProcessing.js` — canvas pixel ops: `loadImageBitmap` (downscales large photos to avoid iOS canvas size limits), `computeContainRect`, `applyGreyscale`, `applyThreeValue`, `drawGrid`
- `src/components/ScreenContainer.jsx` — horizontal scroll-snap swipe container (`100dvh`, safe-area aware)
- `src/components/ProcessedCanvas.jsx` — shared canvas renderer for the Original/Greyscale/Three-Value screens, driven by a `mode` prop
- `src/screens/PickerScreen.jsx` — leftmost screen: upload, stored-image list, grid toggle + divisions
- `src/screens/ImageScreen.jsx` — wraps `ProcessedCanvas` for the other three screens
- `src/App.jsx` — top-level state (image list, selection, grid settings) and screen order

## iPad/Safari notes

- Canvas ops must account for `getImageData`/`putImageData` ignoring the canvas's device-pixel-ratio transform — pixel-processing rects need to be in device pixels, grid-drawing rects in CSS pixels (see `ProcessedCanvas.jsx`).
- Photos are capped at 2000px on the long edge before hitting canvas, since iOS Safari can silently fail on very large canvases.
- Safari has no `beforeinstallprompt`; users add the PWA to the home screen manually via the Share sheet.
- `apple-touch-icon` and manifest PNG icons (192/512) are still TODO placeholders in `index.html` / `vite.config.js` — replace before relying on the home-screen icon.
