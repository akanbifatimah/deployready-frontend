import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Live demo URL. Used when VITE_SITE_URL isn't set, so index.html never ships
// a literal %VITE_SITE_URL% in its canonical and share tags.
const DEFAULT_SITE_URL = 'https://deploy-ready.abj.pipeops.app'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (!loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL) {
    process.env.VITE_SITE_URL = DEFAULT_SITE_URL
  }
  return {
    plugins: [react(), tailwindcss()],
  }
})
