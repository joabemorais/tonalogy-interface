'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Music, Play, Download, RefreshCw, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VisualChordInput } from '@/components/visual-chord-input'
import { TonalitySelector } from '@/components/tonality-selector'
import { AnalysisResults } from '@/components/analysis-results'
import { VisualizationMode } from '@/components/visualization-mode'
import { MultiThemeVisualizationDisplay } from '@/components/multi-theme-visualization-display'
import { useAnalysisStore, useHistoryStore, useSettingsStore } from '@/stores'
import { useIsMobile } from '@/hooks/use-mobile'
import { apiClient } from '@/lib/api-client'
import { validateChords, downloadBlob, blobToBase64, normalizeChordsForAPI } from '@/lib/utils'
import { ProgressionAnalysisRequest, ProgressionAnalysisResponse } from '@/types'

export function HarmonicAnalyzer() {
  const [tonalities, setTonalities] = useState<string[]>([])
  const [isGeneratingVisualization, setIsGeneratingVisualization] = useState(false)
  const [isTonalitySectionOpen, setIsTonalitySectionOpen] = useState(false)
  
  const isMobile = useIsMobile()
  const { language } = useSettingsStore()
  const { setLoading, setResult, setError, setVisualizationError, setVisualization, setChords, result, error, isLoading, visualizations, chords } = useAnalysisStore()
  const { addToHistory } = useHistoryStore()

  // Analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async (request: ProgressionAnalysisRequest): Promise<ProgressionAnalysisResponse> => {
      return apiClient.analyzeProgression(request, language)
    },
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: (data) => {
      setResult(data)
      setLoading(false)
      
      // Add to history if analysis was successful
      if (data.is_tonal_progression) {
        addToHistory({
          chords,
          result: data,
          isFavorite: false
        })
      }
    },
    onError: (error: any) => {
      setError(error.message || 'Analysis failed')
      setLoading(false)
    }
  })

  // Generate visualization for specific theme
  const generateVisualization = async (theme: 'light' | 'dark') => {
    const validation = validateChords(chords)
    
    if (!validation.allValid) {
      setVisualizationError('Please fix invalid chords before generating visualization')
      return
    }

    const request: ProgressionAnalysisRequest = {
      chords: normalizeChordsForAPI(validation.validChords),
      tonalities_to_test: tonalities,
      theme
    }

    try {
      const blob = await apiClient.visualizeProgression(request, language)
      const base64 = await blobToBase64(blob)
      setVisualization(theme, base64)
      // Clear any previous visualization errors on success
      if (error && error.includes('visualization')) {
        setVisualizationError(null)
      }
    } catch (error: any) {
      setVisualizationError(error.message || `Failed to generate ${theme} visualization`)
    }
  }

  const handleAnalyze = () => {
    const validation = validateChords(chords)
    
    if (!validation.allValid) {
      setError('Please fix invalid chords before analyzing')
      return
    }

    // Clear previous visualizations when starting new analysis
    setVisualization('light', null)
    setVisualization('dark', null)

    const request: ProgressionAnalysisRequest = {
      chords: normalizeChordsForAPI(validation.validChords),
      tonalities_to_test: tonalities,
      theme: 'light' // Default theme for analysis, visualization is separate
    }

    analysisMutation.mutate(request)
  }

  const handleGenerateBoth = async () => {
    if (!result?.is_tonal_progression) {
      setVisualizationError('Cannot visualize non-tonal progression')
      return
    }

    setIsGeneratingVisualization(true)
    setVisualizationError(null)
    
    try {
      // Generate both themes in parallel
      await Promise.all([
        generateVisualization('light'),
        generateVisualization('dark')
      ])
    } finally {
      setIsGeneratingVisualization(false)
    }
  }

  const handleGenerateLight = async () => {
    if (!result?.is_tonal_progression) {
      setVisualizationError('Cannot visualize non-tonal progression')
      return
    }

    setIsGeneratingVisualization(true)
    setVisualizationError(null)
    
    try {
      await generateVisualization('light')
    } finally {
      setIsGeneratingVisualization(false)
    }
  }

  const handleGenerateDark = async () => {
    if (!result?.is_tonal_progression) {
      setVisualizationError('Cannot visualize non-tonal progression')
      return
    }

    setIsGeneratingVisualization(true)
    setVisualizationError(null)
    
    try {
      await generateVisualization('dark')
    } finally {
      setIsGeneratingVisualization(false)
    }
  }

  const handleDownload = async () => {
    const currentVisualization = visualizations.light || visualizations.dark
    if (!currentVisualization) return

    try {
      const response = await fetch(currentVisualization)
      const blob = await response.blob()
      const normalizedChords = normalizeChordsForAPI(chords)
      const filename = `tonalogy-${normalizedChords.join('_')}-${Date.now()}.png`
      downloadBlob(blob, filename)
    } catch (error) {
      setVisualizationError('Failed to download visualization')
    }
  }

  const handleReset = () => {
    setChords(['C', 'Am', 'F', 'G'])
    setTonalities([])
    setResult(null)
    setError(null)
    setVisualization('light', null)
    setVisualization('dark', null)
  }

  const hasAnyVisualization = !!(visualizations.light || visualizations.dark)
  const hasBothVisualizations = !!(visualizations.light && visualizations.dark)
  
  // Show generation section only if:
  // 1. Analysis is tonal AND
  // 2. Don't have both visualizations yet
  const showGenerationSection = result?.is_tonal_progression && !hasBothVisualizations

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Harmonic Analysis
          </CardTitle>
          <CardDescription>
            Enter a chord progression to analyze its tonal characteristics using Kripke semantics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chord Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Chord Progression</label>
            {!isMobile && chords.length > 1 && (
              <p className="text-xs text-muted-foreground">
                Click to edit • Hover to remove
              </p>
            )}
            <VisualChordInput 
              chords={chords}
              onChange={setChords}
              disabled={isLoading}
            />
          </div>

          {/* Tonality Selection - Accordion */}
          <div className="space-y-2">
            <button
              onClick={() => setIsTonalitySectionOpen(!isTonalitySectionOpen)}
              className="w-full flex items-center justify-between text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:text-primary"
            >
              <div className="flex items-center gap-2">
                {isTonalitySectionOpen ? (
                  <ChevronUp className="h-5 w-5 transition-transform" />
                ) : (
                  <ChevronDown className="h-5 w-5 transition-transform" />
                )}
                <span>Tonalities to Test</span>
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                {tonalities.length > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                    {tonalities.length} selected
                  </span>
                )}
              </div>
            </button>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isTonalitySectionOpen 
                ? 'max-h-[600px] opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              <div className="pt-2">
                <TonalitySelector
                  selected={tonalities}
                  onChange={setTonalities}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleAnalyze}
              disabled={isLoading || chords.length === 0}
              className="flex-1"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Analyze
            </Button>

            {hasAnyVisualization && (
              <Button
                onClick={handleDownload}
                variant="outline"
                size="icon"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}

            <Button
              onClick={handleReset}
              variant="ghost"
              size="icon"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {(result || error) && (
        <AnalysisResults 
          result={result}
          error={error}
        />
      )}

      {/* Visualization Generation Section */}
      {showGenerationSection && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Generate Diagram
            </CardTitle>
            <CardDescription>
              Create visual diagrams showing tonal paths and modulations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VisualizationMode
              onGenerateBoth={handleGenerateBoth}
              onGenerateLight={handleGenerateLight}
              onGenerateDark={handleGenerateDark}
              isLoading={isGeneratingVisualization}
              disabled={!result?.is_tonal_progression}
              availableThemes={{
                light: !!visualizations.light,
                dark: !!visualizations.dark
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Visualization Display Section */}
      {hasAnyVisualization && (
        <MultiThemeVisualizationDisplay visualizations={visualizations} />
      )}
    </div>
  )
}
