'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Star, RotateCcw, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useHistoryStore, useAnalysisStore } from '@/stores'
import { formatTimestamp } from '@/lib/utils'
import { ClientOnly } from '@/components/client-only'
import type { AnalysisHistory } from '@/types'

function RecentAnalysesContent() {
  const { getRecentAnalyses, toggleFavorite } = useHistoryStore()
  const { setResult, setVisualization, setChords } = useAnalysisStore()
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisHistory[]>([])

  useEffect(() => {
    // Initial load
    const updateAnalyses = () => {
      setRecentAnalyses(getRecentAnalyses(8)) // Show more items in sidebar
    }
    
    updateAnalyses()
    
    // Listen for store changes (if needed)
    const unsubscribe = useHistoryStore.subscribe?.(updateAnalyses)
    
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [getRecentAnalyses])

  const handleLoadAnalysis = (analysis: AnalysisHistory) => {
    // Load the analysis result and chords into the current state
    setResult(analysis.result)
    setChords(analysis.chords) // Update the chords as well
    // Clear any existing visualizations since we're loading a different analysis
    setVisualization('light', null)
    setVisualization('dark', null)
    
    // Scroll to top to show the loaded analysis
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (recentAnalyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Analyses
          </CardTitle>
          <CardDescription>Your recent harmonic analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No analyses yet. Start by analyzing a chord progression!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Analyses
        </CardTitle>
        <CardDescription>Click any analysis to load it</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentAnalyses.map((analysis) => (
          <div 
            key={analysis.id}
            className="group p-3 border rounded-lg hover:bg-accent/50 transition-all cursor-pointer hover:shadow-sm"
            onClick={() => handleLoadAnalysis(analysis)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-medium font-mono truncate">
                    {analysis.chords.join(' → ')}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(analysis.id)
                    }}
                  >
                    <Star 
                      className={`h-3 w-3 ${
                        analysis.isFavorite 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mb-1">
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    analysis.result.is_tonal_progression 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {analysis.result.is_tonal_progression 
                      ? `✓ ${analysis.result.identified_tonality}`
                      : '✗ Non-tonal'
                    }
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(analysis.timestamp)}
                </div>
                
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <RotateCcw className="h-3 w-3" />
                  <span className="text-xs">Click to load</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {recentAnalyses.length > 0 && (
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={() => window.location.href = '/history'}
            >
              <ExternalLink className="h-3 w-3" />
              View All History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RecentAnalyses() {
  return (
    <ClientOnly>
      <RecentAnalysesContent />
    </ClientOnly>
  )
}
