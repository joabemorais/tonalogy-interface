'use client'

import React from 'react'
import { HarmonicAnalyzer } from '@/components/harmonic-analyzer'
import { RecentAnalyses } from '@/components/recent-analyses'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Tonalogy Interface
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Análise harmônica avançada de progressões musicais usando lógica modal e semântica de Kripke
        </p>
      </div> */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HarmonicAnalyzer />
        </div>
        <div className="lg:col-span-1">
          <RecentAnalyses />
        </div>
      </div>
    </div>
  )
}
