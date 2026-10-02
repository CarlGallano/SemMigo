import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

// Vite config — https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from a sub-path (e.g. /SemMigo/); the
  // deploy workflow sets PAGES_BASE_PATH for the production build.
  base: process.env.PAGES_BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT || "5173"),
    strictPort: true,
  },
})
