'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

// Context para gerenciar estado da sidebar
interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  close: () => void
  open: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}

// Provider para o contexto da sidebar
interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = false }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)

  // Listen for global events to toggle sidebar
  useEffect(() => {
    const handleToggleSidebar = () => {
      toggle()
    }

    // Add event listener for global sidebar toggle
    window.addEventListener('toggleSidebar', handleToggleSidebar)

    return () => {
      window.removeEventListener('toggleSidebar', handleToggleSidebar)
    }
  }, [])

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close, open }}>
      {children}
    </SidebarContext.Provider>
  )
}

// Componente da sidebar
interface RightSidebarProps {
  children: React.ReactNode
}

export function RightSidebar({ children }: RightSidebarProps) {
  const { isOpen, close } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-background border-l z-50 transition-transform duration-300 ease-in-out flex flex-col",
          "w-80 md:w-96",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header da sidebar */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
          <h2 className="text-lg font-semibold">Recent Analyses</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Conteúdo da sidebar */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  )
}

// Função helper para usar na navbar
export function toggleSidebar() {
  window.dispatchEvent(new Event('toggleSidebar'))
}
