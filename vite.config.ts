import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // Percorsi relativi nell'output: così dist/index.html si apre anche con
  // un doppio clic (file://), senza bisogno di un server web.
  base: './',
  build: {
    outDir: 'dist',
    // Le immagini restano file separati: una foto da 8 MB non va inlineata.
    assetsInlineLimit: 4096,
    // Quattro pagine: il tabellone (A3), le carte contratto, le carte
    // Imprevisti/Probabilità e le banconote (A4).
    // I percorsi sono relativi alla radice del progetto.
    rollupOptions: {
      input: {
        index: 'index.html',
        contracts: 'contracts.html',
        cards: 'cards.html',
        money: 'money.html',
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
