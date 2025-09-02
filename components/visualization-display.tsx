'use client'

import React from 'react'
import { Download, Eye, Maximize2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface VisualizationDisplayProps {
  imageData: string // Base64 encoded image
  theme: 'light' | 'dark'
}

export function VisualizationDisplay({ imageData, theme }: VisualizationDisplayProps) {
  const handleDownload = async () => {
    try {
      const link = document.createElement('a')
      link.href = imageData
      link.download = `tonalogy-visualization-${theme}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleOpenInNewTab = () => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Tonalogy Visualization</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
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
            <img src="${imageData}" alt="Tonalogy Harmonic Analysis Visualization" />
          </body>
        </html>
      `)
      newWindow.document.close()
    }
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
              Generated diagram showing tonal paths and modulations ({theme} theme)
            </CardDescription>
          </div>
          
          {/* Responsive button layout */}
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              onClick={handleOpenInNewTab}
              variant="outline"
              className="gap-2 flex-1 sm:flex-none"
            >
              <Maximize2 className="h-4 w-4" />
              Full View
            </Button>
            
            <Button
              onClick={handleDownload}
              variant="outline" 
              className="gap-2 flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative bg-secondary/10 rounded-lg p-4">
          <div className="flex justify-center">
            <img
              src={imageData}
              alt="Harmonic Analysis Visualization"
              className="max-w-full h-auto rounded-md shadow-sm"
              style={{ maxHeight: '500px' }}
              onError={(e) => {
                console.error('Image load error:', e)
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
          
          {/* Image metadata */}
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Click "Full View" to see the diagram in a larger window, or "Download" to save it as a PNG file.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
