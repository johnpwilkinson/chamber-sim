export type CommandCategory = 'navigation' | 'quick-action' | 'search'

export interface CommandItem {
  id: string
  label: string
  category: CommandCategory
  keywords?: string[]
  onSelect: () => void
}

export const navigationCommands: CommandItem[] = []
export const quickActionCommands: CommandItem[] = []
export const searchCommands: CommandItem[] = []
