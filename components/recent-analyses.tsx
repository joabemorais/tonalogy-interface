'use client'

import React from 'react'
import { Clock, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useHistoryStore } from '@/stores'
import { formatTimestamp } from '@/lib/utils'

export function RecentAnalyses() {
  const { getRecentAnalyses, toggleFavorite } = useHistoryStore()
  const recentAnalyses = getRecentAnalyses(5)

  if (recentAnalyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Analyses
          </CardTitle>
          <CardDescription>Your recent harmonic analyses will appear here</CardDescription>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Analyses
        </CardTitle>
        <CardDescription>Your recent harmonic analyses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentAnalyses.map((analysis) => (
          <div 
            key={analysis.id}
            className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-medium font-mono">
                    {analysis.chords.join(' - ')}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toggleFavorite(analysis.id)}
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
                
                <div className="text-xs text-muted-foreground">
                  {analysis.result.is_tonal_progression 
                    ? `✓ ${analysis.result.identified_tonality}`
                    : '✗ Non-tonal'
                  }
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(analysis.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
