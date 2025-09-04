'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { getChordTonality, getTonalityColor, shouldHaveDashedBorder } from '@/lib/tonality-colors'

interface ChordTonalityStyle {
  borderBottomColor: string
  borderBottomStyle: 'solid' | 'dashed'
  borderBottomWidth: string
  '--chord-tonality-stroke': string
  '--chord-tonality-fill': string
  '--chord-tonality-label': string
  '--chord-tonality-border-style': 'solid' | 'dashed'
}

/**
 * Hook to get styling for chord buttons based on their tonality
 */
export function useChordTonalityStyling(chord: string): ChordTonalityStyle {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure we're mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return default styling during SSR
    return {
      borderBottomColor: 'transparent',
      borderBottomStyle: 'solid',
      borderBottomWidth: '3px',
      '--chord-tonality-stroke': 'transparent',
      '--chord-tonality-fill': 'transparent',
      '--chord-tonality-label': 'inherit',
      '--chord-tonality-border-style': 'solid'
    }
  }

  // Get the chord's tonality
  const tonality = getChordTonality(chord)
  
  if (!tonality) {
    return {
      borderBottomColor: 'transparent',
      borderBottomStyle: 'solid',
      borderBottomWidth: '3px',
      '--chord-tonality-stroke': 'transparent',
      '--chord-tonality-fill': 'transparent',
      '--chord-tonality-label': 'inherit',
      '--chord-tonality-border-style': 'solid'
    }
  }

  // Determine the current theme (fallback to 'light' if theme is undefined)
  const currentTheme = (resolvedTheme || theme) as 'light' | 'dark'
  const effectiveTheme: 'light' | 'dark' = currentTheme === 'dark' ? 'dark' : 'light'

  // Get the colors for the tonality
  const strokeColor = getTonalityColor(tonality, 'stroke', effectiveTheme)
  const fillColor = getTonalityColor(tonality, 'fill', effectiveTheme)
  const labelColor = getTonalityColor(tonality, 'label', effectiveTheme)
  
  // Determine border style based on whether the chord is minor or diminished
  const borderStyle = shouldHaveDashedBorder(chord) ? 'dashed' : 'solid'

  return {
    borderBottomColor: strokeColor,
    borderBottomStyle: borderStyle,
    borderBottomWidth: '3px',
    '--chord-tonality-stroke': strokeColor,
    '--chord-tonality-fill': fillColor,
    '--chord-tonality-label': labelColor,
    '--chord-tonality-border-style': borderStyle
  } as ChordTonalityStyle
}
