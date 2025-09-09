'use client'

import React, { useState } from 'react'
import { GoalWithProgress } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { CircularProgress } from '@/components/ui/ProgressBar'
import { 
  Target, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  TrendingUp
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useGoals } from '@/hooks/useGoals'
import toast from 'react-hot-toast'

interface GoalCardProps {
  goal: GoalWithProgress
  onEdit?: (goal: GoalWithProgress) => void
  onDelete?: (goal: GoalWithProgress) => void
  onAddProgress?: (goal: GoalWithProgress) => void
}

export function GoalCard({ goal, onEdit, onDelete, onAddProgress }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { logProgress } = useGoals()

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

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'danger'
    if (priority >= 3) return 'warning'
    return 'gray'
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success'
    if (progress >= 50) return 'warning'
    return 'danger'
  }

  const isOverdue = new Date(goal.timebound) < new Date() && goal.status === 'active'
  const daysLeft = Math.ceil((new Date(goal.timebound).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary-600" />
              {goal.title}
            </CardTitle>
            {goal.description && (
              <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onAddProgress?.(goal)
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Agregar Progreso
                  </button>
                  <button
                    onClick={() => {
                      onEdit?.(goal)
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(goal)
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant={getTypeColor(goal.type)} size="sm">
            {getTypeLabel(goal.type)}
          </Badge>
          <StatusBadge status={goal.status as any} />
          <Badge variant={getPriorityColor(goal.priority)} size="sm">
            Prioridad: {goal.priority}/5
          </Badge>
          {isOverdue && (
            <Badge variant="danger" size="sm">
              Vencido
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* WOOP Framework */}
        <div className="space-y-3 mb-4">
          <div className="text-sm">
            <span className="font-medium text-gray-700">Deseo:</span>
            <span className="ml-2 text-gray-600">{goal.wish}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Mejor resultado:</span>
            <span className="ml-2 text-gray-600">{goal.outcome}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Obstáculo principal:</span>
            <span className="ml-2 text-gray-600">{goal.obstacle}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Plan:</span>
            <span className="ml-2 text-gray-600">{goal.plan}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Progreso</span>
            </div>
            <div className="flex items-center space-x-2">
              <CircularProgress
                value={goal.progress}
                size={40}
                strokeWidth={3}
                color={getProgressColor(goal.progress)}
                showLabel
              />
            </div>
          </div>
        </div>

        {/* Deadline and Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {isOverdue ? 'Vencido' : `${daysLeft} días restantes`}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddProgress?.(goal)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Progreso
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-1">
            Fecha límite: {formatDate(new Date(goal.timebound))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
