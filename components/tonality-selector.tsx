'use client'

import React from 'react'
import { COMMON_TONALITIES } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TonalitySelectorProps {
  selected: string[]
  onChange: (tonalities: string[]) => void
  disabled?: boolean
}

export function TonalitySelector({ selected, onChange, disabled = false }: TonalitySelectorProps) {
  const handleToggle = (tonality: string) => {
    if (selected.includes(tonality)) {
      onChange(selected.filter(t => t !== tonality))
    } else {
      onChange([...selected, tonality])
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">
        Select specific tonalities to test (leave empty for auto-detection)
      </div>
      <div className="max-h-44 overflow-y-auto border rounded-xl p-3 bg-background/50 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COMMON_TONALITIES.map((tonality) => (
            <button
              key={tonality}
              onClick={() => handleToggle(tonality)}
              disabled={disabled}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground text-center",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-sm hover:shadow-md active:scale-95",
                selected.includes(tonality)
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-background border-border hover:border-primary/50"
              )}
            >
              {tonality}
            </button>
          ))}
        </div>
      </div>
      {selected.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Selected: {selected.join(', ')}
        </div>
      )}
    </div>
  )
}
