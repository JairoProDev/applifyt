'use client'

import React from 'react'
import { GoalWithProgress } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CircularProgress } from '@/components/ui/ProgressBar'
import { 
  Target, 
  Calendar,
  Plus,
  TrendingUp
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ActiveGoalsProps {
  goals: GoalWithProgress[]
  onAddGoal?: () => void
  onAddProgress?: (goal: GoalWithProgress) => void
}

export function ActiveGoals({ goals, onAddGoal, onAddProgress }: ActiveGoalsProps) {
  const activeGoals = goals.filter(goal => goal.status === 'active')

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vision':
        return 'primary'
      case 'annual':
        return 'success'
      case 'quarterly':
        return 'warning'
      case 'monthly':
        return 'gray'
      case 'weekly':
        return 'gray'
      case 'project':
        return 'primary'
      default:
        return 'gray'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vision':
        return 'Visión'
      case 'annual':
        return 'Anual'
      case 'quarterly':
        return 'Trimestral'
      case 'monthly':
        return 'Mensual'
      case 'weekly':
        return 'Semanal'
      case 'project':
        return 'Proyecto'
      default:
        return type
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success'
    if (progress >= 50) return 'warning'
    return 'danger'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary-600" />
              Metas Activas
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {activeGoals.length} metas en progreso
            </p>
          </div>
          {onAddGoal && (
            <Button size="sm" onClick={onAddGoal}>
              <Plus className="h-4 w-4 mr-1" />
              Nueva Meta
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {activeGoals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes metas activas
            </h3>
            <p className="text-gray-600 mb-4">
              Define tus objetivos para comenzar a trabajar hacia tus sueños.
            </p>
            {onAddGoal && (
              <Button onClick={onAddGoal}>
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primera meta
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals.slice(0, 5).map((goal) => {
              const isOverdue = new Date(goal.timebound) < new Date()
              const daysLeft = Math.ceil((new Date(goal.timebound).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

              return (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <Badge variant={getTypeColor(goal.type)} size="sm">
                        {getTypeLabel(goal.type)}
                      </Badge>
                      {isOverdue && (
                        <Badge variant="danger" size="sm">
                          Vencido
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {goal.specific}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {isOverdue ? 'Vencido' : `${daysLeft} días restantes`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{goal.progress.toFixed(1)}% completado</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CircularProgress
                      value={goal.progress}
                      size={50}
                      strokeWidth={3}
                      color={getProgressColor(goal.progress)}
                      showLabel
                    />
                    {onAddProgress && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddProgress(goal)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
            
            {activeGoals.length > 5 && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  Ver todas las metas ({activeGoals.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
