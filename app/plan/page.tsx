'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/shell/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Target, 
  Calendar, 
  Zap, 
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  Clock,
  Flag,
  CheckCircle
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function PlanPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('goals')

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const tabs = [
    { id: 'goals', name: 'Metas', icon: Target },
    { id: 'habits', name: 'Hábitos', icon: Zap },
    { id: 'calendar', name: 'Calendario', icon: Calendar },
    { id: 'backlog', name: 'Backlog', icon: Flag }
  ]

  const goals = [
    {
      id: 1,
      title: 'Perder 10 kg en 3 meses',
      description: 'Meta de salud y bienestar personal',
      category: 'health',
      priority: 'high',
      progress: 65,
      dueDate: '2024-03-15',
      status: 'active'
    },
    {
      id: 2,
      title: 'Aprender React avanzado',
      description: 'Desarrollar habilidades técnicas para el trabajo',
      category: 'learning',
      priority: 'medium',
      progress: 30,
      dueDate: '2024-04-30',
      status: 'active'
    },
    {
      id: 3,
      title: 'Ahorrar $5,000',
      description: 'Fondo de emergencia para estabilidad financiera',
      category: 'finance',
      priority: 'high',
      progress: 80,
      dueDate: '2024-06-30',
      status: 'active'
    }
  ]

  const habits = [
    {
      id: 1,
      name: 'Meditar 10 minutos',
      frequency: 'Diario',
      category: 'health',
      streak: 15,
      status: 'active'
    },
    {
      id: 2,
      name: 'Leer 30 minutos',
      frequency: 'Diario',
      category: 'learning',
      streak: 7,
      status: 'active'
    },
    {
      id: 3,
      name: 'Ejercicio 45 minutos',
      frequency: '3x por semana',
      category: 'health',
      streak: 3,
      status: 'active'
    }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'text-green-600'
      case 'learning': return 'text-blue-600'
      case 'finance': return 'text-yellow-600'
      case 'work': return 'text-purple-600'
      default: return 'text-gray-600'
    }
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

  const renderGoals = () => (
    <div className="space-y-4">
      {goals.map((goal) => (
        <Card key={goal.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                  <Badge variant={getPriorityColor(goal.priority)} size="sm">
                    {getPriorityLabel(goal.priority)}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3">{goal.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Vence: {new Date(goal.dueDate).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    <span>{goal.progress}% completado</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{goal.progress}%</span>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button className="w-full" variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Nueva Meta
      </Button>
    </div>
  )

  const renderHabits = () => (
    <div className="space-y-4">
      {habits.map((habit) => (
        <Card key={habit.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white ${getCategoryColor(habit.category)}`}>
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                  <p className="text-sm text-gray-500">{habit.frequency}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">{habit.streak}</div>
                  <div className="text-xs text-gray-500">días</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button className="w-full" variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Nuevo Hábito
      </Button>
    </div>
  )

  const renderCalendar = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Vista de Calendario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Vista de calendario próximamente</p>
            <p className="text-sm text-gray-400">
              Aquí podrás ver tus metas y hábitos organizados por fechas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderBacklog = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flag className="h-5 w-5 mr-2" />
            Bandeja de Entrada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No hay elementos en el backlog</p>
            <p className="text-sm text-gray-400">
              Las ideas y tareas capturadas aparecerán aquí
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <AppShell currentPage="plan">
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Plan</h1>
            <p className="text-lg text-gray-600">
              Organiza tus metas, hábitos y calendario para un crecimiento estructurado
            </p>
          </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      isActive
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

          {/* Content */}
          <div className="space-y-8">
            {activeTab === 'goals' && renderGoals()}
            {activeTab === 'habits' && renderHabits()}
            {activeTab === 'calendar' && renderCalendar()}
            {activeTab === 'backlog' && renderBacklog()}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
