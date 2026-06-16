import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/index.ts'),
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload.ts'),
        },
      },
    },
  },
  renderer: {
    root: '.',
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
        },
      },
    },
  },
})
