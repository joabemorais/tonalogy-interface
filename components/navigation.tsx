'use client'

import React from 'react'
import Link from 'next/link'
import { Music, Settings, History, Moon, Sun, PanelRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { toggleSidebar } from '@/components/collapsible-sidebar'

export function Navigation() {
  const { theme, setTheme } = useTheme()

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
              onClick={toggleSidebar}
              title="Toggle Recent Analyses"
            >
              <PanelRight className="h-5 w-5" />
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
