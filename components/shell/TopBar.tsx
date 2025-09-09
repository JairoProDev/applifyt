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
  Zap
} from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { formatDate } from '@/lib/utils'

interface TopBarProps {
  onOpenKai: () => void
  onOpenComposer: () => void
  currentPage: string
}

export function TopBar({ onOpenKai, onOpenComposer, currentPage }: TopBarProps) {
  const { data: dashboardData, isLoading } = useDashboard()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getProgressPercentage = () => {
    if (!dashboardData) return 0
    const totalActions = dashboardData.todayHabits.length + dashboardData.todayGoals.length
    const completedActions = dashboardData.todayHabits.filter(h => h.completed).length + 
                           dashboardData.todayGoals.filter(g => g.completed).length
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
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Date & Progress */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Hoy
            </h1>
            <p className="text-sm text-gray-500">
              {formatDate(currentTime, 'EEEE, d MMMM')}
            </p>
          </div>
          
          {/* Progress Circle */}
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={getProgressColor(progressPercentage)}
                  stroke="currentColor"
                  strokeWidth="3"
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
                {isLoading ? 'Cargando...' : `${dashboardData?.todayHabits.filter(h => h.completed).length || 0} hábitos completados`}
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Current Page Indicator */}
        <div className="hidden md:flex items-center space-x-2">
          <Badge variant="primary" size="sm">
            {currentPage === 'today' && 'Hoy'}
            {currentPage === 'plan' && 'Plan'}
            {currentPage === 'progress' && 'Progreso'}
            {currentPage === 'library' && 'Biblioteca'}
            {currentPage === 'more' && 'Más'}
          </Badge>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
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
          >
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary-500 rounded-full animate-pulse"></span>
          </Button>

          {/* Universal Composer */}
          <Button
            onClick={onOpenComposer}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Agregar</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4 text-green-500" />
            <span>3 metas activas</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>7 días de racha</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Última actualización: {currentTime.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  )
}
