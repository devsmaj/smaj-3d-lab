import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ base: '/smaj-3d-lab/', plugins: [react(), tailwindcss()] })
