'use client'

import React from 'react'
import { TonalityBadge } from '@/components/ui/tonality-badge'
import { getAllTonalities } from '@/lib/tonality-colors'
import { useTheme } from 'next-themes'

export function TonalityTest() {
  const { theme } = useTheme()
  const currentTheme = theme === 'system' ? 'light' : theme
  const tonalities = getAllTonalities(currentTheme as 'light' | 'dark')

  const majorTonalities = tonalities.filter(t => t.includes('Major'))
  const minorTonalities = tonalities.filter(t => t.includes('minor'))

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Tonality Color Test</h2>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Major Tonalities ({majorTonalities.length})</h3>
        <div className="flex flex-wrap gap-2">
          {majorTonalities.map(tonality => (
            <TonalityBadge key={tonality} tonality={tonality} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Minor Tonalities ({minorTonalities.length})</h3>
        <div className="flex flex-wrap gap-2">
          {minorTonalities.map(tonality => (
            <TonalityBadge key={tonality} tonality={tonality} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Parallel Relationships</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['C Major', 'A minor'],
            ['F Major', 'D minor'],
            ['D Major', 'B minor'],
            ['G Major', 'E minor'],
            ['A Major', 'F# minor'],
            ['E Major', 'C# minor'],
            ['B Major', 'G# minor'],
            ['Bb Major', 'G minor'],
            ['Eb Major', 'C minor'],
            ['Ab Major', 'F minor'],
            ['Db Major', 'Bb minor'],
            ['F# Major', 'D# minor']
          ].map(([major, minor]) => (
            <div key={`${major}-${minor}`} className="flex items-center gap-2 p-2 border rounded">
              <TonalityBadge tonality={major} size="sm" />
              <span className="text-sm text-muted-foreground">=</span>
              <TonalityBadge tonality={minor} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
