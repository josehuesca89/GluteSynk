import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Use 'plugin-react' here

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/GluteSynk/',
})
