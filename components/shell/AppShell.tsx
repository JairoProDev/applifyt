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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const navigation = [
    { id: 'solve', name: 'Resolver', icon: Target, href: '/solve' },
    { id: 'progress', name: 'Progreso', icon: BarChart3, href: '/progress' },
    { id: 'library', name: 'Biblioteca', icon: BookOpen, href: '/library' },
    { id: 'more', name: 'Más', icon: Home, href: '/more' },
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
        {/* Left Navigation - Desktop Only - Fixed, always visible */}
        <div className="hidden lg:block">
          <div
            className={`fixed top-16 bottom-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 ${
              isSidebarCollapsed ? 'w-16' : 'w-72'
            }`}
            onMouseEnter={() => setIsSidebarCollapsed(false)}
            onMouseLeave={() => setIsSidebarCollapsed(true)}
          >
            <nav className="p-4 space-y-2 h-full flex flex-col overflow-y-auto">
            {/* Header with Toggle Button */}
            <div className="flex items-center justify-between mb-4">
              {!isSidebarCollapsed && (
                <h2 className="text-lg font-semibold text-gray-800">Navegación</h2>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
                title={isSidebarCollapsed ? 'Expandir' : 'Colapsar'}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className={`w-3 h-0.5 bg-current transition-all duration-200 ${
                    isSidebarCollapsed ? 'rotate-90' : '-rotate-90'
                  }`}></div>
                </div>
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={isSidebarCollapsed ? item.name : ''}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <span className="ml-3 font-medium text-sm">{item.name}</span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isSidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* User Profile at Bottom */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">U</span>
                </div>
                {!isSidebarCollapsed && (
                  <span className="ml-3 font-medium text-sm">Usuario</span>
                )}
              </button>
            </div>
            </nav>
          </div>
        </div>

        {/* Spacer to account for fixed sidebar width */}
        <div className={`hidden lg:block flex-shrink-0 ${isSidebarCollapsed ? 'w-16' : 'w-72'}`}></div>

        {/* Main Content - Full Width on Desktop */}
        <div className="flex-1 flex min-w-0">
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

      {/* Floating Kai Button - Desktop */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsKaiOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">K</span>
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </button>
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
