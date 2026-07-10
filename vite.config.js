import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://jkfurtney.github.io/draw-tool/, a subpath rather than
  // the domain root, so asset/manifest URLs need this prefix.
  base: '/draw-tool/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sketch Reference Tool',
        short_name: 'SketchRef',
        description: 'Turn photos into greyscale and value-study references for drawing and painting.',
        display: 'standalone',
        orientation: 'any',
        background_color: '#1a1a1a',
        theme_color: '#1a1a1a',
        icons: [
          // TODO: replace with real 192x192 and 512x512 PNGs before shipping/installing —
          // Chrome/Android need raster icons for installability, iOS home screen ignores
          // this manifest entirely and uses the apple-touch-icon link tag instead.
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
})
