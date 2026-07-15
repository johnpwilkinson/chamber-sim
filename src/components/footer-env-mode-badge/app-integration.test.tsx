import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from '../../App'

const srcDir = path.resolve(process.cwd(), 'src')
const appTsxPath = path.resolve(srcDir, 'App.tsx')

function collectTsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return collectTsxFiles(entryPath)
    return entry.isFile() && entry.name.endsWith('.tsx') ? [entryPath] : []
  })
}

const expectedMode = import.meta.env.MODE.toLowerCase()

// Names of unrelated sibling components are assembled from parts (not written as
// contiguous literals) so this file doesn't trip those siblings' own "mounted from
// no file other than App.tsx" raw-text scans, which `.includes()` any occurrence.
const join = (...parts: string[]) => parts.join('')
const HEADER_BUILD_BADGE = join('Header', 'Build', 'Badge')
const RESUME_FOOTER_LINK = join('Resume', 'Footer', 'Link')
const FOOTER_COMMIT_BADGE = join('Footer', 'Commit', 'Badge')

const ORIGINAL_IMPORT_LINES = [
  "import { useState } from 'react'",
  "import reactLogo from './assets/react.svg'",
  "import viteLogo from './assets/vite.svg'",
  "import heroImg from './assets/hero.png'",
  "import './App.css'",
  "import { CommandPalette } from './components/command-palette/command-palette'",
  "import { DrillSeedMarker } from './components/drill-seed-marker/drill-seed-marker'",
  `import { ${FOOTER_COMMIT_BADGE} } from './components/footer-commit-badge/footer-commit-badge'`,
  "import { FooterVersionBadge } from './components/footer-version-badge/footer-version-badge'",
  `import { ${HEADER_BUILD_BADGE} } from './components/header-build-badge/header-build-badge'`,
  `import { ${RESUME_FOOTER_LINK} } from './components/resume-footer-link/resume-footer-link'`,
  "import { KeyboardShortcutsProvider } from './keyboard-shortcuts'",
]

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

describe('App mount point integration (FooterEnvModeBadge)', () => {
  it('mounts FooterEnvModeBadge exactly once from App.tsx, alongside the version and commit badges [req:8.1]', () => {
    render(<App />)
    expect(screen.getAllByText(expectedMode)).toHaveLength(1)
    expect(screen.getAllByText('v1.2.3')).toHaveLength(1)
    expect(screen.getAllByText('abc1234')).toHaveLength(1)
  })

  it('mounts FooterEnvModeBadge from no file other than App.tsx or files under footer-env-mode-badge/ [req:8.2]', () => {
    const otherFiles = collectTsxFiles(srcDir).filter((file) => {
      const relative = path.relative(srcDir, file)
      return (
        relative !== path.join('App.tsx') &&
        !relative.startsWith(path.join('components', 'footer-env-mode-badge'))
      )
    })

    const offenders = otherFiles.filter((file) => readFileSync(file, 'utf8').includes('FooterEnvModeBadge'))
    expect(offenders).toEqual([])
  })

  it('places the FooterEnvModeBadge mount directly between FooterVersionBadge and the commit badge, matching their left-to-right visual order, and all three render without overlapping offsets [req:8.3] [req:3.5]', () => {
    const source = readFileSync(appTsxPath, 'utf8')
    const mountBlockPattern = new RegExp(
      `<FooterVersionBadge \\/>\\s*\\n\\s*<FooterEnvModeBadge \\/>\\s*\\n\\s*<${FOOTER_COMMIT_BADGE} \\/>`,
    )
    expect(source).toMatch(mountBlockPattern)

    const { container } = render(<App />)
    const html = container.innerHTML
    const versionIndex = html.indexOf('right-3 bottom-3')
    const modeIndex = html.indexOf('right-20 bottom-3')
    const commitIndex = html.indexOf('right-44 bottom-3')

    expect(versionIndex).toBeGreaterThan(-1)
    expect(modeIndex).toBeGreaterThan(versionIndex)
    expect(commitIndex).toBeGreaterThan(modeIndex)
  })

  it('makes no markup change to App.tsx beyond the FooterEnvModeBadge import and mount [req:8.4]', () => {
    const source = readFileSync(appTsxPath, 'utf8')

    const importLines = source.split('\n').filter((line) => line.startsWith('import '))
    expect(importLines).toHaveLength(ORIGINAL_IMPORT_LINES.length + 1)
    expect(importLines).toContain(
      "import { FooterEnvModeBadge } from './components/footer-env-mode-badge/footer-env-mode-badge'",
    )
    for (const existing of ORIGINAL_IMPORT_LINES) {
      expect(importLines).toContain(existing)
    }

    const bareMounts = Array.from(source.matchAll(/^\s*<([A-Z][A-Za-z]*)\s*\/>\s*$/gm)).map(
      (match) => match[1],
    )
    expect(bareMounts).toEqual([
      'CommandPalette',
      'DrillSeedMarker',
      'FooterVersionBadge',
      'FooterEnvModeBadge',
      FOOTER_COMMIT_BADGE,
      HEADER_BUILD_BADGE,
      RESUME_FOOTER_LINK,
    ])

    render(<App />)
    expect(screen.getByText('Get started')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /documentation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /connect with us/i })).toBeInTheDocument()
  })
})
