'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Clock, 
  Play, 
  Pause, 
  Target,
  Zap,
  Calendar,
  Plus
} from 'lucide-react'

export function TimeBlocks() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeBlocks, setTimeBlocks] = useState([
    {
      id: 1,
      title: 'Bloque de Enfoque',
      startTime: '09:00',
      endTime: '11:00',
      type: 'focus',
      status: 'upcoming',
      description: 'Trabajo profundo en proyecto principal'
    },
    {
      id: 2,
      title: 'Reunión de Equipo',
      startTime: '11:30',
      endTime: '12:30',
      type: 'meeting',
      status: 'upcoming',
      description: 'Sprint planning semanal'
    },
    {
      id: 3,
      title: 'Almuerzo',
      startTime: '12:30',
      endTime: '13:30',
      type: 'break',
      status: 'upcoming',
      description: 'Descanso y comida'
    },
    {
      id: 4,
      title: 'Tareas Administrativas',
      startTime: '14:00',
      endTime: '15:30',
      type: 'admin',
      status: 'upcoming',
      description: 'Emails, facturas, organización'
    },
    {
      id: 5,
      title: 'Ejercicio',
      startTime: '16:00',
      endTime: '17:00',
      type: 'health',
      status: 'upcoming',
      description: 'Gimnasio o caminata'
    }
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getCurrentTimeString = () => {
    return currentTime.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBlockStatus = (block: any) => {
    const now = getCurrentTimeString()
    const start = block.startTime
    const end = block.endTime

    if (now >= start && now <= end) {
      return 'current'
    } else if (now > end) {
      return 'completed'
    } else {
      return 'upcoming'
    }
  }

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'focus': return <Target className="h-4 w-4" />
      case 'meeting': return <Calendar className="h-4 w-4" />
      case 'break': return <Pause className="h-4 w-4" />
      case 'admin': return <Clock className="h-4 w-4" />
      case 'health': return <Zap className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'focus': return 'text-blue-600'
      case 'meeting': return 'text-purple-600'
      case 'break': return 'text-green-600'
      case 'admin': return 'text-yellow-600'
      case 'health': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-blue-100 border-blue-200 text-blue-800'
      case 'completed': return 'bg-green-100 border-green-200 text-green-800'
      case 'upcoming': return 'bg-gray-100 border-gray-200 text-gray-800'
      default: return 'bg-gray-100 border-gray-200 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'current': return 'En curso'
      case 'completed': return 'Completado'
      case 'upcoming': return 'Próximo'
      default: return 'Programado'
    }
  }

  const currentBlock = timeBlocks.find(block => getBlockStatus(block) === 'current')
  const upcomingBlocks = timeBlocks.filter(block => getBlockStatus(block) === 'upcoming').slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Clock className="h-5 w-5 mr-2 text-blue-500" />
          Bloques de Tiempo
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {getCurrentTimeString()} - {currentBlock ? `Bloque actual: ${currentBlock.title}` : 'Sin bloque activo'}
          </p>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Block */}
        {currentBlock && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-md bg-white ${getBlockColor(currentBlock.type)}`}>
                  {getBlockIcon(currentBlock.type)}
                </div>
                <h4 className="font-medium text-blue-900">{currentBlock.title}</h4>
              </div>
              <Badge variant="primary" size="sm">
                En curso
              </Badge>
            </div>
            <p className="text-sm text-blue-700 mb-3">{currentBlock.description}</p>
            <div className="flex items-center space-x-4 text-sm text-blue-600">
              <span>{currentBlock.startTime} - {currentBlock.endTime}</span>
              <Button size="sm" variant="outline" className="text-blue-600 border-blue-200">
                <Play className="h-3 w-3 mr-1" />
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Upcoming Blocks */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Próximos bloques</h4>
          {upcomingBlocks.map((block) => (
            <div
              key={block.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 rounded-md bg-white ${getBlockColor(block.type)}`}>
                  {getBlockIcon(block.type)}
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{block.title}</h5>
                  <p className="text-sm text-gray-500">{block.startTime} - {block.endTime}</p>
                </div>
              </div>
              <Badge variant="outline" size="sm">
                {getStatusLabel(getBlockStatus(block))}
              </Badge>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              Ver calendario
            </Button>
            <Button variant="outline" size="sm" className="text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              Ajustar horarios
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
