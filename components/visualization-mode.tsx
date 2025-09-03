'use client'

import React from 'react'
import { Sun, Moon, Palette, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VisualizationModeProps {
  onGenerateBoth: () => void
  onGenerateLight: () => void
  onGenerateDark: () => void
  isLoading: boolean
  disabled: boolean
  availableThemes: {
    light: boolean
    dark: boolean
  }
}

export function VisualizationMode({ 
  onGenerateBoth, 
  onGenerateLight, 
  onGenerateDark, 
  isLoading, 
  disabled,
  availableThemes
}: VisualizationModeProps) {
  const bothAvailable = availableThemes.light && availableThemes.dark
  const hasAnyTheme = availableThemes.light || availableThemes.dark

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">Generate Visualization</div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={onGenerateBoth}
          disabled={disabled || isLoading || bothAvailable}
          className="gap-2 flex-1"
          variant={bothAvailable ? "outline" : "default"}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Palette className="h-4 w-4" />
          )}
          Both Themes
          {bothAvailable && (
            <span className="text-xs opacity-70">(Generated)</span>
          )}
        </Button>
        
        <Button 
          onClick={onGenerateLight}
          disabled={disabled || isLoading || availableThemes.light}
          variant="outline"
          className="gap-2 flex-1 sm:flex-none"
        >
          <Sun className="h-4 w-4" />
          Light Only
          {availableThemes.light && (
            <span className="text-xs opacity-70">(Generated)</span>
          )}
        </Button>
        
        <Button 
          onClick={onGenerateDark}
          disabled={disabled || isLoading || availableThemes.dark}
          variant="outline"
          className="gap-2 flex-1 sm:flex-none"
        >
          <Moon className="h-4 w-4" />
          Dark Only
          {availableThemes.dark && (
            <span className="text-xs opacity-70">(Generated)</span>
          )}
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {bothAvailable ? (
          "Both themes generated! Switch between them in the diagram section below."
        ) : hasAnyTheme ? (
          "Generate the missing theme or both themes for complete flexibility."
        ) : (
          "Recommended: Generate both themes for complete flexibility"
        )}
      </div>
    </div>
  )
}
