'use client'

import React from 'react'
import { HarmonicAnalyzer } from '@/components/harmonic-analyzer'
import { RecentAnalyses } from '@/components/recent-analyses'
import { SidebarProvider, RightSidebar } from '@/components/collapsible-sidebar'

export default function HomePage() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Main Content - agora ocupa toda a largura */}
        <div className="w-full">
          <HarmonicAnalyzer />
        </div>
        
        {/* Right Sidebar - agora é fixa na lateral direita */}
        <RightSidebar>
          <RecentAnalyses />
        </RightSidebar>
      </div>
    </SidebarProvider>
  )
}
