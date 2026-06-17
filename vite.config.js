//File name: vite.config.js
//Author: Kyle McColgan
//Date: 16 June 2026
//Description: This file contains the Vite configuration for the timer React project.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/react-timer/',
  plugins: [react()],
  define: {
    'process.env': {}, // Prevents SSR-related undefined issues
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
