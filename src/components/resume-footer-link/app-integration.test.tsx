import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
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

afterEach(() => {
  cleanup()
})

describe('App mount point integration', () => {
  it('mounts ResumeFooterLink exactly once, alongside the other footer and header mounts [req:5.1]', () => {
    render(<App />)

    expect(screen.getAllByRole('link', { name: 'Resume' })).toHaveLength(1)
  })

  it('leaves the existing blank-slate markup in App.tsx unchanged [req:5.2]', () => {
    render(<App />)

    expect(screen.getByText('Get started')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /documentation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /connect with us/i })).toBeInTheDocument()
  })

  it('mounts ResumeFooterLink from no file other than src/App.tsx [req:5.3]', () => {
    const otherFiles = collectTsxFiles(srcDir).filter((file) => {
      const relative = path.relative(srcDir, file)
      return relative !== path.join('App.tsx') && !relative.startsWith(path.join('components', 'resume-footer-link'))
    })

    const offenders = otherFiles.filter((file) => readFileSync(file, 'utf8').includes('ResumeFooterLink'))
    expect(offenders).toEqual([])
  })

  it("renders the resume link on the app's single page view, matching the sibling-feature integration convention [req:6.3]", () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'Resume' })).toBeInTheDocument()
  })
})
