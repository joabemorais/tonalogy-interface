'use client'

import React from 'react'
import { HarmonicAnalyzer } from '@/components/harmonic-analyzer'
import { RecentAnalyses } from '@/components/recent-analyses'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-3">
          <HarmonicAnalyzer />
        </div>
        
        {/* Right Sidebar */}
        <div className="xl:col-span-1">
          <RecentAnalyses />
        </div>
      </div>
    </div>
  )
}
