'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { getChordTonality, getTonalityColor, isMinorTonality } from '@/lib/tonality-colors'

interface ChordTonalityStyle {
  borderBottomColor: string
  borderBottomStyle: 'solid' | 'dashed'
  borderBottomWidth: string
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
      borderBottomWidth: '3px'
    }
  }

  // Get the chord's tonality
  const tonality = getChordTonality(chord)
  
  if (!tonality) {
    return {
      borderBottomColor: 'transparent',
      borderBottomStyle: 'solid',
      borderBottomWidth: '3px'
    }
  }

  // Determine the current theme (fallback to 'light' if theme is undefined)
  const currentTheme = (resolvedTheme || theme) as 'light' | 'dark'
  const effectiveTheme: 'light' | 'dark' = currentTheme === 'dark' ? 'dark' : 'light'

  // Get the stroke color for the tonality
  const color = getTonalityColor(tonality, 'stroke', effectiveTheme)
  
  // Determine border style based on whether the chord is minor
  const borderStyle = isMinorTonality(tonality) ? 'dashed' : 'solid'

  return {
    borderBottomColor: color,
    borderBottomStyle: borderStyle,
    borderBottomWidth: '3px'
  }
}
