'use client'

import React from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressionAnalysisResponse } from '@/types'

interface AnalysisResultsProps {
  result: ProgressionAnalysisResponse | null
  error: string | null
}

export function AnalysisResults({ result, error }: AnalysisResultsProps) {
  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Analysis Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!result) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {result.is_tonal_progression ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          )}
          Analysis Results
        </CardTitle>
        <CardDescription>
          {result.is_tonal_progression 
            ? `Tonal progression identified in ${result.identified_tonality}`
            : 'Non-tonal progression detected'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="p-4 bg-secondary/50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Status</div>
              <div className={`text-sm ${result.is_tonal_progression ? 'text-green-600' : 'text-yellow-600'}`}>
                {result.is_tonal_progression ? 'Tonal' : 'Non-tonal'}
              </div>
            </div>
            {result.identified_tonality && (
              <div>
                <div className="text-sm font-medium">Identified Tonality</div>
                <div className="text-sm font-mono">{result.identified_tonality}</div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Steps */}
        {result.explanation_details.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Analysis Steps</div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {result.explanation_details.map((step, index) => (
                <div key={index} className="analysis-step">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className="text-sm">{step.observation}</div>
                      {step.formal_rule_applied && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Rule: {step.formal_rule_applied}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {step.processed_chord && (
                        <div className="font-mono">{step.processed_chord}</div>
                      )}
                      {step.tonality_used_in_step && (
                        <div>{step.tonality_used_in_step}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
