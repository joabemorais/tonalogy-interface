'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Sun, Moon, Smartphone } from 'lucide-react'
import { useTheme } from 'next-themes'

interface DiagramThemeSelectorProps {
  selected: 'light' | 'dark'
  onChange: (theme: 'light' | 'dark') => void
  disabled?: boolean
  lightAvailable: boolean
  darkAvailable: boolean
  followSystemTheme: boolean
  onToggleFollowSystem: () => void
}

export function DiagramThemeSelector({ 
  selected, 
  onChange, 
  disabled = false,
  lightAvailable,
  darkAvailable,
  followSystemTheme,
  onToggleFollowSystem
}: DiagramThemeSelectorProps) {
  const { theme: systemTheme } = useTheme()
  
  // Determine the effective theme when following system
  const effectiveTheme = followSystemTheme 
    ? (systemTheme === 'dark' ? 'dark' : 'light')
    : selected

  return (
    <div className="space-y-3">
      {/* System sync toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Diagram Theme</span>
        <button
          onClick={onToggleFollowSystem}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-all duration-200",
            "border border-border hover:border-primary/50",
            followSystemTheme 
              ? "bg-primary/10 text-primary border-primary/50" 
              : "bg-background text-muted-foreground hover:text-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Smartphone className="h-3 w-3" />
          {followSystemTheme ? 'Following system' : 'Custom selection'}
        </button>
      </div>

      {/* Theme buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onChange('light')}
          disabled={disabled || (!lightAvailable && !followSystemTheme)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
            "flex items-center justify-center gap-2 min-w-[90px]",
            !lightAvailable && !followSystemTheme && "opacity-50 cursor-not-allowed",
            effectiveTheme === 'light' && lightAvailable
              ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
              : "bg-background border-border hover:bg-accent hover:text-accent-foreground hover:border-primary/50"
          )}
          title={
            followSystemTheme 
              ? "Light theme (system controlled)" 
              : !lightAvailable 
                ? "Light theme not available" 
                : "Switch to light theme"
          }
        >
          <Sun className="h-4 w-4" />
          Light
        </button>
        
        <button
          onClick={() => onChange('dark')}
          disabled={disabled || (!darkAvailable && !followSystemTheme)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
            "flex items-center justify-center gap-2 min-w-[90px]",
            !darkAvailable && !followSystemTheme && "opacity-50 cursor-not-allowed",
            effectiveTheme === 'dark' && darkAvailable
              ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
              : "bg-background border-border hover:bg-accent hover:text-accent-foreground hover:border-primary/50"
          )}
          title={
            followSystemTheme 
              ? "Dark theme (system controlled)" 
              : !darkAvailable 
                ? "Dark theme not available" 
                : "Switch to dark theme"
          }
        >
          <Moon className="h-4 w-4" />
          Dark
        </button>
      </div>

      {/* Status indicator */}
      <div className="text-xs text-muted-foreground">
        {followSystemTheme ? (
          <span>
            Following system theme: <strong>{systemTheme === 'dark' ? 'Dark' : 'Light'}</strong>
          </span>
        ) : (
          <span>
            Custom selection: <strong>{selected === 'dark' ? 'Dark' : 'Light'}</strong>
          </span>
        )}
      </div>
    </div>
  )
}
