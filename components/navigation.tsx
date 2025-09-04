'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music, Settings, History, Moon, Sun, PanelRight, PanelRightClose, BarChart3 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isOnHistoryPage = pathname === '/history'
  const isMobile = useIsMobile()

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
    <>
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Music className="h-6 w-6 text-primary" />
              <span className="text-xl">Tonalogy</span>
            </Link>

            {/* Navigation Links - Desktop Only */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === "/" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Analyze
              </Link>
              <Link
                href="/history"
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === "/history" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                History
              </Link>
              <Link
                href="/settings"
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === "/settings" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Settings
              </Link>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Sidebar Toggle - Desktop Only */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                disabled={isOnHistoryPage}
                title={isOnHistoryPage ? "Already on history page" : "Toggle Recent Analyses"}
                className={cn(
                  "hidden md:flex transition-all duration-200",
                  isSidebarOpen ? "bg-accent" : "",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
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

      {/* Bottom Navigation - Mobile Only */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <div className="flex h-16 items-center justify-around px-2">
            {/* Analyze Tab */}
            <Link
              href="/"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                pathname === "/" 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {pathname === "/" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs font-medium">Analyze</span>
            </Link>

            {/* History Tab */}
            <Link
              href="/history"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                pathname === "/history" 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {pathname === "/history" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
              <History className="h-5 w-5" />
              <span className="text-xs font-medium">History</span>
            </Link>

            {/* Settings Tab */}
            <Link
              href="/settings"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                pathname === "/settings" 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {pathname === "/settings" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Settings</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  )
}
