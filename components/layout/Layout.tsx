'use client'

import React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  className?: string
}

export function Layout({ children, showSidebar = true, className }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {showSidebar && (
          <div className="hidden md:flex md:w-64 md:flex-col">
            <Sidebar />
          </div>
        )}
        <main className={cn('flex-1', className)}>
          {children}
        </main>
      </div>
    </div>
  )
}
