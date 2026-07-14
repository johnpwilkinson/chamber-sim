import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from '../../App'

const BUILD_TIME = 1752480000000

const srcDir = path.resolve(process.cwd(), 'src')

function collectTsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return collectTsxFiles(entryPath)
    return entry.isFile() && entry.name.endsWith('.tsx') ? [entryPath] : []
  })
}

beforeEach(() => {
  vi.stubGlobal('__APP_VERSION__', '1.2.3')
  vi.stubGlobal('__BUILD_TIME__', BUILD_TIME)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('App mount point integration', () => {
  it('mounts HeaderBuildBadge exactly once, alongside FooterVersionBadge [req:8.1]', () => {
    render(<App />)

    const formatted = new Date(BUILD_TIME).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    expect(screen.getAllByText(`built ${formatted}`)).toHaveLength(1)
    expect(screen.getAllByText('v1.2.3')).toHaveLength(1)
  })

  it('mounts HeaderBuildBadge from no file other than src/App.tsx [req:8.3]', () => {
    const otherFiles = collectTsxFiles(srcDir).filter((file) => {
      const relative = path.relative(srcDir, file)
      return relative !== path.join('App.tsx') && !relative.startsWith(path.join('components', 'header-build-badge'))
    })

    const offenders = otherFiles.filter((file) => readFileSync(file, 'utf8').includes('HeaderBuildBadge'))
    expect(offenders).toEqual([])
  })

  it('leaves the existing blank-slate markup in App.tsx unchanged [req:8.2]', () => {
    render(<App />)

    expect(screen.getByText('Get started')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /documentation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /connect with us/i })).toBeInTheDocument()
  })

  it("renders the badge on the app's single page view [req:8.4]", () => {
    render(<App />)

    const formatted = new Date(BUILD_TIME).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    expect(screen.getByText(`built ${formatted}`)).toBeInTheDocument()
  })
})
