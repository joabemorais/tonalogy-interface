'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ThemeSelectorProps {
  selected: 'light' | 'dark'
  onChange: (theme: 'light' | 'dark') => void
  disabled?: boolean
}

export function ThemeSelector({ selected, onChange, disabled = false }: ThemeSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('light')}
        disabled={disabled}
        className={cn(
          "px-3 py-2 text-sm rounded-md transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          selected === 'light'
            ? "bg-primary text-primary-foreground"
            : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
        )}
      >
        Light
      </button>
      <button
        onClick={() => onChange('dark')}
        disabled={disabled}
        className={cn(
          "px-3 py-2 text-sm rounded-md transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          selected === 'dark'
            ? "bg-primary text-primary-foreground"
            : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
        )}
      >
        Dark
      </button>
    </div>
  )
}
