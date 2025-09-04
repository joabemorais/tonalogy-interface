// API Response Types based on Tonalogy API analysis
export interface ProgressionAnalysisRequest {
  chords: string[]
  tonalities_to_test?: string[]
  theme?: 'light' | 'dark'
}

export interface ExplanationStep {
  formal_rule_applied?: string
  observation: string
  processed_chord?: string
  tonality_used_in_step?: string
  evaluated_functional_state?: string
  rule_type?: string
  tonal_function?: string
  pivot_target_tonality?: string
  raw_tonality_used_in_step?: string
}

export interface ProgressionAnalysisResponse {
  is_tonal_progression: boolean
  identified_tonality?: string
  explanation_details: ExplanationStep[]
  error?: string
}

// UI State Types
export interface AnalysisState {
  isLoading: boolean
  result: ProgressionAnalysisResponse | null
  error: string | null
  chords: string[]
  visualizations: {
    light?: string // Base64 image or URL
    dark?: string // Base64 image or URL
  }
}

export interface ChordInput {
  id: string
  value: string
  isValid: boolean
}

export interface AnalysisHistory {
  id: string
  chords: string[]
  result: ProgressionAnalysisResponse
  timestamp: Date
  isFavorite: boolean
}

// Form Types
export interface AnalysisFormData {
  chords: string[]
  tonalities_to_test: string[]
  theme: 'light' | 'dark'
  language: 'en' | 'pt_br'
}

// API Client Types
export interface APIError {
  message: string
  status: number
  details?: any
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

// Language Types
export type Language = 'en' | 'pt_br'

// Common Props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Chord validation types
export interface ChordValidation {
  isValid: boolean
  message?: string
  suggestions?: string[]
}
