'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Plus, 
  Target, 
  Heart, 
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock
} from 'lucide-react'

interface ProgressiveDashboardProps {
  userData: any
  onStartFirstAction: () => void
}

export function ProgressiveDashboard({ userData, onStartFirstAction }: ProgressiveDashboardProps) {
  const [userProgress, setUserProgress] = useState({
    hasFirstGoal: false,
    hasFirstHabit: false,
    hasCompletedFirstAction: false,
    totalActions: 0,
    completedActions: 0
  })

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('applify-user-progress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  const getWelcomeMessage = () => {
    if (!userData?.name) return "¡Bienvenido a Applify!"
    return `¡Hola ${userData.name}!`
  }

  const getNextStep = () => {
    if (!userProgress.hasFirstGoal) {
      return {
        title: "Define tu primera meta",
        description: "¿Qué quieres lograr? Te ayudo a crear un plan paso a paso",
        action: "Crear mi primera meta",
        icon: <Target className="h-8 w-8 text-blue-500" />,
        color: "bg-blue-50 border-blue-200"
      }
    }
    
    if (!userProgress.hasFirstHabit) {
      return {
        title: "Crea tu primer hábito",
        description: "Los hábitos son la base del progreso. Empecemos con algo pequeño",
        action: "Crear mi primer hábito",
        icon: <Heart className="h-8 w-8 text-red-500" />,
        color: "bg-red-50 border-red-200"
      }
    }
    
    if (!userProgress.hasCompletedFirstAction) {
      return {
        title: "¡Es hora de actuar!",
        description: "Tienes todo listo. Vamos a completar tu primera acción",
        action: "Empezar mi primera acción",
        icon: <Zap className="h-8 w-8 text-yellow-500" />,
        color: "bg-yellow-50 border-yellow-200"
      }
    }
    
    return {
      title: "¡Excelente progreso!",
      description: "Has completado tu primera acción. Sigue así",
      action: "Ver mi progreso",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      color: "bg-green-50 border-green-200"
    }
  }

  const nextStep = getNextStep()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getWelcomeMessage()}
        </h1>
        <p className="text-lg text-gray-600">
          Tu viaje de crecimiento personal comienza aquí
        </p>
      </div>

      {/* Next Step Card */}
      <Card className={`${nextStep.color} border-2 shadow-lg`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {nextStep.icon}
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {nextStep.title}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {nextStep.description}
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={onStartFirstAction}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg"
          >
            {nextStep.action}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Progress Overview - Only show if user has started */}
      {userProgress.totalActions > 0 && (
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary-600" />
              Tu Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {userProgress.completedActions}
                </div>
                <div className="text-sm text-gray-600">Acciones completadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userProgress.totalActions}
                </div>
                <div className="text-sm text-gray-600">Total de acciones</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions - Only show if user has progress */}
      {userProgress.hasCompletedFirstAction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold text-gray-900 mb-2">Ver mis metas</h3>
              <p className="text-sm text-gray-600">Revisa y ajusta tus objetivos</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-3 text-red-500" />
              <h3 className="font-semibold text-gray-900 mb-2">Mis hábitos</h3>
              <p className="text-sm text-gray-600">Gestiona tu rutina diaria</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Time Display */}
      <Card className="bg-primary-50 border-primary-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 text-primary-600" />
            <span className="text-lg font-semibold text-primary-900">
              {new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <span className="text-primary-700">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



