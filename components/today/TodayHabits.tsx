'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  CheckCircle, 
  Circle, 
  Zap, 
  Clock, 
  Target,
  Play,
  MoreHorizontal
} from 'lucide-react'

interface TodayHabitsProps {
  habits: any[]
  onStartHabit: (habit: any) => void
}

export function TodayHabits({ habits, onStartHabit }: TodayHabitsProps) {
  const completedHabits = habits.filter(h => h.completed).length
  const totalHabits = habits.length
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0

  const getHabitIcon = (habit: any) => {
    switch (habit.category) {
      case 'health': return <Zap className="h-4 w-4 text-green-600" />
      case 'work': return <Target className="h-4 w-4 text-blue-600" />
      case 'personal': return <Clock className="h-4 w-4 text-purple-600" />
      default: return <Circle className="h-4 w-4 text-gray-600" />
    }
  }

  const getHabitColor = (habit: any) => {
    if (habit.completed) return 'text-green-600'
    if (habit.streak >= 7) return 'text-purple-600'
    if (habit.streak >= 3) return 'text-blue-600'
    return 'text-gray-600'
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'danger' // Gold
    if (streak >= 7) return 'warning' // Silver
    if (streak >= 3) return 'success' // Bronze
    return 'gray'
  }

  if (habits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Zap className="h-5 w-5 mr-2 text-green-500" />
            Hábitos de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No hay hábitos programados para hoy</p>
            <p className="text-sm text-gray-400">Crea tu primer hábito para empezar</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Zap className="h-5 w-5 mr-2 text-green-500" />
            Hábitos de Hoy
          </CardTitle>
          <Badge variant="primary" size="sm">
            {completedHabits}/{totalHabits}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-sm text-gray-500">{completionRate}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.map((habit, index) => (
          <div
            key={habit.id || index}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              habit.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3 flex-1">
              <button
                className={`p-1 rounded-full transition-colors ${
                  habit.completed
                    ? 'text-green-600 bg-green-100'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {habit.completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              
              <div className={`p-1.5 rounded-md bg-white ${getHabitColor(habit)}`}>
                {getHabitIcon(habit)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={`font-medium truncate ${
                    habit.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {habit.name}
                  </h4>
                  {habit.streak > 0 && (
                    <Badge variant={getStreakColor(habit.streak)} size="sm">
                      {habit.streak} días
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {habit.estimatedTime && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{habit.estimatedTime}min</span>
                    </div>
                  )}
                  {habit.frequency && (
                    <div className="flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      <span>{habit.frequency}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!habit.completed && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStartHabit(habit)}
                  className="text-primary-600 border-primary-200 hover:bg-primary-50"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Hacer
                </Button>
              )}
              
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

        {/* Summary */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {completedHabits === totalHabits 
                ? '¡Todos los hábitos completados!' 
                : `${totalHabits - completedHabits} hábitos pendientes`
              }
            </span>
            {completedHabits > 0 && (
              <span className="text-green-600 font-medium">
                +{completedHabits * 10} puntos
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
