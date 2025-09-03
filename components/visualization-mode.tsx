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
}

export function VisualizationMode({ 
  onGenerateBoth, 
  onGenerateLight, 
  onGenerateDark, 
  isLoading, 
  disabled 
}: VisualizationModeProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">Generate Visualization</div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={onGenerateBoth}
          disabled={disabled || isLoading}
          className="gap-2 flex-1"
          variant="default"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Palette className="h-4 w-4" />
          )}
          Both Themes
        </Button>
        
        <Button 
          onClick={onGenerateLight}
          disabled={disabled || isLoading}
          variant="outline"
          className="gap-2 flex-1 sm:flex-none"
        >
          <Sun className="h-4 w-4" />
          Light Only
        </Button>
        
        <Button 
          onClick={onGenerateDark}
          disabled={disabled || isLoading}
          variant="outline"
          className="gap-2 flex-1 sm:flex-none"
        >
          <Moon className="h-4 w-4" />
          Dark Only
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Recommended: Generate both themes for complete flexibility
      </div>
    </div>
  )
}
