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

// Component for the tonality rainbow at the bottom
function TonalityRainbow() {
  const { getColor } = useTonalityTheme()
  
  // Get the 12 major tonalities in chromatic order
  const majorTonalities = [
    'C Major', 'C# Major', 'D Major', 'D# Major', 'E Major', 'F Major',
    'F# Major', 'G Major', 'G# Major', 'A Major', 'A# Major', 'B Major'
  ]

  return (
    <div className="relative mt-3">
      <div className="flex h-1 rounded-full overflow-hidden">
        {majorTonalities.map((tonality, index) => {
          const strokeColor = getColor(tonality, 'stroke')
          return (
            <div
              key={tonality}
              className="flex-1 transition-all duration-200 hover:h-1.5"
              style={{ backgroundColor: strokeColor }}
              title={tonality}
            />
          )
        })}
      </div>
    </div>
  )
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
            
            // Helper function to convert hex to rgba
            const hexToRgba = (hex: string, alpha: number) => {
              const r = parseInt(hex.slice(1, 3), 16)
              const g = parseInt(hex.slice(3, 5), 16)
              const b = parseInt(hex.slice(5, 7), 16)
              return `rgba(${r}, ${g}, ${b}, ${alpha})`
            }
            
            // Initial state should be very subtle (lower opacity)
            const initialBgColor = isSelected ? fillColor : hexToRgba(fillColor, 0.08)
            // Hover state should be more visible (higher opacity)  
            const hoverBgColor = hexToRgba(fillColor, 0.18)
            
            return (
              <button
                key={tonality}
                onClick={() => handleToggle(tonality)}
                disabled={disabled}
                className={cn(
                  "relative px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  "hover:scale-[1.02] active:scale-95 text-center group tonality-button",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  isSelected ? "shadow-lg tonality-selected" : "shadow-sm hover:shadow-md tonality-unselected"
                )}
                style={{
                  '--stroke-color': strokeColor,
                  '--fill-color': fillColor,
                  '--label-color': labelColor,
                  '--initial-bg': initialBgColor,
                  '--hover-bg': hoverBgColor,
                  borderWidth: '2px',
                  borderStyle,
                  borderColor: strokeColor,
                  backgroundColor: initialBgColor,
                  color: isSelected ? labelColor : strokeColor,
                } as React.CSSProperties}
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
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-muted-foreground">Selected:</span>
          <div className="flex flex-wrap gap-1.5 items-center">
            {selected.map((tonality) => (
              <span
                key={tonality}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: (() => {
                    const hex = getColor(tonality, 'fill')
                    const r = parseInt(hex.slice(1, 3), 16)
                    const g = parseInt(hex.slice(3, 5), 16)
                    const b = parseInt(hex.slice(5, 7), 16)
                    return `rgba(${r}, ${g}, ${b}, 0.15)`
                  })(),
                  color: getColor(tonality, 'label'),
                  border: `1px ${isMinor(tonality) ? 'dashed' : 'solid'} ${(() => {
                    const hex = getColor(tonality, 'stroke')
                    const r = parseInt(hex.slice(1, 3), 16)
                    const g = parseInt(hex.slice(3, 5), 16)
                    const b = parseInt(hex.slice(5, 7), 16)
                    return `rgba(${r}, ${g}, ${b}, 0.3)`
                  })()}`
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
        </div>
      )}
    </div>
  )
}

// Export TonalityRainbow separately for use in other components
export { TonalityRainbow }
