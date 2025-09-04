/**
 * Tonality Color System for Harmonic Analysis
 * A sophisticated color palette designed for both light and dark themes
 */

export interface TonalityColorScheme {
  stroke: string
  fill: string
  label: string
}

export interface TonalityColorPalette {
  [key: string]: TonalityColorScheme
}

// Light Theme Tonality Colors
export const LIGHT_TONALITY_COLORS: TonalityColorPalette = {
  'C Major': { stroke: '#4dabf7', fill: '#a5d8ff', label: '#1971c2' },
  'C# Major': { stroke: '#5BC3BA', fill: '#ACE5DD', label: '#248883' },
  'Db Major': { stroke: '#5BC3BA', fill: '#ACE5DD', label: '#248883' },
  'D Major': { stroke: '#69db7c', fill: '#b2f2bb', label: '#2f9e44' },
  'D# Major': { stroke: '#B4D85C', fill: '#D9EFAA', label: '#909522' },
  'Eb Major': { stroke: '#B4D85C', fill: '#D9EFAA', label: '#909522' },
  'E Major': { stroke: '#ffd43b', fill: '#ffec99', label: '#f08c00' },
  'F Major': { stroke: '#ffa94d', fill: '#ffd8a8', label: '#e8590c' },
  'F# Major': { stroke: '#FF986A', fill: '#FFD1B9', label: '#E4451F' },
  'Gb Major': { stroke: '#FF986A', fill: '#FFD1B9', label: '#E4451F' },
  'G Major': { stroke: '#ff8787', fill: '#ffc9c9', label: '#e03131' },
  'G# Major': { stroke: '#FB859A', fill: '#FEC6D0', label: '#D12B47' },
  'Ab Major': { stroke: '#FB859A', fill: '#FEC6D0', label: '#D12B47' },
  'A Major': { stroke: '#f783ac', fill: '#fcc2d7', label: '#c2255c' },
  'A# Major': { stroke: '#E97DCF', fill: '#F5C0E9', label: '#AF2E89' },
  'Bb Major': { stroke: '#E97DCF', fill: '#F5C0E9', label: '#AF2E89' },
  'B Major': { stroke: '#da77f2', fill: '#eebefa', label: '#9c36b5' }
}

// Dark Theme Tonality Colors  
export const DARK_TONALITY_COLORS: TonalityColorPalette = {
  'C Major': { stroke: '#56a2e8', fill: '#154163', label: '#74b9ff' },
  'C# Major': { stroke: '#479d99', fill: '#0d3e37', label: '#6bccc7' },
  'Db Major': { stroke: '#479d99', fill: '#0d3e37', label: '#6bccc7' },
  'D Major': { stroke: '#3a994c', fill: '#0d3712', label: '#51cf66' },
  'D# Major': { stroke: '#797d1a', fill: '#2b2f00', label: '#a3a821' },
  'Eb Major': { stroke: '#797d1a', fill: '#2b2f00', label: '#a3a821' },
  'E Major': { stroke: '#d69e2e', fill: '#5f3a00', label: '#fcc419' },
  'F Major': { stroke: '#f17634', fill: '#4d2b02', label: '#ff8c42' },
  'F# Major': { stroke: '#ff7c5c', fill: '#a14922', label: '#ff9472' },
  'Gb Major': { stroke: '#ff7c5c', fill: '#a14922', label: '#ff9472' },
  'G Major': { stroke: '#ff8383', fill: '#5b2c2c', label: '#ff9999' },
  'G# Major': { stroke: '#ff8ac9', fill: '#cc59a2', label: '#ffa8d4' },
  'Ab Major': { stroke: '#ff8ac9', fill: '#cc59a2', label: '#ffa8d4' },
  'A Major': { stroke: '#ff92ff', fill: '#e466f7', label: '#ffb3ff' },
  'A# Major': { stroke: '#db9cff', fill: '#3a2f56', label: '#e5b3ff' },
  'Bb Major': { stroke: '#db9cff', fill: '#3a2f56', label: '#e5b3ff' },
  'B Major': { stroke: '#b0a7ff', fill: '#8385fd', label: '#c7c2ff' }
}

/**
 * Get tonality color based on theme and variant
 */
export function getTonalityColor(
  tonality: string | undefined | null,
  variant: 'stroke' | 'fill' | 'label',
  theme: 'light' | 'dark' = 'light'
): string {
  if (!tonality) return theme === 'dark' ? '#666666' : '#999999'
  
  const palette = theme === 'dark' ? DARK_TONALITY_COLORS : LIGHT_TONALITY_COLORS
  const colors = palette[tonality]
  
  if (!colors) {
    // Fallback colors for unknown tonalities
    return theme === 'dark' ? '#666666' : '#999999'
  }
  
  return colors[variant]
}

/**
 * Check if a tonality is minor (for dashed border styling)
 */
export function isMinorTonality(tonality: string | undefined | null): boolean {
  if (!tonality) return false
  return tonality.toLowerCase().includes('minor') || tonality.toLowerCase().includes('m ')
}

/**
 * Get all available tonalities
 */
export function getAllTonalities(theme: 'light' | 'dark' = 'light'): string[] {
  const palette = theme === 'dark' ? DARK_TONALITY_COLORS : LIGHT_TONALITY_COLORS
  return Object.keys(palette)
}

/**
 * Generate CSS style object for tonality theming
 */
export function getTonalityStyles(
  tonality: string | undefined | null,
  theme: 'light' | 'dark' = 'light',
  options: {
    variant?: 'stroke' | 'fill' | 'label'
    alpha?: number
    includeHover?: boolean
    includeBorder?: boolean
    borderStyle?: 'solid' | 'dashed'
  } = {}
): React.CSSProperties {
  const {
    variant = 'stroke',
    alpha = 1,
    includeHover = false,
    includeBorder = false,
    borderStyle = isMinorTonality(tonality) ? 'dashed' : 'solid'
  } = options

  if (!tonality) return {}

  const color = getTonalityColor(tonality, variant, theme)
  const strokeColor = getTonalityColor(tonality, 'stroke', theme)
  
  const styles: React.CSSProperties = {}

  if (variant === 'fill') {
    styles.backgroundColor = alpha < 1 ? `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` : color
  } else if (variant === 'label') {
    styles.color = color
  }

  if (includeBorder) {
    styles.borderColor = strokeColor
    styles.borderStyle = borderStyle
    styles.borderWidth = '2px'
  }

  return styles
}

/**
 * Generate Tailwind-compatible color variables
 */
export function getTonalityTailwindVars(
  tonality: string | undefined | null,
  theme: 'light' | 'dark' = 'light'
): Record<string, string> {
  if (!tonality) return {}

  const colors = theme === 'dark' ? DARK_TONALITY_COLORS[tonality] : LIGHT_TONALITY_COLORS[tonality]
  if (!colors) return {}

  return {
    '--tonality-stroke': colors.stroke,
    '--tonality-fill': colors.fill,
    '--tonality-label': colors.label
  }
}
