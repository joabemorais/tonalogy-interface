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
      <div className="max-h-32 overflow-y-auto border rounded-md p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {COMMON_TONALITIES.map((tonality) => (
            <button
              key={tonality}
              onClick={() => handleToggle(tonality)}
              disabled={disabled}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors text-left",
                "hover:bg-accent hover:text-accent-foreground",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                selected.includes(tonality)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-secondary-foreground"
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
