import { execFileSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json' with { type: 'json' }

function resolveCommitSha(args: string[]) {
  try {
    return execFileSync('git', args, {
      cwd: new URL('.', import.meta.url).pathname,
    })
      .toString()
      .trim()
  } catch {
    return 'whoops'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_TIME__: JSON.stringify(Date.now()),
    __COMMIT_SHA__: JSON.stringify(resolveCommitSha(['rev-parse', '--short', 'HEAD'])),
    __COMMIT_SHA_FULL__: JSON.stringify(resolveCommitSha(['rev-parse', 'HEAD'])),
  },
})
