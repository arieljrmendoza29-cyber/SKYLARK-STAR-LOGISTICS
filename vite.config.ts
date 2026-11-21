import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// "/" for a custom domain or Node server; "/<repo>/" for a github.io project page.
// The GitHub Pages workflow sets this automatically.
const base = process.env.VITE_BASE_PATH?.trim() || '/';

export default defineConfig({
  base: base.endsWith('/') ? base : `${base}/`,
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'motion/react', 'lucide-react'],
  },
  build: {
    // The lazily loaded 3D tour chunk (three.js) is ~530 kB; it never blocks the first page load.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        // Keep large, rarely-changing libraries in their own cacheable chunks.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined;
          // three.js is loaded on demand for the 3D services tour; keep it out of the startup bundle.
          if (/[\\/]three[\\/]/.test(id)) return undefined;
          if (/[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
          if (/[\\/](gsap|lenis|motion|framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return 'animation';
          return 'vendor';
        },
      },
    },
  },
});
