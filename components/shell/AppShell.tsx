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
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar - Always Visible */}
      <TopBar 
        onOpenKai={() => setIsKaiOpen(true)}
        onOpenComposer={() => setIsComposerOpen(true)}
        currentPage={currentPage}
      />

      {/* Main Content Area */}
      <div className="flex">
        {/* Left Navigation - Desktop Only */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Central Surface */}
          <div className="flex-1">
            {children}
          </div>

          {/* Kai Drawer - Desktop Only */}
          <div className="hidden lg:block w-80 border-l border-gray-200">
            <KaiDrawer 
              isOpen={isKaiOpen}
              onClose={() => setIsKaiOpen(false)}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
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
