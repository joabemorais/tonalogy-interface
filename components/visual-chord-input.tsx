'use client'

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileChordKeyboard } from '@/components/mobile-chord-keyboard'

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

  // Desktop/tablet layout - same behavior as mobile (no empty chords)
  const [isOpen, setIsOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [builder, setBuilder] = useState<ChordBuilder>({
    note: 'C',
    accidental: '♮',
    type: CHORD_TYPES[0]
  })

  const handleOpenChordBuilder = (index?: number) => {
    if (disabled) return
    
    if (index !== undefined) {
      // Editing existing chord
      setEditingIndex(index)
      const chord = chords[index]
      const parsed = parseChordSymbol(chord)
      if (parsed) {
        setBuilder(parsed)
      }
    } else {
      // Adding new chord
      setEditingIndex(null)
      setBuilder({
        note: 'C',
        accidental: '♮',
        type: CHORD_TYPES[0]
      })
    }
    setIsOpen(true)
  }

  const handleCloseChordBuilder = () => {
    setIsOpen(false)
    setEditingIndex(null)
  }

  const handleConfirmChord = () => {
    const chordSymbol = buildChordSymbol(builder)
    
    if (editingIndex !== null) {
      // Update existing chord
      const newChords = [...chords]
      newChords[editingIndex] = chordSymbol
      onChange(newChords)
    } else {
      // Add new chord
      if (chords.length < maxChords) {
        onChange([...chords, chordSymbol])
      }
    }
    
    handleCloseChordBuilder()
  }

  const handleRemoveChord = (index: number) => {
    if (chords.length > 1) {
      const newChords = chords.filter((_, i) => i !== index)
      onChange(newChords)
    }
  }

  const handleBuilderChange = (updates: Partial<ChordBuilder>) => {
    setBuilder(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="space-y-4">
      {/* Main chord grid - only show non-empty chords */}
      <div className="flex flex-wrap gap-3 justify-center">
        {chords.map((chord, index) => (
          <div key={index} className="relative group">
            <button
              onClick={() => handleOpenChordBuilder(index)}
              disabled={disabled}
              className={cn(
                "w-20 h-14 px-3 py-2 text-base font-semibold border-2 rounded-xl bg-background",
                "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center shadow-sm hover:shadow-lg",
                "active:scale-95 hover:scale-105",
                "border-border hover:border-primary/50"
              )}
            >
              <span className="select-none">{chord}</span>
            </button>
            
            {/* Remove button on hover */}
            {chords.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveChord(index)
                }}
                disabled={disabled}
                className={cn(
                  "absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 flex items-center justify-center z-10 shadow-lg transition-all duration-200",
                  "opacity-0 group-hover:opacity-100 hover:scale-110",
                  "disabled:opacity-0"
                )}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        
        {/* Add chord button */}
        {chords.length < maxChords && (
          <button
            onClick={() => handleOpenChordBuilder()}
            disabled={disabled}
            className={cn(
              "w-20 h-14 border-2 border-dashed border-muted-foreground/40 rounded-xl",
              "hover:border-primary hover:bg-primary/10 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center group shadow-sm hover:shadow-md",
              "hover:scale-105 active:scale-95"
            )}
          >
            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        )}
      </div>

      {/* Chord builder panel */}
      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={handleCloseChordBuilder}
          />
          
          {/* Panel */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-background border rounded-xl shadow-xl z-50 min-w-[450px] max-w-[550px] animate-in fade-in zoom-in duration-200">
            {/* Header with preview */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <span className="text-xs text-muted-foreground font-medium">
                {editingIndex !== null ? 'Edit Chord' : 'Add Chord'}
              </span>
              <div className="text-2xl font-bold px-4 py-2 bg-accent rounded-xl min-w-[80px] text-center shadow-sm">
                {buildChordSymbol(builder)}
              </div>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Note selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground text-center block">Note</label>
                <div className="grid grid-cols-2 gap-2">
                  {NOTES.map((note) => (
                    <button
                      key={note}
                      onClick={() => handleBuilderChange({ note })}
                      className={cn(
                        "h-12 text-lg font-semibold rounded-lg border-2 transition-all duration-200",
                        "flex items-center justify-center shadow-sm",
                        builder.note === note
                          ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                          : "bg-background hover:bg-accent hover:text-accent-foreground border-border hover:border-primary/50 hover:shadow-md"
                      )}
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accidental selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground text-center block">Accidental</label>
                <div className="space-y-2">
                  {ACCIDENTALS.map((acc) => (
                    <button
                      key={acc}
                      onClick={() => handleBuilderChange({ accidental: acc })}
                      className={cn(
                        "w-full h-12 text-lg font-semibold rounded-lg border-2 transition-all duration-200",
                        "flex items-center justify-center shadow-sm",
                        builder.accidental === acc
                          ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                          : "bg-background hover:bg-accent hover:text-accent-foreground border-border hover:border-primary/50 hover:shadow-md"
                      )}
                    >
                      {acc === '♮' ? '♮' : acc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chord type selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground text-center block">Type</label>
                <div className="space-y-2">
                  {CHORD_TYPES.map((type) => (
                    <button
                      key={type.symbol}
                      onClick={() => handleBuilderChange({ type })}
                      className={cn(
                        "w-full h-12 px-3 text-base font-semibold rounded-lg border-2 transition-all duration-200",
                        "flex items-center justify-center shadow-sm",
                        builder.type.symbol === type.symbol
                          ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                          : "bg-background hover:bg-accent hover:text-accent-foreground border-border hover:border-primary/50 hover:shadow-md"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseChordBuilder}
                className="px-4 py-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmChord}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-md"
              >
                {editingIndex !== null ? 'Update' : 'Add'} Chord
              </button>
            </div>
          </div>
        </>
      )}

      {/* Help text and chord count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Click to edit • Hover to remove</span>
        <span className="font-medium">
          {chords.length} / {maxChords} chords
        </span>
      </div>
    </div>
  )
}
