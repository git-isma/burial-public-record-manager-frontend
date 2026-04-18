import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Generate timestamp for versioned builds
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const buildDir = `dist-${timestamp}`;

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: buildDir,
    }
});
