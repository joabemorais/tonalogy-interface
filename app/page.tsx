'use client'

import React, { useState, useEffect } from 'react'
import { HarmonicAnalyzer } from '@/components/harmonic-analyzer'
import { RecentAnalyses } from '@/components/recent-analyses'
import { SidebarProvider, RightSidebar } from '@/components/collapsible-sidebar'
import { TonalityTest } from '@/components/tonality-test'

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Função para sincronizar estado da sidebar
    const syncSidebarState = () => {
      const sidebar = document.querySelector('[data-sidebar="true"]')
      if (sidebar) {
        const isVisible = !sidebar.classList.contains('translate-x-full')
        setIsSidebarOpen(isVisible)
      }
    }

    // Observa mudanças na sidebar
    const observer = new MutationObserver(syncSidebarState)
    
    syncSidebarState()
    
    const sidebar = document.querySelector('[data-sidebar="true"]')
    if (sidebar) {
      observer.observe(sidebar, { 
        attributes: true, 
        attributeFilter: ['class'] 
      })
    }

    const handleSidebarChange = () => {
      setTimeout(syncSidebarState, 50)
    }
    
    window.addEventListener('toggleSidebar', handleSidebarChange)

    return () => {
      observer.disconnect()
      window.removeEventListener('toggleSidebar', handleSidebarChange)
    }
  }, [])

  return (
    <SidebarProvider defaultOpen={false}>
      {/* Container principal com margem direita dinâmica apenas no desktop */}
      <div 
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'md:mr-96' : 'mr-0'
        }`}
      >
        {/* Conteúdo centralizado com largura limitada */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          <HarmonicAnalyzer />
          
          {/* Teste temporário das cores das tonalidades */}
          <div className="border-t pt-8">
            <TonalityTest />
          </div>
        </div>
        
        {/* Right Sidebar - fixa na lateral direita */}
        <RightSidebar>
          <RecentAnalyses />
        </RightSidebar>
      </div>
    </SidebarProvider>
  )
}
