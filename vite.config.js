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
      includeAssets: ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Sketch Reference Tool',
        short_name: 'SketchRef',
        description: 'Turn photos into greyscale and value-study references for drawing and painting.',
        display: 'standalone',
        orientation: 'any',
        background_color: '#1a1a1a',
        theme_color: '#1a1a1a',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
    }),
  ],
})
