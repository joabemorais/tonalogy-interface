'use client'

import React from 'react'
import { CheckCircle, XCircle, AlertCircle, Music } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressionAnalysisResponse } from '@/types'
import { useTonalityTheme } from '@/hooks/use-tonality-theme'

interface AnalysisResultsProps {
  result: ProgressionAnalysisResponse | null
  error: string | null
}

export function AnalysisResults({ result, error }: AnalysisResultsProps) {
  const { getColor, getStyles, isMinor } = useTonalityTheme()

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

  const mainTonality = result.identified_tonality
  const strokeColor = mainTonality ? getColor(mainTonality, 'stroke') : undefined
  const fillColor = mainTonality ? getColor(mainTonality, 'fill') : undefined
  const labelColor = mainTonality ? getColor(mainTonality, 'label') : undefined

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
        <CardDescription className="flex items-center gap-2">
          {result.is_tonal_progression && mainTonality ? (
            <div className="flex items-center gap-2">
              <span>Tonal progression identified in</span>
              <div 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${fillColor}20`,
                  color: labelColor,
                  border: `1.5px ${isMinor(mainTonality) ? 'dashed' : 'solid'} ${strokeColor}`
                }}
              >
                <Music className="w-3.5 h-3.5" />
                {mainTonality}
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: strokeColor }}
                />
              </div>
            </div>
          ) : (
            'Non-tonal progression detected'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="p-4 bg-secondary/50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Status</div>
              <div className={`text-sm font-semibold ${result.is_tonal_progression ? 'text-green-600' : 'text-yellow-600'}`}>
                {result.is_tonal_progression ? 'Tonal' : 'Non-tonal'}
              </div>
            </div>
            {result.identified_tonality && (
              <div>
                <div className="text-sm font-medium mb-2">Identified Tonality</div>
                <div 
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-mono font-semibold"
                  style={{
                    backgroundColor: `${fillColor}15`,
                    color: labelColor,
                    border: `2px ${isMinor(mainTonality) ? 'dashed' : 'solid'} ${strokeColor}`
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: strokeColor }}
                  />
                  {result.identified_tonality}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Steps */}
        {result.explanation_details.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium">Analysis Steps</div>
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar-autohide">
              {result.explanation_details.map((step, index) => {
                const stepTonality = step.tonality_used_in_step
                const stepStrokeColor = stepTonality ? getColor(stepTonality, 'stroke') : undefined
                const stepFillColor = stepTonality ? getColor(stepTonality, 'fill') : undefined
                const stepLabelColor = stepTonality ? getColor(stepTonality, 'label') : undefined
                
                return (
                  <div key={index} className="analysis-step p-3 rounded-lg border bg-card/50">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="text-sm leading-relaxed">{step.observation}</div>
                        {step.formal_rule_applied && (
                          <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                            Rule: {step.formal_rule_applied}
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-1 flex-shrink-0">
                        {step.processed_chord && (
                          <div className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded">
                            {step.processed_chord}
                          </div>
                        )}
                        {stepTonality && (
                          <div 
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded"
                            style={{
                              backgroundColor: `${stepFillColor}20`,
                              color: stepLabelColor,
                              border: `1px ${isMinor(stepTonality) ? 'dashed' : 'solid'} ${stepStrokeColor}80`
                            }}
                          >
                            <div 
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: stepStrokeColor }}
                            />
                            {stepTonality}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
