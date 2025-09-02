'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Music, Play, Download, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChordInput } from '@/components/chord-input'
import { TonalitySelector } from '@/components/tonality-selector'
import { ThemeSelector } from '@/components/theme-selector'
import { AnalysisResults } from '@/components/analysis-results'
import { VisualizationDisplay } from '@/components/visualization-display'
import { useAnalysisStore, useHistoryStore, useSettingsStore } from '@/stores'
import { apiClient } from '@/lib/api-client'
import { validateChords, downloadBlob, blobToBase64 } from '@/lib/utils'
import { ProgressionAnalysisRequest, ProgressionAnalysisResponse } from '@/types'

export function HarmonicAnalyzer() {
  const [chords, setChords] = useState<string[]>(['C', 'Am', 'F', 'G'])
  const [tonalities, setTonalities] = useState<string[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const { language } = useSettingsStore()
  const { setLoading, setResult, setError, setVisualization, result, error, isLoading, visualization } = useAnalysisStore()
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

  // Visualization mutation
  const visualizationMutation = useMutation({
    mutationFn: async (request: ProgressionAnalysisRequest): Promise<string> => {
      const blob = await apiClient.visualizeProgression(request, language)
      return blobToBase64(blob)
    },
    onSuccess: (base64) => {
      setVisualization(base64)
    },
    onError: (error: any) => {
      setError(error.message || 'Visualization failed')
    }
  })

  const handleAnalyze = () => {
    const validation = validateChords(chords)
    
    if (!validation.allValid) {
      setError('Please fix invalid chords before analyzing')
      return
    }

    const request: ProgressionAnalysisRequest = {
      chords: validation.validChords,
      tonalities_to_test: tonalities,
      theme
    }

    analysisMutation.mutate(request)
  }

  const handleVisualize = () => {
    if (!result?.is_tonal_progression) {
      setError('Cannot visualize non-tonal progression')
      return
    }

    const validation = validateChords(chords)
    
    if (!validation.allValid) {
      setError('Please fix invalid chords before visualizing')
      return
    }

    const request: ProgressionAnalysisRequest = {
      chords: validation.validChords,
      tonalities_to_test: tonalities,
      theme
    }

    visualizationMutation.mutate(request)
  }

  const handleDownload = async () => {
    if (!visualization) return

    try {
      const response = await fetch(visualization)
      const blob = await response.blob()
      const filename = `tonalogy-${chords.join('_')}-${Date.now()}.png`
      downloadBlob(blob, filename)
    } catch (error) {
      setError('Failed to download visualization')
    }
  }

  const handleReset = () => {
    setChords(['C', 'Am', 'F', 'G'])
    setTonalities([])
    setResult(null)
    setError(null)
    setVisualization(null)
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Harmonic Progression Analysis
          </CardTitle>
          <CardDescription>
            Enter a chord progression to analyze its tonal characteristics using Kripke semantics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chord Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Chord Progression</label>
            <ChordInput 
              chords={chords}
              onChange={setChords}
              disabled={isLoading}
            />
          </div>

          {/* Tonality Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tonalities to Test (Optional)</label>
            <TonalitySelector
              selected={tonalities}
              onChange={setTonalities}
              disabled={isLoading}
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Visualization Theme</label>
            <ThemeSelector
              selected={theme}
              onChange={setTheme}
              disabled={isLoading}
            />
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
            
            <Button
              onClick={handleVisualize}
              disabled={!result?.is_tonal_progression || visualizationMutation.isPending}
              variant="outline"
            >
              {visualizationMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                'Visualize'
              )}
            </Button>

            {visualization && (
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

      {/* Visualization Section */}
      {visualization && (
        <VisualizationDisplay 
          imageData={visualization}
          theme={theme}
        />
      )}
    </div>
  )
}
