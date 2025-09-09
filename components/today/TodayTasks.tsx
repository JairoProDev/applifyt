'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Target, 
  Flag,
  Play,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react'

interface TodayTasksProps {
  tasks: any[]
  onStartTask: (task: any) => void
}

export function TodayTasks({ tasks, onStartTask }: TodayTasksProps) {
  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getTaskIcon = (task: any) => {
    switch (task.category) {
      case 'work': return <Target className="h-4 w-4 text-blue-600" />
      case 'personal': return <Flag className="h-4 w-4 text-purple-600" />
      case 'health': return <Clock className="h-4 w-4 text-green-600" />
      default: return <Circle className="h-4 w-4 text-gray-600" />
    }
  }

  const getTaskColor = (task: any) => {
    if (task.completed) return 'text-green-600'
    if (task.priority === 'high') return 'text-red-600'
    if (task.priority === 'medium') return 'text-yellow-600'
    return 'text-gray-600'
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

  const isOverdue = (task: any) => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    return dueDate < today
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            Tareas de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No hay tareas programadas para hoy</p>
            <p className="text-sm text-gray-400">Agrega tareas para organizar tu día</p>
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
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            Tareas de Hoy
          </CardTitle>
          <Badge variant="primary" size="sm">
            {completedTasks}/{totalTasks}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-sm text-gray-500">{completionRate}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={task.id || index}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              task.completed
                ? 'bg-green-50 border-green-200'
                : isOverdue(task)
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3 flex-1">
              <button
                className={`p-1 rounded-full transition-colors ${
                  task.completed
                    ? 'text-green-600 bg-green-100'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {task.completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              
              <div className={`p-1.5 rounded-md bg-white ${getTaskColor(task)}`}>
                {getTaskIcon(task)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={`font-medium truncate ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {task.name}
                  </h4>
                  {task.priority && (
                    <Badge variant={getPriorityColor(task.priority)} size="sm">
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  )}
                  {isOverdue(task) && !task.completed && (
                    <Badge variant="danger" size="sm">
                      Vencida
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {task.estimatedTime && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{task.estimatedTime}min</span>
                    </div>
                  )}
                  {task.dueDate && (
                    <div className="flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      <span>
                        {new Date(task.dueDate).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!task.completed && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStartTask(task)}
                  className="text-primary-600 border-primary-200 hover:bg-primary-50"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Empezar
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
              {completedTasks === totalTasks 
                ? '¡Todas las tareas completadas!' 
                : `${totalTasks - completedTasks} tareas pendientes`
              }
            </span>
            {completedTasks > 0 && (
              <span className="text-blue-600 font-medium">
                +{completedTasks * 15} puntos
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-3 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full text-gray-600 hover:text-gray-900"
          >
            Ver todas las tareas
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
