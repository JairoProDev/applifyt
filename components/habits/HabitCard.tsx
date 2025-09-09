'use client'

import React, { useState } from 'react'
import { HabitWithLogs } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { 
  Check, 
  X, 
  Flame, 
  Clock, 
  Target,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'
import { formatDate, calculateStreak } from '@/lib/utils'
import { useHabits } from '@/hooks/useHabits'
import toast from 'react-hot-toast'

interface HabitCardProps {
  habit: HabitWithLogs
  onEdit?: (habit: HabitWithLogs) => void
  onDelete?: (habit: HabitWithLogs) => void
}

export function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  const [isLogging, setIsLogging] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { logHabit } = useHabits()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayLog = habit.logs.find(log => {
    const logDate = new Date(log.date)
    logDate.setHours(0, 0, 0, 0)
    return logDate.getTime() === today.getTime()
  })

  const isCompleted = todayLog?.completed || false
  const completedCount = todayLog?.count || 0

  const handleLogHabit = async (completed: boolean) => {
    try {
      setIsLogging(true)
      await logHabit(habit.id, completed, completed ? 1 : 0)
      toast.success(completed ? 'Hábito completado' : 'Hábito marcado como no completado')
    } catch (error) {
      toast.error('Error al registrar el hábito')
    } finally {
      setIsLogging(false)
    }
  }

  const getFrequencyText = () => {
    switch (habit.frequency) {
      case 'daily':
        return 'Diario'
      case 'weekly':
        return 'Semanal'
      case 'monthly':
        return 'Mensual'
      default:
        return habit.frequency
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'success'
    if (difficulty <= 3) return 'warning'
    return 'danger'
  }

  const getImportanceColor = (importance: number) => {
    if (importance >= 4) return 'primary'
    if (importance >= 3) return 'warning'
    return 'gray'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{habit.name}</CardTitle>
            {habit.description && (
              <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
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
                      onEdit?.(habit)
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(habit)
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
          <Badge variant="gray" size="sm">
            <Clock className="h-3 w-3 mr-1" />
            {getFrequencyText()}
          </Badge>
          <Badge variant={getDifficultyColor(habit.difficulty)} size="sm">
            Dificultad: {habit.difficulty}/5
          </Badge>
          <Badge variant={getImportanceColor(habit.importance)} size="sm">
            Importancia: {habit.importance}/5
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Habit Loop Information */}
        <div className="space-y-2 mb-4">
          <div className="text-sm">
            <span className="font-medium text-gray-700">Señal:</span>
            <span className="ml-2 text-gray-600">{habit.cue}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Rutina:</span>
            <span className="ml-2 text-gray-600">{habit.routine}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Recompensa:</span>
            <span className="ml-2 text-gray-600">{habit.reward}</span>
          </div>
        </div>

        {/* Progress and Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Racha actual:</span>
              <span className="font-bold text-orange-600">{habit.currentStreak}</span>
            </div>
            <div className="text-sm text-gray-500">
              {habit.completionRate.toFixed(1)}% completado
            </div>
          </div>
          
          <ProgressBar 
            value={habit.completionRate} 
            color="primary"
            showLabel={false}
          />
        </div>

        {/* Today's Action */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {formatDate(new Date())}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {isCompleted ? (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleLogHabit(false)}
                  disabled={isLogging}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Completado
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLogHabit(true)}
                  disabled={isLogging}
                >
                  <X className="h-4 w-4 mr-1" />
                  Marcar
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
