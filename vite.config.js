import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 確保在 GitHub Pages 子路徑也能正常存取
  plugins: [react()],
})
