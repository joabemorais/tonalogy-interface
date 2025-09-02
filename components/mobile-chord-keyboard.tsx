'use client'

import React, { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileChordKeyboardProps {
  chords: string[]
  onChange: (chords: string[]) => void
  disabled?: boolean
  maxChords?: number
}

// Definições das tríades suportadas
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const
const ACCIDENTALS = ['♮', '♯', '♭'] as const
const CHORD_TYPES = [
  { symbol: '', label: 'Maj', description: 'Major' },
  { symbol: 'm', label: 'Min', description: 'Minor' },
  { symbol: 'dim', label: 'Dim', description: 'Diminished' }
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

export function MobileChordKeyboard({ chords, onChange, disabled = false, maxChords = 12 }: MobileChordKeyboardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [builder, setBuilder] = useState<ChordBuilder>({
    note: 'C',
    accidental: '♮',
    type: CHORD_TYPES[0]
  })

  const handleOpenKeyboard = (index?: number) => {
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

  const handleCloseKeyboard = () => {
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
    
    handleCloseKeyboard()
  }

  const handleRemoveChord = (index: number) => {
    const newChords = chords.filter((_, i) => i !== index)
    onChange(newChords)
  }

  const handleBuilderChange = (updates: Partial<ChordBuilder>) => {
    setBuilder(prev => ({ ...prev, ...updates }))
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

  return (
    <>
      {/* Chord Display Area */}
      <div className="space-y-3">
        {/* Current Chords */}
        <div className="flex flex-wrap gap-3 justify-center">
          {chords.map((chord, index) => (
            <button
              key={index}
              onClick={() => handleOpenKeyboard(index)}
              disabled={disabled}
              className={cn(
                "h-14 w-20 text-base font-semibold border-2 rounded-xl bg-background",
                "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "relative group flex items-center justify-center",
                "shadow-sm hover:shadow-md"
              )}
            >
              <span className="select-none">{chord}</span>
              
              {/* Remove button */}
              {!disabled && chords.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveChord(index)
                  }}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center shadow-md z-10"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </button>
          ))}
          
          {/* Add button */}
          {chords.length < maxChords && (
            <button
              onClick={() => handleOpenKeyboard()}
              disabled={disabled}
              className={cn(
                "h-14 w-20 border-2 border-dashed border-muted-foreground/40 rounded-xl",
                "hover:border-primary hover:bg-primary/10 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center group"
              )}
            >
              <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Keyboard Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={handleCloseKeyboard}
          />
          
          {/* Keyboard Panel */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 animate-in slide-in-from-bottom duration-300 max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0">
              <button
                onClick={handleCloseKeyboard}
                className="h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground font-medium">
                  {editingIndex !== null ? 'Edit Chord' : 'Add Chord'}
                </span>
                <div className="text-2xl font-bold px-4 py-2 bg-accent rounded-xl text-center min-w-[80px] shadow-sm">
                  {buildChordSymbol(builder)}
                </div>
              </div>
              
              <button
                onClick={handleConfirmChord}
                className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-all shadow-md"
              >
                <Check className="h-5 w-5" />
              </button>
            </div>

            {/* Keyboard Content */}
            <div className="p-4 space-y-6">
              {/* Notes Grid */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground text-center block">Note</label>
                <div className="grid grid-cols-7 gap-2">
                  {NOTES.map((note) => (
                    <button
                      key={note}
                      onClick={() => handleBuilderChange({ note })}
                      className={cn(
                        "h-12 w-full text-lg font-semibold rounded-lg border-2 transition-all duration-200",
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

              {/* Accidentals */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground text-center block">Accidental</label>
                <div className="grid grid-cols-3 gap-3">
                  {ACCIDENTALS.map((acc) => (
                    <button
                      key={acc}
                      onClick={() => handleBuilderChange({ accidental: acc })}
                      className={cn(
                        "h-12 w-full text-lg font-semibold rounded-lg border-2 transition-all duration-200",
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

              {/* Chord Types */}
              <div className="space-y-3 pb-6">
                <label className="text-sm font-semibold text-muted-foreground text-center block">Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {CHORD_TYPES.map((type) => (
                    <button
                      key={type.symbol}
                      onClick={() => handleBuilderChange({ type })}
                      className={cn(
                        "h-12 w-full px-3 text-base font-semibold rounded-lg border-2 transition-all duration-200",
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
              
              {/* Safe area for mobile gestures */}
              <div className="h-4" />
            </div>
          </div>
        </>
      )}
    </>
  )
}
