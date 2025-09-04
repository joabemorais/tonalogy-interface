'use client'

import { History, Star, Clock, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useHistoryStore } from '@/stores'
import { formatTimestamp } from '@/lib/utils'

export default function HistoryPage() {
  const { history, removeFromHistory, toggleFavorite, clearHistory } = useHistoryStore()

  const favoriteAnalyses = history.filter(analysis => analysis.isFavorite)
  const recentAnalyses = history.filter(analysis => !analysis.isFavorite)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <History className="h-8 w-8" />
          Analysis History
        </h1>
        <p className="text-muted-foreground">
          View and manage your harmonic progression analyses
        </p>
      </div>

      {/* Actions */}
      {history.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={clearHistory}
            variant="outline"
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        </div>
      )}

      {/* Favorites */}
      {favoriteAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Favorite Analyses
            </CardTitle>
            <CardDescription>Your starred harmonic progressions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {favoriteAnalyses.map((analysis) => (
              <AnalysisItem
                key={analysis.id}
                analysis={analysis}
                onRemove={removeFromHistory}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Analyses
          </CardTitle>
          <CardDescription>
            {recentAnalyses.length > 0 
              ? `${recentAnalyses.length} recent analyses`
              : 'No analyses yet'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAnalyses.length > 0 ? (
            recentAnalyses.map((analysis) => (
              <AnalysisItem
                key={analysis.id}
                analysis={analysis}
                onRemove={removeFromHistory}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No analyses in your history yet.</p>
              <p className="text-sm">Start by analyzing a chord progression!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AnalysisItem({ analysis, onRemove, onToggleFavorite }: any) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="font-mono text-lg font-medium">
            {analysis.chords.join(' → ')}
          </div>
          <div className={`text-sm px-2 py-1 rounded ${
            analysis.result.is_tonal_progression 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {analysis.result.is_tonal_progression ? 'Tonal' : 'Non-tonal'}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          {analysis.result.identified_tonality && (
            <div>Tonality: {analysis.result.identified_tonality}</div>
          )}
          <div>Analyzed: {formatTimestamp(analysis.timestamp)}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onToggleFavorite(analysis.id)}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Star 
            className={`h-4 w-4 ${
              analysis.isFavorite 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground'
            }`} 
          />
        </Button>
        
        <Button
          onClick={() => onRemove(analysis.id)}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
