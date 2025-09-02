'use client'

import React from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { validateChord } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ChordInputProps {
  chords: string[]
  onChange: (chords: string[]) => void
  disabled?: boolean
  maxChords?: number
}

export function ChordInput({ chords, onChange, disabled = false, maxChords = 12 }: ChordInputProps) {
  const handleChordChange = (index: number, value: string) => {
    const newChords = [...chords]
    newChords[index] = value
    onChange(newChords)
  }

  const addChord = () => {
    if (chords.length < maxChords) {
      onChange([...chords, ''])
    }
  }

  const removeChord = (index: number) => {
    if (chords.length > 1) {
      const newChords = chords.filter((_, i) => i !== index)
      onChange(newChords)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {chords.map((chord, index) => {
          const validation = validateChord(chord)
          return (
            <div key={index} className="relative group">
              <input
                type="text"
                value={chord}
                onChange={(e) => handleChordChange(index, e.target.value)}
                disabled={disabled}
                placeholder={`Chord ${index + 1}`}
                className={cn(
                  "w-full px-3 py-2 text-sm border rounded-md bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  validation.isValid 
                    ? "border-input" 
                    : chord.trim() 
                      ? "border-destructive focus:ring-destructive"
                      : "border-input"
                )}
              />
              
              {/* Remove button */}
              {chords.length > 1 && (
                <button
                  onClick={() => removeChord(index)}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              
              {/* Validation message */}
              {!validation.isValid && chord.trim() && (
                <div className="absolute top-full left-0 mt-1 text-xs text-destructive">
                  {validation.message}
                </div>
              )}
              
              {/* Suggestions */}
              {!validation.isValid && validation.suggestions && chord.trim() && (
                <div className="absolute top-full left-0 mt-6 p-2 bg-popover border rounded-md shadow-md z-10 min-w-full">
                  <div className="text-xs text-muted-foreground mb-1">Suggestions:</div>
                  <div className="flex flex-wrap gap-1">
                    {validation.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleChordChange(index, suggestion)}
                        disabled={disabled}
                        className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Add chord button */}
      {chords.length < maxChords && (
        <div className="flex justify-center">
          <Button
            onClick={addChord}
            disabled={disabled}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Chord
          </Button>
        </div>
      )}
      
      {/* Chord count */}
      <div className="text-xs text-muted-foreground text-center">
        {chords.length} / {maxChords} chords
      </div>
    </div>
  )
}
