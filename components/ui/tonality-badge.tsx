'use client'

import React from 'react'
import { Music } from 'lucide-react'
import { useTonalityTheme } from '@/hooks/use-tonality-theme'
import { cn } from '@/lib/utils'

interface TonalityBadgeProps {
  tonality: string | undefined | null
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'subtle'
  showIcon?: boolean
  showDot?: boolean
  className?: string
}

export function TonalityBadge({ 
  tonality, 
  size = 'md', 
  variant = 'default',
  showIcon = false,
  showDot = true,
  className 
}: TonalityBadgeProps) {
  const { getColor, isMinor } = useTonalityTheme()

  if (!tonality) return null

  const strokeColor = getColor(tonality, 'stroke')
  const fillColor = getColor(tonality, 'fill')
  const labelColor = getColor(tonality, 'label')
  const borderStyle = isMinor(tonality) ? 'dashed' : 'solid'

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: strokeColor,
          borderColor: strokeColor,
          borderWidth: '1.5px',
          borderStyle
        }
      case 'subtle':
        return {
          backgroundColor: `${fillColor}10`,
          color: labelColor,
          borderColor: `${strokeColor}30`,
          borderWidth: '1px',
          borderStyle
        }
      default:
        return {
          backgroundColor: `${fillColor}20`,
          color: labelColor,
          borderColor: strokeColor,
          borderWidth: '1.5px',
          borderStyle
        }
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200',
        'border hover:scale-105 active:scale-95',
        sizeClasses[size],
        className
      )}
      style={getVariantStyles()}
    >
      {showIcon && <Music className={iconSizes[size]} />}
      {showDot && (
        <div 
          className={cn('rounded-full flex-shrink-0', dotSizes[size])}
          style={{ backgroundColor: strokeColor }}
        />
      )}
      <span className="truncate font-mono">{tonality}</span>
    </span>
  )
}

interface TonalityIndicatorProps {
  tonality: string | undefined | null
  size?: number
  className?: string
}

export function TonalityIndicator({ tonality, size = 12, className }: TonalityIndicatorProps) {
  const { getColor, isMinor } = useTonalityTheme()

  if (!tonality) return null

  const strokeColor = getColor(tonality, 'stroke')
  const borderStyle = isMinor(tonality) ? 'dashed' : 'solid'

  return (
    <div
      className={cn('rounded-full flex-shrink-0', className)}
      style={{
        width: size,
        height: size,
        backgroundColor: strokeColor,
        border: `1px ${borderStyle} ${strokeColor}`,
        boxShadow: `0 0 0 1px ${strokeColor}20`
      }}
      title={tonality}
    />
  )
}

interface TonalityListProps {
  tonalities: string[]
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'subtle'
  className?: string
}

export function TonalityList({ 
  tonalities, 
  maxDisplay = 3, 
  size = 'sm',
  variant = 'subtle',
  className 
}: TonalityListProps) {
  if (tonalities.length === 0) return null

  const displayed = tonalities.slice(0, maxDisplay)
  const remaining = tonalities.length - maxDisplay

  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      {displayed.map((tonality, index) => (
        <TonalityBadge
          key={`${tonality}-${index}`}
          tonality={tonality}
          size={size}
          variant={variant}
          showDot={true}
        />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted/50 rounded-full">
          +{remaining} more
        </span>
      )}
    </div>
  )
}
