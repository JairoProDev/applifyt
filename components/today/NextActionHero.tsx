'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Play, 
  Clock, 
  Target, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

interface NextActionHeroProps {
  action?: any
  onStart: () => void
}

export function NextActionHero({ action, onStart }: NextActionHeroProps) {
  if (!action) {
    return (
      <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Día completado!
            </h2>
            <p className="text-gray-600 mb-4">
              Has terminado todas tus acciones planificadas para hoy.
            </p>
            <Button 
              onClick={onStart}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Target className="h-4 w-4 mr-2" />
              Planificar mañana
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getActionType = (action: any) => {
    if (action.type === 'habit') return 'Hábito'
    if (action.type === 'goal') return 'Meta'
    return 'Tarea'
  }

  const getActionIcon = (action: any) => {
    if (action.type === 'habit') return <Zap className="h-6 w-6" />
    if (action.type === 'goal') return <Target className="h-6 w-6" />
    return <Clock className="h-6 w-6" />
  }

  const getActionColor = (action: any) => {
    if (action.type === 'habit') return 'text-green-600'
    if (action.type === 'goal') return 'text-blue-600'
    return 'text-purple-600'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'gray'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return 'Normal'
    }
  }

  return (
    <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-white ${getActionColor(action)}`}>
              {getActionIcon(action)}
            </div>
            <div>
              <Badge variant="primary" size="sm" className="mb-2">
                {getActionType(action)}
              </Badge>
              <h2 className="text-xl font-semibold text-gray-900">
                Siguiente Acción
              </h2>
            </div>
          </div>
          
          {action.priority && (
            <Badge variant={getPriorityColor(action.priority)} size="sm">
              {getPriorityLabel(action.priority)}
            </Badge>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {action.name}
          </h3>
          {action.description && (
            <p className="text-gray-600 mb-3">
              {action.description}
            </p>
          )}
          
          {action.estimatedTime && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{action.estimatedTime} minutos</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {action.streak && (
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                <span>{action.streak} días de racha</span>
              </div>
            )}
            {action.dueDate && (
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                <span>Vence hoy</span>
              </div>
            )}
          </div>

          <Button 
            onClick={onStart}
            size="lg"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6"
          >
            <Play className="h-5 w-5 mr-2" />
            Empezar Ahora
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
