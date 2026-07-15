import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import viteConfig from '../../../vite.config'

const define = (viteConfig as { define?: Record<string, string> }).define ?? {}
const viteConfigSourcePath = path.resolve(process.cwd(), 'vite.config.ts')
const viteConfigSource = readFileSync(viteConfigSourcePath, 'utf8')

describe('vite.config define block: commit sha resolution', () => {
  it('resolves __COMMIT_SHA__ to a JSON.stringify-wrapped trimmed sha [req:1.1] [req:1.4] [req:1.8]', () => {
    expect(define).toHaveProperty('__COMMIT_SHA__')
    expect(define.__COMMIT_SHA__).toMatch(/^"[^"\s]+"$/)
  })

  it('resolves __COMMIT_SHA_FULL__ to a JSON.stringify-wrapped trimmed sha [req:1.2] [req:1.4] [req:1.8]', () => {
    expect(define).toHaveProperty('__COMMIT_SHA_FULL__')
    expect(define.__COMMIT_SHA_FULL__).toMatch(/^"[^"\s]+"$/)
  })

  it('leaves the existing __APP_VERSION__/__BUILD_TIME__ entries untouched [req:1.8]', () => {
    expect(define.__APP_VERSION__).toBeDefined()
    expect(define.__BUILD_TIME__).toBeDefined()
    expect(define.__BUILD_TIME__).toMatch(/^\d+$/)
  })

  it('uses execFileSync with an array-args form, never a shell string [req:1.3]', () => {
    expect(viteConfigSource).toMatch(/execFileSync\(\s*['"]git['"]\s*,\s*args/)
    expect(viteConfigSource).not.toMatch(/execSync\(/)
  })

  it('does not depend on any CI-only environment variable to resolve either sha [req:1.9]', () => {
    expect(viteConfigSource).not.toMatch(/process\.env\.(GITHUB_SHA|CI_COMMIT_SHA|VERCEL_GIT_COMMIT_SHA|COMMIT_SHA)/)
  })

  it('resolves both globals exactly once with no runtime fetch or client-side re-resolution [req:1.7]', () => {
    const resolveCallCount = (viteConfigSource.match(/resolveCommitSha\(\[/g) ?? []).length
    expect(resolveCallCount).toBe(2)
    expect(viteConfigSource).not.toMatch(/fetch\(/)
    expect(viteConfigSource).not.toMatch(/version\.json/)
  })

  describe('independent fallback per global', () => {
    afterEach(() => {
      vi.doUnmock('node:child_process')
      vi.resetModules()
    })

    it('falls back __COMMIT_SHA__ to "whoops" on a throw while __COMMIT_SHA_FULL__ keeps its resolved value [req:1.5] [req:1.6] [req:1.7]', async () => {
      vi.resetModules()
      const execFileSync = vi.fn((_cmd: string, args: string[]) => {
        if (args.includes('--short')) {
          throw new Error('git not found')
        }
        return Buffer.from('deadbeefdeadbeefdeadbeefdeadbeefdeadbeef\n')
      })
      vi.doMock('node:child_process', () => ({ execFileSync, default: { execFileSync } }))

      const reimported = (await import('../../../vite.config')).default as {
        define?: Record<string, string>
      }

      expect(reimported.define?.__COMMIT_SHA__).toBe(JSON.stringify('whoops'))
      expect(reimported.define?.__COMMIT_SHA_FULL__).toBe(JSON.stringify('deadbeefdeadbeefdeadbeefdeadbeefdeadbeef'))
    })

    it('falls back __COMMIT_SHA_FULL__ to "whoops" on a throw while __COMMIT_SHA__ keeps its resolved value [req:1.5] [req:1.6] [req:1.7]', async () => {
      vi.resetModules()
      const execFileSync = vi.fn((_cmd: string, args: string[]) => {
        if (args.includes('--short')) {
          return Buffer.from('deadbee\n')
        }
        throw new Error('git not found')
      })
      vi.doMock('node:child_process', () => ({ execFileSync, default: { execFileSync } }))

      const reimported = (await import('../../../vite.config')).default as {
        define?: Record<string, string>
      }

      expect(reimported.define?.__COMMIT_SHA__).toBe(JSON.stringify('deadbee'))
      expect(reimported.define?.__COMMIT_SHA_FULL__).toBe(JSON.stringify('whoops'))
    })

    it('resolves each global exactly once even when mocked [req:1.7]', async () => {
      vi.resetModules()
      const execFileSync = vi.fn((_cmd: string, args: string[]) =>
        args.includes('--short') ? Buffer.from('abc1234\n') : Buffer.from('abc1234full\n'),
      )
      vi.doMock('node:child_process', () => ({ execFileSync, default: { execFileSync } }))

      await import('../../../vite.config')

      expect(execFileSync).toHaveBeenCalledTimes(2)
    })
  })
})
