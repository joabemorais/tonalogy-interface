'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { Music, Play, Download, RefreshCw, Eye, ChevronDown, ChevronUp, Clock } from 'lucide-react'
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
  const pathname = usePathname()
  const isOnHistoryPage = pathname === '/history'
  const isOnSettingsPage = pathname === '/settings'
  const shouldDisableHistoryButton = isOnHistoryPage || isOnSettingsPage
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Music className="h-8 w-8" />
          Harmonic Analysis
        </h1>
        <p className="text-muted-foreground">
          Enter a chord progression to analyze its tonal characteristics using Kripke semantics
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Music className="h-5 w-5" />
                Chord Progression
              </CardTitle>
              <CardDescription>
                Build your progression and configure analysis settings
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Toggle sidebar to show history
                const event = new CustomEvent('toggleSidebar')
                window.dispatchEvent(event)
              }}
              disabled={shouldDisableHistoryButton}
              className="text-xs gap-1.5 h-8 px-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                isOnHistoryPage 
                  ? "Already on history page" 
                  : isOnSettingsPage 
                  ? "Already on settings page"
                  : "View analysis history"
              }
            >
              <Clock className="h-4 w-4" />
              History
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chord Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Chords</h3>
              {!isMobile && chords.length > 1 && (
                <p className="text-xs text-muted-foreground">
                  Click to edit • Hover to remove
                </p>
              )}
            </div>
            <VisualChordInput 
              chords={chords}
              onChange={setChords}
              disabled={isLoading}
            />
          </div>

          {/* Tonality Selection - Accordion */}
          <div className="space-y-0">
            <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${
              isTonalitySectionOpen ? 'bg-muted/20' : 'bg-muted/30'
            }`}>
              <button
                onClick={() => setIsTonalitySectionOpen(!isTonalitySectionOpen)}
                className={`w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors focus:outline-none ${
                  isTonalitySectionOpen ? 'border-b border-border/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {isTonalitySectionOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                  )}
                  <div className="text-left">
                    <h3 className="text-sm font-medium">Tonalities to Test</h3>
                    <p className="text-xs text-muted-foreground">Optional - Restrict analysis to specific keys</p>
                  </div>
                </div>
                {tonalities.length > 0 && (
                  <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full font-medium">
                    {tonalities.length} selected
                  </span>
                )}
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${
                isTonalitySectionOpen 
                  ? 'max-h-[600px] opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="px-3 pb-3 pt-2 bg-background/50">
                  <TonalitySelector
                    selected={tonalities}
                    onChange={setTonalities}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t">
            <Button 
              onClick={handleAnalyze}
              disabled={isLoading || chords.length === 0}
              className="w-full h-10"
              size="lg"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Analyze Progression
            </Button>

            {(hasAnyVisualization || true) && (
              <div className="flex gap-2">
                {hasAnyVisualization && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex-1 h-10"
                    title="Download visualization"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}

                <Button
                  onClick={handleReset}
                  variant="ghost"
                  className={`h-10 ${hasAnyVisualization ? 'flex-1' : 'w-full'}`}
                  title="Reset to default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            )}
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
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5" />
              Visual Diagram Generation
            </CardTitle>
            <CardDescription>
              Your progression is tonal! Generate visual diagrams showing harmonic paths and modulations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Tonal Progression Detected
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                    This progression follows tonal principles and can be visualized as a harmonic graph
                  </p>
                </div>
              </div>
            </div>
            
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
