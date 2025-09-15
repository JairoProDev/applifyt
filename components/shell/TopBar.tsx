'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Plus, 
  Bot, 
  Bell, 
  Calendar,
  Target,
  Zap,
  Sun,
  Moon,
  Palette
} from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useTheme } from '@/contexts/ThemeContext'
import { formatDate } from '@/lib/utils'

interface TopBarProps {
  onOpenKai: () => void
  onOpenComposer: () => void
  currentPage: string
}

export function TopBar({ onOpenKai, onOpenComposer, currentPage }: TopBarProps) {
  const { data: dashboardData, isLoading } = useDashboard()
  const { theme, toggleTheme } = useTheme()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getProgressPercentage = () => {
    if (!dashboardData) return 0
    const totalActions = dashboardData.habits.length + dashboardData.goals.length
    const completedActions = dashboardData.habits.filter(h => h.completed).length + 
                           dashboardData.goals.filter(g => g.completed).length
    return totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-500'
    if (percentage >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getProgressMessage = (percentage: number) => {
    if (percentage >= 80) return '¡Excelente día!'
    if (percentage >= 60) return 'Buen progreso'
    if (percentage >= 40) return 'Sigue adelante'
    return '¡Tú puedes!'
  }

  const progressPercentage = getProgressPercentage()

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left Section - App Name & Current Page */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-primary-600">
              Applify
            </h1>
            <span className="text-gray-400">•</span>
            <span className="text-xl font-semibold text-gray-700">
              {currentPage === 'today' && 'Hoy'}
              {currentPage === 'plan' && 'Plan'}
              {currentPage === 'progress' && 'Progreso'}
              {currentPage === 'library' && 'Biblioteca'}
              {currentPage === 'more' && 'Más'}
            </span>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-mono font-bold text-gray-900">
              {currentTime.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(currentTime, 'EEEE, d MMMM')}
            </div>
          </div>
        </div>

        {/* Center Section - Progress */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={getProgressColor(progressPercentage)}
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progressPercentage}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">
                  {progressPercentage}%
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                {getProgressMessage(progressPercentage)}
              </p>
              <p className="text-xs text-gray-500">
                {isLoading ? 'Cargando...' : `${dashboardData?.habits.filter(h => h.completed).length || 0} hábitos completados`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="relative"
            title="Cambiar tema"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            title="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Kai AI Assistant */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenKai}
            className="relative"
            title="Abrir Kai"
          >
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary-500 rounded-full animate-pulse"></span>
          </Button>

          {/* Universal Composer */}
          <Button
            onClick={onOpenComposer}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Agregar</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
