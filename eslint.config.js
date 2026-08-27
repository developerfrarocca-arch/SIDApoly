import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierCompat from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      // Le pagine esportano componenti insieme a costanti (es. FOOTER_SIGNATURE):
      // allowConstantExport evita di segnalarlo come rottura dell'HMR.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // configs.flat.* e' la variante in formato flat config; configs['recommended-latest']
  // e' ancora in formato eslintrc e ESLint 10 la rifiuta.
  reactHooks.configs.flat['recommended-latest'],

  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Regola del React Compiler, che questo progetto non usa (React 18, nessun
      // plugin del compiler in vite.config.ts). Segnala come errore il pattern
      // corretto di leggere un ref dentro useCallback tenendo [ref] fra le
      // dipendenze: adeguarsi romperebbe la stabilita' di identita' di refit,
      // su cui contano removeEventListener e il ResizeObserver in useZoom.
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },

  // File di configurazione: girano in Node, non nel browser.
  {
    files: ['*.config.{ts,js}', 'vite.config.ts'],
    languageOptions: { globals: globals.node },
  },

  // Va per ultimo: disattiva le regole che litigherebbero con Prettier.
  prettierCompat,
);
