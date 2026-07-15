import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from '../../App'

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
  vi.stubGlobal('__BUILD_TIME__', 1752480000000)
  vi.stubGlobal('__COMMIT_SHA__', 'abc1234')
  vi.stubGlobal('__COMMIT_SHA_FULL__', 'abc1234deadbeefdeadbeefdeadbeefdeadbeef')
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('App mount point integration', () => {
  it('mounts FooterCommitBadge exactly once, alongside FooterVersionBadge and the header build-time badge [req:7.1]', () => {
    render(<App />)

    const formatted = new Date(1752480000000).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    expect(screen.getAllByText('abc1234')).toHaveLength(1)
    expect(screen.getAllByText('v1.2.3')).toHaveLength(1)
    expect(screen.getAllByText(`built ${formatted}`)).toHaveLength(1)
  })

  it('mounts FooterCommitBadge from no file other than App.tsx or files under footer-commit-badge/ [req:7.2] [req:8.1]', () => {
    const otherFiles = collectTsxFiles(srcDir).filter((file) => {
      const relative = path.relative(srcDir, file)
      return (
        relative !== path.join('App.tsx') &&
        !relative.startsWith(path.join('components', 'footer-commit-badge'))
      )
    })

    const offenders = otherFiles.filter((file) => readFileSync(file, 'utf8').includes('FooterCommitBadge'))
    expect(offenders).toEqual([])
  })

  it('leaves the existing blank-slate markup in App.tsx unchanged [req:7.3]', () => {
    render(<App />)

    expect(screen.getByText('Get started')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /documentation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /connect with us/i })).toBeInTheDocument()
  })

  it('leaves the source of FooterVersionBadge and the header build-time badge unchanged, with no reference to FooterCommitBadge [req:8.4]', () => {
    const footerVersionBadgeSource = readFileSync(
      path.resolve(srcDir, 'components/footer-version-badge/footer-version-badge.tsx'),
      'utf8',
    )
    const headerBuildBadgeSource = readFileSync(
      path.resolve(srcDir, 'components/header-build-badge/header-build-badge.tsx'),
      'utf8',
    )

    expect(footerVersionBadgeSource).not.toMatch(/FooterCommitBadge/)
    expect(headerBuildBadgeSource).not.toMatch(/FooterCommitBadge/)

    render(<App />)

    expect(screen.getByText('v1.2.3')).toBeInTheDocument()
    const formatted = new Date(1752480000000).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    expect(screen.getByText(`built ${formatted}`)).toBeInTheDocument()
  })
})
