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
    <div className="flex gap-3">
      <button
        onClick={() => onChange('light')}
        disabled={disabled}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
          "flex items-center justify-center min-w-[80px]",
          selected === 'light'
            ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
            : "bg-background border-border hover:bg-accent hover:text-accent-foreground hover:border-primary/50"
        )}
      >
        Light
      </button>
      <button
        onClick={() => onChange('dark')}
        disabled={disabled}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
          "flex items-center justify-center min-w-[80px]",
          selected === 'dark'
            ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
            : "bg-background border-border hover:bg-accent hover:text-accent-foreground hover:border-primary/50"
        )}
      >
        Dark
      </button>
    </div>
  )
}
