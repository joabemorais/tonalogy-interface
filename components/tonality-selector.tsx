'use client'

import React from 'react'
import { COMMON_TONALITIES } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useTonalityTheme } from '@/hooks/use-tonality-theme'

interface TonalitySelectorProps {
  selected: string[]
  onChange: (tonalities: string[]) => void
  disabled?: boolean
}

export function TonalitySelector({ selected, onChange, disabled = false }: TonalitySelectorProps) {
  const { getColor, getStyles, isMinor } = useTonalityTheme()

  const handleToggle = (tonality: string) => {
    if (disabled) return
    
    if (selected.includes(tonality)) {
      onChange(selected.filter(t => t !== tonality))
    } else {
      onChange([...selected, tonality])
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">
        Select specific tonalities to test (leave empty for auto-detection)
      </div>
      <div className="max-h-44 overflow-y-auto border rounded-xl p-3 bg-background/80 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COMMON_TONALITIES.map((tonality) => {
            const isSelected = selected.includes(tonality)
            const strokeColor = getColor(tonality, 'stroke')
            const fillColor = getColor(tonality, 'fill')
            const labelColor = getColor(tonality, 'label')
            const borderStyle = isMinor(tonality) ? 'dashed' : 'solid'
            
            return (
              <button
                key={tonality}
                onClick={() => handleToggle(tonality)}
                disabled={disabled}
                className={cn(
                  "relative px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  "hover:scale-[1.02] active:scale-95 text-center group",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  isSelected ? "shadow-lg" : "shadow-sm hover:shadow-md"
                )}
                style={{
                  borderWidth: '2px',
                  borderStyle,
                  borderColor: strokeColor,
                  backgroundColor: isSelected ? fillColor : 'transparent',
                  color: isSelected ? labelColor : strokeColor,
                  ...(isSelected ? {} : {
                    '--hover-bg': `${fillColor}20`,
                    '--hover-border': strokeColor
                  })
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && !disabled) {
                    e.currentTarget.style.backgroundColor = `${fillColor}15`
                    e.currentTarget.style.borderColor = strokeColor
                    e.currentTarget.style.color = labelColor
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected && !disabled) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = strokeColor
                    e.currentTarget.style.color = strokeColor
                  }
                }}
              >
                {/* Tonality indicator dot */}
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: strokeColor }}
                  />
                  <span className="truncate">{tonality}</span>
                </div>
                
                {/* Selected indicator */}
                {isSelected && (
                  <div 
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background"
                    style={{ backgroundColor: strokeColor }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="text-xs text-muted-foreground">Selected:</span>
          {selected.map((tonality) => (
            <span
              key={tonality}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `${getColor(tonality, 'fill')}25`,
                color: getColor(tonality, 'label'),
                border: `1px ${isMinor(tonality) ? 'dashed' : 'solid'} ${getColor(tonality, 'stroke')}50`
              }}
            >
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: getColor(tonality, 'stroke') }}
              />
              {tonality}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
