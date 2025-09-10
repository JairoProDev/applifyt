'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/shell/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  Calendar,
  Award,
  Clock,
  Heart,
  Brain,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProgressPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('week')

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const timeRanges = [
    { id: 'week', name: 'Esta semana', days: 7 },
    { id: 'month', name: 'Este mes', days: 30 },
    { id: 'quarter', name: 'Este trimestre', days: 90 },
    { id: 'year', name: 'Este año', days: 365 }
  ]

  const stats = {
    habits: {
      total: 0,
      completed: 0,
      streak: 0,
      bestStreak: 0
    },
    goals: {
      total: 0,
      completed: 0,
      inProgress: 0,
      successRate: 0
    },
    productivity: {
      focusTime: 0,
      tasksCompleted: 0,
      efficiency: 0
    },
    wellbeing: {
      averageMood: 0,
      energyLevel: 0,
      stressLevel: 0
    }
  }

  const insights = [
    {
      type: 'info',
      icon: <Brain className="h-5 w-5" />,
      title: 'Comienza tu viaje',
      description: 'Aún no tienes datos suficientes para generar insights. ¡Empieza a usar la plataforma!',
      impact: 'low'
    }
  ]

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'negative': return 'text-red-600 bg-red-50 border-red-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (value: number, previous: number) => {
    if (value > previous) return <ArrowUp className="h-4 w-4 text-green-500" />
    if (value < previous) return <ArrowDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (value: number, previous: number) => {
    if (value > previous) return 'text-green-600'
    if (value < previous) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <AppShell currentPage="progress">
      <div className="w-full max-w-none px-4 lg:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Progreso</h1>
            <p className="text-gray-600">
              Analiza tu evolución y descubre patrones en tu crecimiento personal
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <Button
                key={range.id}
                variant={timeRange === range.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range.id)}
              >
                {range.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hábitos Completados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.habits.completed}/{stats.habits.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.round((stats.habits.completed / stats.habits.total) * 100)}% de adherencia
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Racha Actual</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.habits.streak}</p>
                  <p className="text-sm text-gray-500">días consecutivos</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Metas Completadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.goals.completed}/{stats.goals.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stats.goals.successRate}% de éxito
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo de Enfoque</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.productivity.focusTime}h</p>
                  <p className="text-sm text-gray-500">promedio diario</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Insights de Kai
            </CardTitle>
            <p className="text-sm text-gray-500">
              Análisis inteligente de tus patrones y recomendaciones personalizadas
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant="outline" size="sm" className={getImpactColor(insight.impact)}>
                        {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Habits Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Progreso de Hábitos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Meditación', progress: 0, streak: 0 },
                  { name: 'Ejercicio', progress: 0, streak: 0 },
                  { name: 'Lectura', progress: 0, streak: 0 },
                  { name: 'Escritura', progress: 0, streak: 0 }
                ].map((habit, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{habit.name}</span>
                      <span className="text-sm text-gray-500">{habit.streak} días</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${habit.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-12 text-right">
                        {habit.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Wellbeing Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Bienestar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stats.wellbeing.averageMood}/5
                  </div>
                  <p className="text-sm text-gray-500">Estado de ánimo promedio</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Energía</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(stats.wellbeing.energyLevel / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{stats.wellbeing.energyLevel}/5</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Estrés</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(stats.wellbeing.stressLevel / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{stats.wellbeing.stressLevel}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Revisión Semanal
            </CardTitle>
            <p className="text-sm text-gray-500">
              Resumen de la semana y planificación para la siguiente
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Revisión semanal automática</p>
              <p className="text-sm text-gray-400 mb-6">
                Kai analizará tu progreso y te dará recomendaciones personalizadas
              </p>
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                Generar Revisión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
