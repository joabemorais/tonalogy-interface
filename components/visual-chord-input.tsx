'use client'

import React, { useState, useRef } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileChordKeyboard } from '@/components/mobile-chord-keyboard'

// Hook for long press detection - only handles long press, doesn't interfere with onClick
function useLongPress(onLongPress: () => void, onClick: () => void, delay = 500) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const isLongPressRef = useRef(false)

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isLongPressRef.current = false
    timeoutRef.current = setTimeout(() => {
      isLongPressRef.current = true
      onLongPress()
    }, delay)
  }

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    isLongPressRef.current = false
  }

  const handleCancel = (e: React.MouseEvent | React.TouchEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    isLongPressRef.current = false
  }

  return {
    onTouchStart: handleStart,
    onTouchEnd: handleEnd,
    onTouchCancel: handleCancel,
    onMouseDown: handleStart,
    onMouseUp: handleEnd,
    onMouseLeave: handleCancel,
  }
}

interface VisualChordInputProps {
  chords: string[]
  onChange: (chords: string[]) => void
  disabled?: boolean
  maxChords?: number
}

// Definições das tríades suportadas
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const
const ACCIDENTALS = ['♮', '♯', '♭'] as const
const CHORD_TYPES = [
  { symbol: '', label: 'Major', description: 'Major triad' },
  { symbol: 'm', label: 'Minor', description: 'Minor triad' },
  { symbol: 'dim', label: 'Dim', description: 'Diminished triad' }
] as const

type Note = typeof NOTES[number]
type Accidental = typeof ACCIDENTALS[number]
type ChordType = typeof CHORD_TYPES[number]

interface ChordBuilder {
  note: Note
  accidental: Accidental
  type: ChordType
}

function buildChordSymbol(builder: ChordBuilder): string {
  const accidentalSymbol = builder.accidental === '♮' ? '' : builder.accidental
  return `${builder.note}${accidentalSymbol}${builder.type.symbol}`
}

function parseChordSymbol(chord: string): ChordBuilder | null {
  if (!chord) return null
  
  const note = chord.charAt(0).toUpperCase() as Note
  if (!NOTES.includes(note)) return null
  
  let accidental: Accidental = '♮'
  let typeStr = chord.slice(1)
  
  if (typeStr.startsWith('♯') || typeStr.startsWith('#')) {
    accidental = '♯'
    typeStr = typeStr.slice(1)
  } else if (typeStr.startsWith('♭') || typeStr.startsWith('b')) {
    accidental = '♭'
    typeStr = typeStr.slice(1)
  }
  
  const type = CHORD_TYPES.find(t => t.symbol === typeStr)
  if (!type) return null
  
  return { note, accidental, type }
}

interface ChordSelectorProps {
  value: string
  onChange: (chord: string) => void
  onRemove: () => void
  canRemove: boolean
  disabled?: boolean
  index: number
}

function ChordSelector({ value, onChange, onRemove, canRemove, disabled, index }: ChordSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showMobileRemove, setShowMobileRemove] = useState(false)
  const [builder, setBuilder] = useState<ChordBuilder>({
    note: 'C',
    accidental: '♮',
    type: CHORD_TYPES[0]
  })
  
  const isMobile = useIsMobile()

  // Simple click handler for desktop and mobile
  const handleClick = () => {
    if (showMobileRemove) {
      setShowMobileRemove(false)
    } else if (!disabled) {
      setIsOpen(true)
    }
  }

  // Long press handler only for mobile
  const handleLongPress = () => {
    if (canRemove && !disabled && isMobile) {
      setShowMobileRemove(true)
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }
  }

  // Mobile-specific long press detection
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  const handleTouchStart = () => {
    if (isMobile) {
      timeoutRef.current = setTimeout(handleLongPress, 500)
    }
  }
  
  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleBuilderChange = (newBuilder: Partial<ChordBuilder>) => {
    const updated = { ...builder, ...newBuilder }
    const newChord = buildChordSymbol(updated)
    onChange(newChord)
    
    // Auto-close after selecting chord type (final step)
    if (newBuilder.type) {
      setTimeout(() => setIsOpen(false), 200)
    }
  }

  return (
    <div className="relative group">
      {/* Main chord display button */}
      <button
        onClick={handleClick}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
        disabled={disabled}
        className={cn(
          "w-20 h-14 px-3 py-2 text-base font-semibold border-2 rounded-xl bg-background",
          "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "relative flex items-center justify-center shadow-sm hover:shadow-md",
          "active:scale-95", // Visual feedback for press
          isOpen && "ring-2 ring-ring border-transparent shadow-md",
          showMobileRemove && "border-destructive/50 bg-destructive/5"
        )}
      >
        <span className="select-none">{value || `Chord ${index + 1}`}</span>
      </button>
        
      {/* Remove button - desktop hover / mobile toggle */}
      {canRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
            setShowMobileRemove(false)
          }}
          disabled={disabled}
          className={cn(
            "absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 flex items-center justify-center z-10 shadow-md transition-all duration-200",
            // Desktop: show on hover, Mobile: show when in remove mode
            isMobile 
              ? (showMobileRemove ? "opacity-100 animate-in zoom-in" : "opacity-0")
              : "opacity-0 group-hover:opacity-100",
            "disabled:opacity-0"
          )}
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Chord builder panel */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 p-4 bg-popover border rounded-lg shadow-lg z-20 min-w-[320px] max-w-[420px]">
          {/* Header with preview */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b">
            <span className="text-xs font-medium text-muted-foreground">Build Chord</span>
            <div className="text-lg font-bold px-3 py-1 bg-accent rounded">
              {buildChordSymbol(builder)}
            </div>
          </div>

          {/* Compact horizontal layout */}
          <div className="grid grid-cols-3 gap-3">
            {/* Note selector */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Note</label>
              <div className="grid grid-cols-2 gap-1">
                {NOTES.map((note) => (
                  <button
                    key={note}
                    onClick={() => handleBuilderChange({ note })}
                    className={cn(
                      "h-8 text-sm font-medium rounded border transition-colors",
                      builder.note === note
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-accent hover:text-accent-foreground border-border"
                    )}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            {/* Accidental selector */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Accidental</label>
              <div className="space-y-1">
                {ACCIDENTALS.map((acc) => (
                  <button
                    key={acc}
                    onClick={() => handleBuilderChange({ accidental: acc })}
                    className={cn(
                      "w-full h-8 text-sm font-medium rounded border transition-colors",
                      builder.accidental === acc
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-accent hover:text-accent-foreground border-border"
                    )}
                  >
                    {acc === '♮' ? '♮' : acc}
                  </button>
                ))}
              </div>
            </div>

            {/* Chord type selector */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <div className="space-y-1">
                {CHORD_TYPES.map((type) => (
                  <button
                    key={type.symbol}
                    onClick={() => handleBuilderChange({ type })}
                    className={cn(
                      "w-full h-8 px-2 text-sm font-medium rounded border transition-colors text-left",
                      builder.type.symbol === type.symbol
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-accent hover:text-accent-foreground border-border"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export function VisualChordInput({ chords, onChange, disabled = false, maxChords = 12 }: VisualChordInputProps) {
  const isMobile = useIsMobile()

  // Use mobile keyboard on mobile devices
  if (isMobile) {
    return (
      <MobileChordKeyboard 
        chords={chords}
        onChange={onChange}
        disabled={disabled}
        maxChords={maxChords}
      />
    )
  }

  // Desktop/tablet layout
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
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 justify-items-center">
        {chords.map((chord, index) => (
          <ChordSelector
            key={index}
            value={chord}
            onChange={(value) => handleChordChange(index, value)}
            onRemove={() => removeChord(index)}
            canRemove={chords.length > 1}
            disabled={disabled}
            index={index}
          />
        ))}
      </div>

      {/* Add chord button and count in same row */}
      <div className="flex items-center justify-between">
        {chords.length < maxChords && (
          <Button
            onClick={addChord}
            disabled={disabled}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Chord
          </Button>
        )}
        
        <div className="text-xs text-muted-foreground">
          {chords.length} / {maxChords} chords
        </div>
      </div>
    </div>
  )
}
