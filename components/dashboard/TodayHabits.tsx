'use client'

import React from 'react'
import { HabitWithLogs } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { 
  Check, 
  X, 
  Clock,
  Flame,
  Plus
} from 'lucide-react'
import { formatDate, calculateStreak } from '@/lib/utils'
import { useHabits } from '@/hooks/useHabits'
import toast from 'react-hot-toast'

interface TodayHabitsProps {
  habits: HabitWithLogs[]
  onAddHabit?: () => void
}

export function TodayHabits({ habits, onAddHabit }: TodayHabitsProps) {
  const { logHabit } = useHabits()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handleLogHabit = async (habitId: string, completed: boolean) => {
    try {
      await logHabit(habitId, completed, completed ? 1 : 0)
      toast.success(completed ? 'Hábito completado' : 'Hábito marcado como no completado')
    } catch (error) {
      toast.error('Error al registrar el hábito')
    }
  }

  const completedToday = habits.filter(habit => {
    const todayLog = habit.logs.find(log => {
      const logDate = new Date(log.date)
      logDate.setHours(0, 0, 0, 0)
      return logDate.getTime() === today.getTime()
    })
    return todayLog?.completed
  }).length

  const completionRate = habits.length > 0 ? (completedToday / habits.length) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary-600" />
              Hábitos de Hoy
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(new Date())}
            </p>
          </div>
          {onAddHabit && (
            <Button size="sm" onClick={onAddHabit}>
              <Plus className="h-4 w-4 mr-1" />
              Nuevo
            </Button>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progreso del día
            </span>
            <span className="text-sm text-gray-500">
              {completedToday}/{habits.length}
            </span>
          </div>
          <ProgressBar 
            value={completionRate} 
            color="primary"
            showLabel={false}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes hábitos configurados
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza creando tu primer hábito para empezar tu viaje de crecimiento personal.
            </p>
            {onAddHabit && (
              <Button onClick={onAddHabit}>
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primer hábito
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => {
              const todayLog = habit.logs.find(log => {
                const logDate = new Date(log.date)
                logDate.setHours(0, 0, 0, 0)
                return logDate.getTime() === today.getTime()
              })
              
              const isCompleted = todayLog?.completed || false
              const completedCount = todayLog?.count || 0

              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{habit.name}</h4>
                      <Badge variant="gray" size="sm">
                        <Flame className="h-3 w-3 mr-1" />
                        {habit.currentStreak}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {habit.routine}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isCompleted ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleLogHabit(habit.id, false)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Completado
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLogHabit(habit.id, true)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Marcar
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
