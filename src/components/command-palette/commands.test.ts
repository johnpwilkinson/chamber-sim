import { describe, expect, it } from 'vitest'
import type { CommandCategory, CommandItem } from './commands'
import * as commandsModule from './commands'
import { navigationCommands, quickActionCommands, searchCommands } from './commands'

describe('commands.ts static command data', () => {
  it('exports navigationCommands, quickActionCommands, searchCommands as empty arrays [req:3.2]', () => {
    expect(Array.isArray(navigationCommands)).toBe(true)
    expect(Array.isArray(quickActionCommands)).toBe(true)
    expect(Array.isArray(searchCommands)).toBe(true)
    expect(navigationCommands).toEqual([])
    expect(quickActionCommands).toEqual([])
    expect(searchCommands).toEqual([])
  })

  it('does not populate any category array with real entries [req:3.4]', () => {
    expect(navigationCommands.length).toBe(0)
    expect(quickActionCommands.length).toBe(0)
    expect(searchCommands.length).toBe(0)
  })

  it('declares a CommandItem shape with id, label, category, optional keywords, and onSelect [req:3.1]', () => {
    const withKeywords: CommandItem = {
      id: 'example',
      label: 'Example',
      category: 'navigation',
      keywords: ['example', 'demo'],
      onSelect: () => {},
    }
    const withoutKeywords: CommandItem = {
      id: 'example-2',
      label: 'Example 2',
      category: 'quick-action',
      onSelect: () => {},
    }
    const categories: CommandCategory[] = ['navigation', 'quick-action', 'search']

    expect(withKeywords.id).toBe('example')
    expect(withoutKeywords.keywords).toBeUndefined()
    expect(categories).toEqual(['navigation', 'quick-action', 'search'])
  })

  it('exposes no runtime registration API beyond the three static arrays [req:3.3]', () => {
    const runtimeExportNames = Object.keys(commandsModule).sort()
    expect(runtimeExportNames).toEqual(
      ['navigationCommands', 'quickActionCommands', 'searchCommands'].sort(),
    )
  })
})
