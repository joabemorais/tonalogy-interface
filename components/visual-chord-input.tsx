'use client'

import React, { useState } from 'react'
import { Plus, X, Music2, Hash, Palette } from 'lucide-react'
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
  
  // Always call hooks in the same order (required by React hooks rules)
  const [isOpen, setIsOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [builder, setBuilder] = useState<ChordBuilder>({
    note: 'C',
    accidental: '♮',
    type: CHORD_TYPES[0]
  })

  // Handle ESC key to close panel
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleCloseChordBuilder()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

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
    // Auto-apply changes only when editing existing chords
    if (editingIndex !== null) {
      const chordSymbol = buildChordSymbol(builder)
      const currentChord = chords[editingIndex]
      if (currentChord !== chordSymbol) {
        const newChords = [...chords]
        newChords[editingIndex] = chordSymbol
        onChange(newChords)
      }
    }
    // For adding new chords, don't auto-apply - user must click "Add Chord"
    
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
                "flex items-center justify-center shadow-sm hover:shadow-md",
                "border-border hover:border-primary/50",
                "active:scale-95", // Uniform press feedback like mobile
                isOpen && editingIndex === index && "border-primary shadow-md bg-primary/5"
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
                  "absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 flex items-center justify-center z-50 shadow-lg transition-all duration-200 border-[3px] border-red-800 hover:border-red-900",
                  // Always visible when editing this chord, otherwise show on hover
                  isOpen && editingIndex === index 
                    ? "opacity-100" 
                    : "opacity-0 group-hover:opacity-100",
                  "disabled:opacity-0"
                )}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Chord builder panel for editing - positioned next to the chord being edited */}
            {isOpen && editingIndex === index && !disabled && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/20 z-40"
                  onClick={handleCloseChordBuilder}
                />
                
                {/* Painel posicionado abaixo do botão de edição */}
                <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 p-2.5 bg-background border rounded-lg shadow-xl z-50 w-[320px] max-h-[380px] overflow-y-auto animate-in fade-in zoom-in duration-200">
                  {/* Header with preview */}
                  <div className="flex items-center justify-between mb-2 pb-2 border-b">
                    <span className="text-xs text-muted-foreground font-medium">
                      Edit Chord
                    </span>
                    <div className="text-xl font-bold px-3 py-1.5 bg-accent rounded-lg min-w-[70px] text-center shadow-sm">
                      {buildChordSymbol(builder)}
                    </div>
                  </div>

                  {/* Grid layout */}
                  <div className="grid grid-cols-3 gap-2.5 mb-2">
                    {/* Note selector */}
                    <div className="space-y-2">
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
                                ? "border-primary shadow-md scale-105"
                                : "bg-background hover:bg-accent hover:text-accent-foreground border-border hover:border-primary/50 hover:shadow-md"
                            )}
                          >
                            {note}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accidental selector */}
                    <div className="space-y-2">
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
                        
                        {/* Botão Cancel integrado na coluna Accidental */}
                        <button
                          onClick={handleCloseChordBuilder}
                          className="w-full py-3 text-sm font-medium bg-destructive/10 text-destructive rounded-lg border border-destructive/20 hover:bg-destructive/20 hover:border-destructive/40 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* Chord type selector */}
                    <div className="space-y-2">
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
                        
                        {/* Botão Update integrado na coluna Type */}
                        <button
                          onClick={handleConfirmChord}
                          className="w-full py-3 text-sm font-medium bg-primary/90 text-primary-foreground rounded-lg border border-primary hover:bg-primary hover:border-primary/80 transition-all duration-200 flex items-center justify-center gap-2 mt-4 shadow-md"
                        >
                          <Music2 className="h-4 w-4" />
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        
        {/* Add chord button */}
        {chords.length < maxChords && (
          <div className="relative">
            <button
              onClick={() => handleOpenChordBuilder()}
              disabled={disabled}
              className={cn(
                "w-20 h-14 border-2 border-dashed border-muted-foreground/40 rounded-xl",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center group shadow-sm",
                "active:scale-95", // Uniform press feedback like mobile
                (isOpen && editingIndex === null)
                  ? "border-primary bg-primary/10 shadow-md"
                  : "hover:border-primary hover:bg-primary/10 hover:shadow-md"
              )}
            >
              <Plus className={cn(
                "h-6 w-6 transition-colors",
                (isOpen && editingIndex === null)
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-primary"
              )} />
            </button>
            
            {/* Chord builder panel - positioned relative to button */}
            {isOpen && editingIndex === null && !disabled && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/20 z-40"
                  onClick={handleCloseChordBuilder}
                />
                
                {/* Panel posicionado abaixo do botão de adicionar */}
                <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 p-2.5 bg-background border rounded-lg shadow-xl z-50 w-[320px] max-h-[380px] overflow-y-auto animate-in fade-in zoom-in duration-200">
                  {/* Header with preview */}
                  <div className="flex items-center justify-between mb-2 pb-2 border-b">
                    <span className="text-xs text-muted-foreground font-medium">
                      Add Chord
                    </span>
                    <div className="text-xl font-bold px-3 py-1.5 bg-accent rounded-lg min-w-[70px] text-center shadow-sm">
                      {buildChordSymbol(builder)}
                    </div>
                  </div>

                  {/* Grid layout */}
                  <div className="grid grid-cols-3 gap-2.5 mb-2">
                    {/* Note selector */}
                    <div className="space-y-2">
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
                                ? "border-primary shadow-md scale-105"
                                : "bg-background hover:bg-accent hover:text-accent-foreground border-border hover:border-primary/50 hover:shadow-md"
                            )}
                          >
                            {note}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accidental selector */}
                    <div className="space-y-2">
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
                        
                        {/* Botão Cancel integrado na coluna Accidental */}
                        <button
                          onClick={handleCloseChordBuilder}
                          className="w-full py-3 text-sm font-medium bg-destructive/10 text-destructive rounded-lg border border-destructive/20 hover:bg-destructive/20 hover:border-destructive/40 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* Chord type selector */}
                    <div className="space-y-2">
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
                        
                        {/* Botão Add integrado na coluna Type */}
                        <button
                          onClick={handleConfirmChord}
                          className="w-full py-3 text-sm font-medium bg-primary/90 text-primary-foreground rounded-lg border border-primary hover:bg-primary hover:border-primary/80 transition-all duration-200 flex items-center justify-center gap-2 mt-4 shadow-md"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Chord count */}
      <div className="flex items-center justify-end text-xs text-muted-foreground">
        <span className="font-medium">
          {chords.length} / {maxChords} chords
        </span>
      </div>
    </div>
  )
}
