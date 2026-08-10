import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import viteConfig from './vite.config'

// Build-time globals come FROM vite.config — single source of truth. Duplicating
// them here is the drift that broke App-mount tests twice (__APP_VERSION__ 2026-07-13,
// __BUILD_TIME__ 2026-07-14): a define added for the build silently missing in tests.
const define = (viteConfig as { define?: Record<string, string> }).define

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
  define,
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    // `test/**/*.test.mjs` is additive, for chamber fixture specs that place plain
    // Node utilities under src/util/ with their tests in a top-level test/ dir.
    // Without it those files are silently uncollected and `--passWithNoTests`
    // turns the mech gate green having run nothing.
    include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.mjs'],
  },
})
