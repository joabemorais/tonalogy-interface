'use client'

import React, { useState, useEffect } from 'react'
import { Download, Eye, Maximize2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DiagramThemeSelector } from '@/components/diagram-theme-selector'
import { useTheme } from 'next-themes'
import { useAnalysisStore } from '@/stores'

interface MultiThemeVisualizationDisplayProps {
  visualizations: {
    light?: string // Base64 encoded image
    dark?: string // Base64 encoded image
  }
}

export function MultiThemeVisualizationDisplay({ visualizations }: MultiThemeVisualizationDisplayProps) {
  const { theme: systemTheme } = useTheme()
  const { 
    diagramTheme, 
    followSystemTheme, 
    setDiagramTheme, 
    setFollowSystemTheme 
  } = useAnalysisStore()
  
  const lightAvailable = !!visualizations.light
  const darkAvailable = !!visualizations.dark
  
  // Determine the effective theme to display
  const effectiveTheme = followSystemTheme 
    ? (systemTheme === 'dark' ? 'dark' : 'light')
    : diagramTheme
  
  const currentVisualization = visualizations[effectiveTheme]
  
  // Auto-switch to available theme if current is not available
  useEffect(() => {
    if (!currentVisualization) {
      if (lightAvailable && effectiveTheme !== 'light') {
        if (!followSystemTheme) setDiagramTheme('light')
      } else if (darkAvailable && effectiveTheme !== 'dark') {
        if (!followSystemTheme) setDiagramTheme('dark')
      }
    }
  }, [currentVisualization, lightAvailable, darkAvailable, effectiveTheme, followSystemTheme, setDiagramTheme])

  // When system theme changes and we're following it, update the display
  useEffect(() => {
    if (followSystemTheme && systemTheme) {
      const newTheme = systemTheme === 'dark' ? 'dark' : 'light'
      // Only update if the visualization is available
      if ((newTheme === 'light' && lightAvailable) || (newTheme === 'dark' && darkAvailable)) {
        // No need to set anything, effectiveTheme will handle it
      }
    }
  }, [systemTheme, followSystemTheme, lightAvailable, darkAvailable])

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setDiagramTheme(theme)
  }

  const handleToggleFollowSystem = () => {
    if (followSystemTheme) {
      // Switching to manual mode - set current effective theme as the manual selection
      setDiagramTheme(effectiveTheme)
    } else {
      // Switching to follow system mode
      setFollowSystemTheme(true)
    }
  }

  const handleDownload = async () => {
    if (!currentVisualization) return

    try {
      const link = document.createElement('a')
      link.href = currentVisualization
      link.download = `tonalogy-visualization-${effectiveTheme}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleOpenInNewTab = () => {
    if (!currentVisualization) return
    
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Tonalogy Visualization - ${effectiveTheme} theme</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                background: ${effectiveTheme === 'dark' ? '#1a1a1a' : '#ffffff'};
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
              }
            </style>
          </head>
          <body>
            <img src="${currentVisualization}" alt="Tonalogy Harmonic Analysis Visualization (${effectiveTheme} theme)" />
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  if (!lightAvailable && !darkAvailable) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Harmonic Visualization
            </CardTitle>
            <CardDescription>
              Generated diagram showing tonal paths and modulations
              {lightAvailable && darkAvailable && ' - theme synced with your system preference'}
            </CardDescription>
          </div>
          
          {/* Theme selector for diagrams */}
          {(lightAvailable || darkAvailable) && (
            <DiagramThemeSelector
              selected={diagramTheme}
              onChange={handleThemeChange}
              lightAvailable={lightAvailable}
              darkAvailable={darkAvailable}
              followSystemTheme={followSystemTheme}
              onToggleFollowSystem={handleToggleFollowSystem}
            />
          )}
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              onClick={handleOpenInNewTab}
              variant="outline"
              className="gap-2 flex-1 sm:flex-none"
              disabled={!currentVisualization}
            >
              <Maximize2 className="h-4 w-4" />
              Full View
            </Button>
            
            <Button
              onClick={handleDownload}
              variant="outline" 
              className="gap-2 flex-1 sm:flex-none"
              disabled={!currentVisualization}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative bg-secondary/10 rounded-lg p-4 custom-scrollbar">
          <div className="flex justify-center">
            {currentVisualization ? (
              <img
                src={currentVisualization}
                alt={`Harmonic Analysis Visualization (${effectiveTheme} theme)`}
                className="max-w-full h-auto rounded-md shadow-sm"
                style={{ maxHeight: '500px' }}
                onError={(e) => {
                  console.error('Image load error:', e)
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No visualization available for {effectiveTheme} theme
              </div>
            )}
          </div>
          
          {/* Image metadata */}
          <div className="mt-4 text-xs text-muted-foreground text-center space-y-1">
            <div>
              Currently viewing: <strong>{effectiveTheme} theme</strong>
              {followSystemTheme && (
                <span className="text-primary"> (following system)</span>
              )}
              {lightAvailable && darkAvailable && (
                <span> • Available: light & dark themes</span>
              )}
            </div>
            <div>
              Click "Full View" to see the diagram in a larger window, or "Download" to save it as a PNG file.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
