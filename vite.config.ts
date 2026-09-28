import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { mockCheckoutApi } from './mock-api.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockCheckoutApi()],
})
