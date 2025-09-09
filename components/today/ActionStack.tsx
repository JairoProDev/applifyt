'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Play, 
  Clock, 
  Target, 
  Zap,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react'

interface ActionStackProps {
  actions: any[]
  onStartAction: (action: any) => void
}

export function ActionStack({ actions, onStartAction }: ActionStackProps) {
  if (actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Próximas Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No hay acciones pendientes</p>
            <p className="text-sm text-gray-400">¡Excelente trabajo!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getActionIcon = (action: any) => {
    if (action.type === 'habit') return <Zap className="h-4 w-4" />
    if (action.type === 'goal') return <Target className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Próximas Acciones</CardTitle>
        <p className="text-sm text-gray-500">
          {actions.length} acciones pendientes para hoy
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <div
            key={action.id || index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className={`p-1.5 rounded-md bg-white ${getActionColor(action)}`}>
                {getActionIcon(action)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate">
                    {action.name}
                  </h4>
                  {action.priority && (
                    <Badge variant={getPriorityColor(action.priority)} size="sm">
                      {getPriorityLabel(action.priority)}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {action.estimatedTime && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{action.estimatedTime}min</span>
                    </div>
                  )}
                  {action.streak && (
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      <span>{action.streak} días</span>
                    </div>
                  )}
                  {action.dueDate && (
                    <div className="flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      <span>Vence hoy</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStartAction(action)}
                className="text-primary-600 border-primary-200 hover:bg-primary-50"
              >
                <Play className="h-4 w-4 mr-1" />
                Empezar
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {actions.length > 3 && (
          <div className="pt-3 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full text-gray-600 hover:text-gray-900"
            >
              Ver todas las acciones
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
