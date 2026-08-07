import { defineConfig } from 'vite';

export default defineConfig({
  // Percorsi relativi nell'output: così dist/index.html si apre anche con
  // un doppio clic (file://), senza bisogno di un server web.
  base: './',
  build: {
    outDir: 'dist',
    // Le immagini restano file separati: una foto da 8 MB non va inlineata.
    assetsInlineLimit: 4096,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
});
