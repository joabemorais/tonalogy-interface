'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { getNoteTonality, getTonalityColor } from '@/lib/tonality-colors'

interface NoteTonalityStyle {
  '--note-tonality-stroke': string
  '--note-tonality-fill': string
  '--note-tonality-label': string
}

/**
 * Hook to get styling for note buttons based on their tonality
 */
export function useNoteTonalityStyling(note: string, accidental?: string): NoteTonalityStyle {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure we're mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return default styling during SSR
    return {
      '--note-tonality-stroke': 'transparent',
      '--note-tonality-fill': 'transparent',
      '--note-tonality-label': 'inherit'
    }
  }

  // Get the note's tonality
  const tonality = getNoteTonality(note, accidental)
  
  if (!tonality) {
    return {
      '--note-tonality-stroke': 'transparent',
      '--note-tonality-fill': 'transparent',
      '--note-tonality-label': 'inherit'
    }
  }

  // Determine the current theme (fallback to 'light' if theme is undefined)
  const currentTheme = (resolvedTheme || theme) as 'light' | 'dark'
  const effectiveTheme: 'light' | 'dark' = currentTheme === 'dark' ? 'dark' : 'light'

  // Get the colors for the tonality
  const strokeColor = getTonalityColor(tonality, 'stroke', effectiveTheme)
  const fillColor = getTonalityColor(tonality, 'fill', effectiveTheme)
  const labelColor = getTonalityColor(tonality, 'label', effectiveTheme)

  return {
    '--note-tonality-stroke': strokeColor,
    '--note-tonality-fill': fillColor,
    '--note-tonality-label': labelColor
  } as NoteTonalityStyle
}
