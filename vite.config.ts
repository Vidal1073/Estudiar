import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // 1. AFEGIM EL BASE: Substitueix 'EL-TEU-REPO' pel nom real del teu repositori a GitHub
    // Si la teva URL és usuari.github.io/meu-quiz/, posa '/meu-quiz/'
    base: './', 

    plugins: [react(), tailwindcss()],
    
    define: {
      // Això permet que el codi accedeixi a process.env.GEMINI_API_KEY
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.APP_URL': JSON.stringify(env.APP_URL),
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      // Assegurem que el build sigui compatible amb la majoria de navegadors
      outDir: 'dist',
      assetsDir: 'assets',
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
