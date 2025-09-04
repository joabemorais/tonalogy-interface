import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ChordValidation } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Common chord patterns and validation (Triads only)
 */
const CHORD_PATTERNS = {
  // Major chords (no modifier or M)
  major: /^[A-G][#♯b♭]?M?$/,
  // Minor chords  
  minor: /^[A-G][#♯b♭]?m$/,
  // Diminished chords
  diminished: /^[A-G][#♯b♭]?(dim|°)$/
}

/**
 * Validate a chord symbol
 */
export function validateChord(chord: string): ChordValidation {
  if (!chord || chord.trim() === '') {
    return {
      isValid: false,
      message: 'Chord cannot be empty'
    }
  }

  const normalizedChord = chord.trim()
  
  // Check against all patterns
  const isValid = Object.values(CHORD_PATTERNS).some(pattern => 
    pattern.test(normalizedChord)
  )

  if (isValid) {
    return { isValid: true }
  }

  // Generate suggestions
  const suggestions = generateChordSuggestions(normalizedChord)
  
  return {
    isValid: false,
    message: 'Invalid chord format',
    suggestions
  }
}

/**
 * Generate chord suggestions for invalid input
 */
function generateChordSuggestions(input: string): string[] {
  const suggestions: string[] = []
  const baseNote = input.charAt(0).toUpperCase()
  
  if (!/^[A-G]/.test(baseNote)) {
    return ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  }

  // Common triad types for the note
  const accidental = input.length > 1 && /[#♯b♭]/.test(input.charAt(1)) ? input.charAt(1) : ''
  const base = baseNote + accidental

  suggestions.push(
    base,             // Major
    base + 'm',       // Minor  
    base + 'dim'      // Diminished
  )

  return suggestions.slice(0, 3)
}

/**
 * Normalize chord symbols for API requests
 * Converts visual symbols (♯, ♭) to ASCII equivalents (#, b)
 */
export function normalizeChordForAPI(chord: string): string {
  return chord
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b')
}

/**
 * Normalize array of chords for API requests
 */
export function normalizeChordsForAPI(chords: string[]): string[] {
  return chords.map(normalizeChordForAPI)
}

/**
 * Validate multiple chords
 */
export function validateChords(chords: string[]): { 
  allValid: boolean
  validations: ChordValidation[]
  validChords: string[]
} {
  const validations = chords.map(validateChord)
  const allValid = validations.every(v => v.isValid)
  const validChords = chords.filter((_, index) => validations[index].isValid)

  return {
    allValid,
    validations,
    validChords
  }
}

/**
 * Common tonalities for testing
 */
export const COMMON_TONALITIES = [
  'C Major', 'G Major', 'D Major', 'A Major', 'E Major', 'B Major', 'F# Major',
  'Db Major', 'Ab Major', 'Eb Major', 'Bb Major', 'F Major',
  'A minor', 'E minor', 'B minor', 'F# minor', 'C# minor', 'G# minor', 'D# minor',
  'Bb minor', 'F minor', 'C minor', 'G minor', 'D minor', 'A# minor', 'Db minor', 'Eb minor'
]

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date | string | number): string {
  // Converter para Date se necessário
  const dateObj = date instanceof Date ? date : new Date(date)
  
  // Validar se é uma data válida
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date'
  }
  
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return dateObj.toLocaleDateString()
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Convert blob to base64 for display
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
