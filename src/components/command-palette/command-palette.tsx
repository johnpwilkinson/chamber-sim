import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { navigationCommands, quickActionCommands, searchCommands } from './commands'

export function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isToggleKey = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)
      if (!isToggleKey) return

      event.preventDefault()
      setOpen((previousOpen) => !previousOpen)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationCommands.map((command) => (
            <CommandItem key={command.id} onSelect={command.onSelect}>
              {command.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Quick actions">
          {quickActionCommands.map((command) => (
            <CommandItem key={command.id} onSelect={command.onSelect}>
              {command.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Search">
          {searchCommands.map((command) => (
            <CommandItem key={command.id} onSelect={command.onSelect}>
              {command.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
