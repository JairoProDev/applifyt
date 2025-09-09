'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { WeeklyReviewForm } from '@/components/review/WeeklyReviewForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Target,
  Heart
} from 'lucide-react'
import { formatDate, getWeekRange } from '@/lib/utils'

export default function WeeklyReviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(false)

  if (status === 'loading') {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const currentWeek = getWeekRange(new Date())
  const weekStart = formatDate(currentWeek.start)
  const weekEnd = formatDate(currentWeek.end)

  if (isCompleted) {
    return (
      <Layout>
        <div className="p-6 max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Revisión Semanal Completada!
              </h2>
              <p className="text-gray-600 mb-6">
                Has completado tu revisión para la semana del {weekStart} al {weekEnd}.
              </p>
              
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-medium text-gray-900">
                  Beneficios de la revisión semanal:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Mejora continua</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span>Mayor enfoque</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Bienestar mental</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button onClick={() => router.push('/dashboard')}>
                  Volver al Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Revisión Semanal
          </h1>
          <p className="text-gray-600 mb-4">
            Semana del {weekStart} al {weekEnd}
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            La revisión semanal es una práctica fundamental del Protocolo U.P.L.I.F.T. 
            Te ayuda a reflexionar, aprender y ajustar tu rumbo hacia tus objetivos.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Mejora Continua</h3>
              <p className="text-sm text-gray-600">
                Identifica patrones y oportunidades de mejora en tus hábitos y rutinas.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Mayor Enfoque</h3>
              <p className="text-sm text-gray-600">
                Clarifica tus prioridades y ajusta tu enfoque para la próxima semana.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Bienestar Mental</h3>
              <p className="text-sm text-gray-600">
                Procesa emociones, celebra logros y mantén una perspectiva positiva.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Review Form */}
        <WeeklyReviewForm onComplete={() => setIsCompleted(true)} />
      </div>
    </Layout>
  )
}
