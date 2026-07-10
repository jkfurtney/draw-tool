# Drawing helper app

The goal in this project is to make a single page web application that runs all on the client side. This will be used on an iPad and will be a PWA. The purpose is to help with making drawings and watercolor paintings from pictures. The page should use browser local storage to keep images the user has uploaded previously and let the user select one of those if there are any.

The app should be based on screens that you can swipe left to right
for. The left most screen should be the picture selection, the next
should be the original image stretched to fit in the page but with the
aspect ratio retained. The next right screen should be a greyscale
images, next right should be a 3 value statement of the same image.
The left most screen should have options for putting a grid on the drawing.

## Keeping this file current

Update this file whenever something changes that a future session would need to know but couldn't easily re-derive from the code — new dependencies, deployment/infra changes, non-obvious platform gotchas, changed URLs or account names. Skip anything that's just a normal code change visible in `git log`.

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
- `crypto.randomUUID()` only exists in secure contexts (https, or localhost) — it silently breaks image uploads when testing over a plain-http LAN address on a phone/tablet. `src/lib/db.js` uses a dependency-free ID generator instead; don't reintroduce `crypto.randomUUID()`.

## Deployment

- Repo: public, `github.com/jkfurtney/draw-tool`
- Deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) — builds and deploys on every push to `master`
- Live at **https://jkfurtney.github.io/draw-tool/**
- Pages source is set to build type "GitHub Actions" (one-time repo setting; was set via `gh api repos/jkfurtney/draw-tool/pages -X POST -f build_type=workflow`)
- Vite's `base` in `vite.config.js` is `/draw-tool/` to match the Pages subpath — if the repo is ever renamed, update both this and the Pages settings together
- Since `github.io` is real HTTPS, this deployed URL (not the LAN dev server) is the place to test full PWA install/offline behavior on the iPad
