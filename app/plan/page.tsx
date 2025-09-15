'use client'

import React, { useEffect, useState } from 'react'
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
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useGoals } from '@/hooks/useGoals'
import { useHabits } from '@/hooks/useHabits'

export default function PlanPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('goals')
  const searchParams = useSearchParams()
  const { goals, loading: goalsLoading, deleteGoal } = useGoals()
  const { habits, loading: habitsLoading, deleteHabit } = useHabits()

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

  const isLoading = goalsLoading || habitsLoading

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'text-green-600'
      case 'learning': return 'text-blue-600'
      case 'finance': return 'text-yellow-600'
      case 'work': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColorByNumber = (priority: number) => {
    if (priority >= 4) return 'danger'
    if (priority === 3) return 'warning'
    if (priority <= 2) return 'success'
    return 'gray'
  }

  const getPriorityLabelByNumber = (priority: number) => {
    if (priority >= 4) return 'Alta'
    if (priority === 3) return 'Media'
    if (priority <= 2) return 'Baja'
    return 'Normal'
  }

  const renderGoals = () => (
    <div className="space-y-4">
      {goals.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-600">
            Aún no tienes metas. Crea tu primera meta para comenzar.
          </CardContent>
        </Card>
      )}
      {goals.map((goal) => (
        <Card key={goal.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                  <Badge variant={getPriorityColorByNumber(goal.priority)} size="sm">
                    {getPriorityLabelByNumber(goal.priority)}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3">{goal.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Vence: {new Date(goal.timebound).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    <span>{goal.progress}% completado</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => router.push(`/goals/${goal.id}/edit`)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={async () => {
                    if (!confirm('¿Eliminar esta meta?')) return
                    try {
                      await deleteGoal(goal.id)
                      toast.success('Meta eliminada')
                    } catch (e) {
                      toast.error('No se pudo eliminar')
                    }
                  }}
                >
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
      
      <Button className="w-full" variant="outline" onClick={() => router.push('/goals/new')}>
        <Plus className="h-4 w-4 mr-2" />
        Agregar Nueva Meta
      </Button>
    </div>
  )

  const renderHabits = () => (
    <div className="space-y-4">
      {habits.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-600">
            Aún no tienes hábitos. Crea tu primer hábito para comenzar.
          </CardContent>
        </Card>
      )}
      {habits.map((habit) => (
        <Card key={habit.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white text-yellow-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                  <p className="text-sm text-gray-500">{habit.frequency}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">{habit.currentStreak || 0}</div>
                  <div className="text-xs text-gray-500">días</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => router.push(`/habits/${habit.id}/edit`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={async () => {
                      if (!confirm('¿Eliminar este hábito?')) return
                      try {
                        await deleteHabit(habit.id)
                        toast.success('Hábito eliminado')
                      } catch (e) {
                        toast.error('No se pudo eliminar')
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button className="w-full" variant="outline" onClick={() => router.push('/habits/new')}>
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
        <div className="w-full max-w-none px-4 lg:px-6 py-6">
          {/* Sync tab from query param */}
          <EffectOnceSetter setTab={setActiveTab} searchParams={searchParams} />
          {isLoading && (
            <div className="mb-6">
              <div className="animate-pulse h-6 bg-gray-200 rounded w-32" />
            </div>
          )}
          {/* Header */}
          <div className="mb-8 applify-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Plan</h1>
            <p className="text-lg text-gray-600 applify-text-balance">
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
          <div className="space-y-8 applify-slide-up">
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

function EffectOnceSetter({ setTab, searchParams }: { setTab: (v: string) => void, searchParams: ReturnType<typeof useSearchParams> }) {
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'goals' || tab === 'habits' || tab === 'calendar' || tab === 'backlog') {
      setTab(tab)
    }
  }, [])
  return null
}
