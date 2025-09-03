'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Sun, Moon } from 'lucide-react'

interface DiagramThemeSelectorProps {
  selected: 'light' | 'dark'
  onChange: (theme: 'light' | 'dark') => void
  disabled?: boolean
  lightAvailable: boolean
  darkAvailable: boolean
}

export function DiagramThemeSelector({ 
  selected, 
  onChange, 
  disabled = false,
  lightAvailable,
  darkAvailable
}: DiagramThemeSelectorProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange('light')}
        disabled={disabled || !lightAvailable}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
          "flex items-center justify-center gap-2 min-w-[90px]",
          !lightAvailable && "opacity-50 cursor-not-allowed",
          selected === 'light' && lightAvailable
            ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
            : "bg-background border-border hover:bg-accent hover:text-accent-foreground hover:border-primary/50"
        )}
        title={!lightAvailable ? "Light theme not available" : "Switch to light theme"}
      >
        <Sun className="h-4 w-4" />
        Light
      </button>
      
      <button
        onClick={() => onChange('dark')}
        disabled={disabled || !darkAvailable}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
          "flex items-center justify-center gap-2 min-w-[90px]",
          !darkAvailable && "opacity-50 cursor-not-allowed",
          selected === 'dark' && darkAvailable
            ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
            : "bg-background border-border hover:bg-accent hover:text-accent-foreground hover:border-primary/50"
        )}
        title={!darkAvailable ? "Dark theme not available" : "Switch to dark theme"}
      >
        <Moon className="h-4 w-4" />
        Dark
      </button>
    </div>
  )
}
