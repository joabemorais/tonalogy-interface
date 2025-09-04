'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Music, Settings, History, Moon, Sun, PanelRight, PanelRightClose } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Função para sincronizar estado da sidebar
    const syncSidebarState = () => {
      // Verifica se o elemento da sidebar existe e se está visível
      const sidebar = document.querySelector('[data-sidebar="true"]')
      if (sidebar) {
        const isVisible = !sidebar.classList.contains('translate-x-full')
        setIsSidebarOpen(isVisible)
      }
    }

    // Observa mudanças na sidebar
    const observer = new MutationObserver(syncSidebarState)
    
    // Sincroniza estado inicial
    syncSidebarState()
    
    // Observa mudanças no DOM
    const sidebar = document.querySelector('[data-sidebar="true"]')
    if (sidebar) {
      observer.observe(sidebar, { 
        attributes: true, 
        attributeFilter: ['class'] 
      })
    }

    // Adiciona um listener para mudanças na sidebar
    const handleSidebarChange = () => {
      setTimeout(syncSidebarState, 50) // Pequeno delay para aguardar animação
    }
    
    window.addEventListener('toggleSidebar', handleSidebarChange)

    return () => {
      observer.disconnect()
      window.removeEventListener('toggleSidebar', handleSidebarChange)
    }
  }, [])

  const handleToggle = () => {
    window.dispatchEvent(new Event('toggleSidebar'))
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl">Tonalogy</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Analyze
            </Link>
            <Link
              href="/history"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              History
            </Link>
            <Link
              href="/settings"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Settings
            </Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              title="Toggle Recent Analyses"
              className={`transition-all duration-200 ${isSidebarOpen ? "bg-accent" : ""}`}
            >
              <div className="relative w-5 h-5">
                <PanelRight 
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                    isSidebarOpen 
                      ? 'opacity-0 scale-75 rotate-12' 
                      : 'opacity-100 scale-100 rotate-0'
                  }`} 
                />
                <PanelRightClose 
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                    isSidebarOpen 
                      ? 'opacity-100 scale-100 rotate-0' 
                      : 'opacity-0 scale-75 rotate-12'
                  }`} 
                />
              </div>
              <span className="sr-only">Toggle Recent Analyses</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
