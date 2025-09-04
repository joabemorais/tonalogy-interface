'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChordTonalityStyling } from '@/hooks/use-chord-tonality-styling'

// Hook for long press detection - only handles long press, doesn't interfere with onClick
function useLongPress(onLongPress: () => void, onClick: () => void, delay = 500) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const isLongPressRef = useRef(false)

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault() // Previne seleção de texto
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

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault() // Previne menu de contexto
  }

  return {
    onTouchStart: handleStart,
    onTouchEnd: handleEnd,
    onTouchCancel: handleCancel,
    onMouseDown: handleStart,
    onMouseUp: handleEnd,
    onMouseLeave: handleCancel,
    onContextMenu: handleContextMenu,
  }
}

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

interface ChordButtonProps {
  chord: string
  index: number
  disabled: boolean
  showRemoveButtons: boolean
  onChordPress: (index: number) => void
  onLongPress: (index: number) => void
  onRemove: (index: number) => void
  isEditing?: boolean
}

function ChordButton({ 
  chord, 
  index, 
  disabled, 
  showRemoveButtons, 
  onChordPress, 
  onLongPress, 
  onRemove,
  isEditing = false
}: ChordButtonProps) {
  const longPressProps = useLongPress(
    () => onLongPress(index),
    () => onChordPress(index)
  )
  
  const tonalityStyle = useChordTonalityStyling(chord)
  
  return (
    <div key={index} className="relative">
      <button
        {...longPressProps}
        onClick={() => onChordPress(index)}
        disabled={disabled}
        style={tonalityStyle}
        className={cn(
          "h-14 w-20 text-base font-semibold border-2 rounded-xl bg-background select-none",
          "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center shadow-sm hover:shadow-md",
          "active:scale-95", // Visual feedback for press
          showRemoveButtons && "border-destructive/50 bg-destructive/5",
          isEditing && "border-primary shadow-md bg-primary/5" // Uniform editing state with desktop
        )}
      >
        <span className="select-none">{chord}</span>
      </button>
      
      {/* Remove button - always visible when in remove mode */}
      {showRemoveButtons && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(index)
          }}
          disabled={disabled}
          className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 flex items-center justify-center shadow-lg z-10 transition-all duration-200 animate-in zoom-in border-[3px] border-red-800 hover:border-red-900"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
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

export function MobileChordKeyboard({ chords, onChange, disabled = false, maxChords = 12 }: MobileChordKeyboardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showRemoveButtons, setShowRemoveButtons] = useState(false)
  const [builder, setBuilder] = useState<ChordBuilder>({
    note: 'C',
    accidental: '♮',
    type: CHORD_TYPES[0]
  })

  // Hide remove buttons when only one chord remains
  useEffect(() => {
    if (chords.length <= 1 && showRemoveButtons) {
      setShowRemoveButtons(false)
    }
  }, [chords.length, showRemoveButtons])

  const handleOpenKeyboard = useCallback((index?: number) => {
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
  }, [disabled, chords])

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

  const handleRemoveChord = useCallback((index: number) => {
    const newChords = chords.filter((_, i) => i !== index)
    onChange(newChords)
    // The useEffect will handle hiding remove buttons if needed
  }, [chords, onChange])

  const handleLongPress = useCallback((index: number) => {
    if (disabled || chords.length <= 1) return
    
    // Toggle remove buttons visibility
    setShowRemoveButtons(!showRemoveButtons)
    
    // Vibrate if available (for better UX feedback)
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }, [disabled, chords.length, showRemoveButtons])

  const handleChordPress = useCallback((index: number) => {
    if (showRemoveButtons) {
      // If in remove mode, don't open keyboard
      setShowRemoveButtons(false)
      return
    }
    handleOpenKeyboard(index)
  }, [showRemoveButtons, handleOpenKeyboard])

  const handleBuilderChange = useCallback((updates: Partial<ChordBuilder>) => {
    setBuilder(prev => ({ ...prev, ...updates }))
  }, [])

  return (
    <>
      {/* Backdrop para cancelar modo de remoção */}
      {showRemoveButtons && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowRemoveButtons(false)}
        />
      )}
      
      {/* Chord Display Area */}
      <div className="space-y-3 relative z-40">
        {/* Mode indicator - sempre reserva espaço */}
        <div className="text-center mb-2 h-8 flex items-center justify-center">
          {showRemoveButtons && chords.length > 1 ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive text-sm rounded-full select-none">
              <X className="h-4 w-4" />
              <span>Tap to remove chords</span>
            </div>
          ) : (
            chords.length > 1 && (
              <p className="text-xs text-muted-foreground select-none">
                Tap to edit • Long press to remove
              </p>
            )
          )}
        </div>
        
        {/* Current Chords */}
        <div className="flex flex-wrap gap-3 justify-center">
          {chords.map((chord, index) => (
            <ChordButton
              key={index}
              chord={chord}
              index={index}
              disabled={disabled}
              showRemoveButtons={showRemoveButtons}
              onChordPress={handleChordPress}
              onLongPress={handleLongPress}
              onRemove={handleRemoveChord}
              isEditing={isOpen && editingIndex === index}
            />
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
        
        {/* Exit remove mode button */}
        {showRemoveButtons && (
          <div className="text-center">
            <button
              onClick={() => setShowRemoveButtons(false)}
              className="px-4 py-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors select-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              Done
            </button>
          </div>
        )}
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
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 animate-in slide-in-from-bottom duration-300 max-h-[70vh] overflow-y-auto custom-scrollbar-autohide">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0">
              <button
                onClick={handleCloseKeyboard}
                className="h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex flex-col items-center gap-3 relative">
                <span className="text-xs text-muted-foreground font-medium">
                  {editingIndex !== null ? 'Edit Chord' : 'Add Chord'}
                </span>
                <div className="relative">
                  <div className="text-2xl font-bold px-4 py-2 bg-accent rounded-xl text-center min-w-[80px] shadow-sm">
                    {buildChordSymbol(builder)}
                  </div>
                  
                  {/* Remove button - only show when editing existing chord and there's more than one chord */}
                  {editingIndex !== null && chords.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveChord(editingIndex)
                        handleCloseKeyboard()
                      }}
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 flex items-center justify-center shadow-lg transition-all duration-200 border-[3px] border-red-800 hover:border-red-900 z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
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
