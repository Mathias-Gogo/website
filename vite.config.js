import { defineConfig } from 'vite'
import react from '@vitejs/react-vite'

export default defineConfig({
  base: '/website/',
  plugins: [react()],
  base: '/mexuri-site/', // MUST match your repository name exactly
})