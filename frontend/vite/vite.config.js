import { defineConfig } from 'vite'

export default defineConfig({
  // Add your framework (e.g., react, vue) if needed
  // Example for React:
  // plugins: [react()],
  css: {
    postcss: './postcss.config.js', // Ensure PostCSS is used
  },
})