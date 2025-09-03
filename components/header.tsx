'use client'

import React from 'react'
import { TonalogyIcon } from '@/components/ui/tonalogy-icon'

export function Header() {
  return (
    <div className="text-center space-y-4 py-8">
      <div className="flex justify-center">
        <div className="p-3 bg-primary/10 rounded-full">
          <TonalogyIcon size={32} className="text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Harmonic Analysis Tool
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analyze chord progressions using Kripke semantics and modal logic to understand 
          tonal characteristics and harmonic functions
        </p>
      </div>
      
      <div className="flex justify-center gap-4 text-sm text-muted-foreground">
        <span>✓ Real-time analysis</span>
        <span>✓ Visual diagrams</span>
        <span>✓ Detailed explanations</span>
      </div>
    </div>
  )
}
