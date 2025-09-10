'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { TopBar } from '@/components/shell/TopBar'
import { BottomNav } from '@/components/shell/BottomNav'
import { KaiDrawer } from '@/components/shell/KaiDrawer'
import { UniversalComposer } from '@/components/shell/UniversalComposer'
import { FocusPlayer } from '@/components/shell/FocusPlayer'
import { 
  Home, 
  Calendar, 
  Target, 
  BarChart3, 
  BookOpen,
  Plus,
  Bot
} from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
  currentPage?: string
}

export function AppShell({ children, currentPage = 'today' }: AppShellProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isKaiOpen, setIsKaiOpen] = useState(false)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isFocusPlayerOpen, setIsFocusPlayerOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState(null)

  const navigation = [
    { id: 'today', name: 'Hoy', icon: Home, href: '/today' },
    { id: 'plan', name: 'Plan', icon: Calendar, href: '/plan' },
    { id: 'progress', name: 'Progreso', icon: BarChart3, href: '/progress' },
    { id: 'library', name: 'Biblioteca', icon: BookOpen, href: '/library' },
    { id: 'more', name: 'Más', icon: Target, href: '/more' },
  ]

  const handleStartAction = (action: any) => {
    setCurrentAction(action)
    setIsFocusPlayerOpen(true)
  }

  const handleCompleteAction = () => {
    setCurrentAction(null)
    setIsFocusPlayerOpen(false)
    // Show micro-reward animation
  }

  if (!session) {
    return <Layout>{children}</Layout>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar - Always Visible */}
      <TopBar 
        onOpenKai={() => setIsKaiOpen(true)}
        onOpenComposer={() => setIsComposerOpen(true)}
        currentPage={currentPage}
      />

      {/* Main Content Area - Desktop Optimized */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation - Desktop Only */}
        <div className="hidden lg:block w-72 bg-white border-r border-gray-200 flex-shrink-0">
          <nav className="p-6 space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-medium text-lg">{item.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content - Full Width on Desktop */}
        <div className="flex-1 flex flex-col lg:flex-row min-w-0">
          {/* Central Surface - Takes most space on desktop */}
          <div className="flex-1 min-w-0">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </div>

          {/* Kai Drawer - Desktop Only - Fixed Width */}
          <div className="hidden lg:block w-96 border-l border-gray-200 flex-shrink-0">
            <KaiDrawer 
              isOpen={isKaiOpen}
              onClose={() => setIsKaiOpen(false)}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <BottomNav 
          navigation={navigation}
          currentPage={currentPage}
          onOpenKai={() => setIsKaiOpen(true)}
          onOpenComposer={() => setIsComposerOpen(true)}
        />
      </div>

      {/* Kai Drawer - Mobile */}
      <div className="lg:hidden">
        <KaiDrawer 
          isOpen={isKaiOpen}
          onClose={() => setIsKaiOpen(false)}
          currentPage={currentPage}
          isMobile={true}
        />
      </div>

      {/* Universal Composer */}
      <UniversalComposer 
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onStartAction={handleStartAction}
      />

      {/* Focus Player */}
      <FocusPlayer 
        isOpen={isFocusPlayerOpen}
        onClose={() => setIsFocusPlayerOpen(false)}
        action={currentAction}
        onComplete={handleCompleteAction}
      />
    </div>
  )
}
