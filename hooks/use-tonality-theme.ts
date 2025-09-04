import { useTheme } from 'next-themes'
import { getTonalityColor, getTonalityStyles, isMinorTonality, getTonalityTailwindVars } from '@/lib/tonality-colors'

/**
 * Hook for accessing tonality theming functionality
 * Provides theme-aware color functions and styling utilities
 */
export function useTonalityTheme() {
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  return {
    /**
     * Get a specific color for a tonality
     */
    getColor: (tonality: string | undefined | null, variant: 'stroke' | 'fill' | 'label') =>
      getTonalityColor(tonality, variant, isDark ? 'dark' : 'light'),

    /**
     * Get complete style object for a tonality
     */
    getStyles: (
      tonality: string | undefined | null,
      options?: {
        variant?: 'stroke' | 'fill' | 'label'
        alpha?: number
        includeHover?: boolean
        includeBorder?: boolean
        borderStyle?: 'solid' | 'dashed'
      }
    ) => getTonalityStyles(tonality, isDark ? 'dark' : 'light', options),

    /**
     * Get CSS custom properties for Tailwind integration
     */
    getTailwindVars: (tonality: string | undefined | null) =>
      getTonalityTailwindVars(tonality, isDark ? 'dark' : 'light'),

    /**
     * Check if tonality should use dashed borders (minor tonalities)
     */
    isMinor: isMinorTonality,

    /**
     * Current theme info
     */
    theme: {
      isDark,
      current: currentTheme,
      name: isDark ? 'dark' : 'light'
    }
  }
}

/**
 * Hook for tonality badge styling
 * Provides consistent badge appearance across components
 */
export function useTonalityBadge(tonality: string | undefined | null) {
  const { getColor, getStyles, isMinor } = useTonalityTheme()

  if (!tonality) return null

  return {
    containerStyle: {
      ...getStyles(tonality, { 
        variant: 'fill', 
        alpha: 0.15,
        includeBorder: true,
        borderStyle: isMinor(tonality) ? 'dashed' : 'solid'
      }),
      borderRadius: '9999px',
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    textStyle: {
      color: getColor(tonality, 'label')
    },
    dotStyle: {
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      backgroundColor: getColor(tonality, 'stroke'),
      flexShrink: 0
    }
  }
}

/**
 * Hook for tonality selection styling
 * Optimized for selection interfaces and buttons
 */
export function useTonalitySelection(tonality: string | undefined | null, isSelected: boolean = false) {
  const { getColor, getStyles, isMinor } = useTonalityTheme()

  if (!tonality) return null

  return {
    containerStyle: {
      ...getStyles(tonality, {
        variant: isSelected ? 'fill' : 'stroke',
        alpha: isSelected ? 0.15 : 1,
        includeBorder: true,
        borderStyle: isMinor(tonality) ? 'dashed' : 'solid'
      }),
      backgroundColor: isSelected ? getColor(tonality, 'fill') : 'transparent',
      borderWidth: '2px',
      borderRadius: '0.75rem',
      padding: '0.5rem 0.75rem',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer'
    },
    textStyle: {
      color: isSelected ? getColor(tonality, 'label') : getColor(tonality, 'stroke'),
      fontWeight: isSelected ? '600' : '500'
    },
    hoverStyle: {
      backgroundColor: getColor(tonality, 'fill'),
      transform: 'scale(1.02)',
      boxShadow: `0 4px 12px ${getColor(tonality, 'stroke')}20`
    }
  }
}
