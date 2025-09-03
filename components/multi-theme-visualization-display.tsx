'use client'

import React, { useState } from 'react'
import { Download, Eye, Maximize2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DiagramThemeSelector } from '@/components/diagram-theme-selector'

interface MultiThemeVisualizationDisplayProps {
  visualizations: {
    light?: string // Base64 encoded image
    dark?: string // Base64 encoded image
  }
}

export function MultiThemeVisualizationDisplay({ visualizations }: MultiThemeVisualizationDisplayProps) {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>(() => {
    // Default to light if available, otherwise dark
    return visualizations.light ? 'light' : 'dark'
  })
  
  const currentVisualization = visualizations[selectedTheme]
  const lightAvailable = !!visualizations.light
  const darkAvailable = !!visualizations.dark
  
  // Auto-switch if current theme becomes unavailable
  React.useEffect(() => {
    if (!currentVisualization) {
      if (lightAvailable && selectedTheme !== 'light') {
        setSelectedTheme('light')
      } else if (darkAvailable && selectedTheme !== 'dark') {
        setSelectedTheme('dark')
      }
    }
  }, [currentVisualization, lightAvailable, darkAvailable, selectedTheme])

  const handleDownload = async () => {
    if (!currentVisualization) return

    try {
      const link = document.createElement('a')
      link.href = currentVisualization
      link.download = `tonalogy-visualization-${selectedTheme}-${Date.now()}.png`
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
            <title>Tonalogy Visualization - ${selectedTheme} theme</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                background: ${selectedTheme === 'dark' ? '#1a1a1a' : '#ffffff'};
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
            <img src="${currentVisualization}" alt="Tonalogy Harmonic Analysis Visualization (${selectedTheme} theme)" />
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
              {lightAvailable && darkAvailable && ' - switch between themes below'}
            </CardDescription>
          </div>
          
          {/* Theme selector for diagrams */}
          {lightAvailable && darkAvailable && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Diagram Theme</label>
              <DiagramThemeSelector
                selected={selectedTheme}
                onChange={setSelectedTheme}
                lightAvailable={lightAvailable}
                darkAvailable={darkAvailable}
              />
            </div>
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
                alt={`Harmonic Analysis Visualization (${selectedTheme} theme)`}
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
                No visualization available for {selectedTheme} theme
              </div>
            )}
          </div>
          
          {/* Image metadata */}
          <div className="mt-4 text-xs text-muted-foreground text-center space-y-1">
            <div>
              Currently viewing: <strong>{selectedTheme} theme</strong>
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
