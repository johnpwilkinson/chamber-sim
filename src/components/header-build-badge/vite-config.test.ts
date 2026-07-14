import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import pkg from '../../../package.json' with { type: 'json' }
import viteConfig from '../../../vite.config'

const define = (viteConfig as { define?: Record<string, string> }).define ?? {}
const viteConfigSourcePath = path.resolve(process.cwd(), 'vite.config.ts')
const viteConfigSource = readFileSync(viteConfigSourcePath, 'utf8')

describe('vite.config define block', () => {
  it('adds __BUILD_TIME__ to the define block as an unquoted numeric literal [req:1.1] [req:1.3]', () => {
    expect(define).toHaveProperty('__BUILD_TIME__')
    expect(define.__BUILD_TIME__).toMatch(/^\d+$/)
  })

  it('leaves the existing __APP_VERSION__ entry unmodified [req:1.2]', () => {
    expect(define.__APP_VERSION__).toBe(JSON.stringify(pkg.version))
  })

  it('captures the build timestamp exactly once with no runtime clock reads or intervals [req:1.4] [req:1.5]', () => {
    const dateNowOccurrences = viteConfigSource.match(/Date\.now\(\)/g) ?? []
    expect(dateNowOccurrences).toHaveLength(1)
    expect(viteConfigSource).not.toMatch(/setInterval/)
  })
})
