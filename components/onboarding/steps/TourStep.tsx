'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, CheckCircle, Target, CheckSquare, BarChart3, Calendar, Users, Settings, Sparkles } from 'lucide-react'

interface TourStepProps {
  onNext: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function TourStep({ onNext, onBack, isSubmitting }: TourStepProps) {
  const features = [
    {
      icon: Target,
      title: 'Metas',
      description: 'Define y alcanza tus objetivos con el framework WOOP',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: CheckSquare,
      title: 'Hábitos',
      description: 'Construye rutinas efectivas con Atomic Habits',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: BarChart3,
      title: 'Dashboard',
      description: 'Visualiza tu progreso con métricas detalladas',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Calendar,
      title: 'Check-ins',
      description: 'Reflexiona diariamente sobre tu bienestar',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Calendar,
      title: 'Revisión Semanal',
      description: 'Analiza y ajusta tu estrategia cada semana',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Users,
      title: 'Resiliencia',
      description: 'Fortalece tu mentalidad y supera obstáculos',
      color: 'bg-red-100 text-red-600',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          ¡Todo Listo! 🎉
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Has completado tu configuración inicial. Ahora exploremos las herramientas que te ayudarán en tu transformación.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="p-6 bg-white rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${feature.color} mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-gradient-to-r from-primary-500 to-purple-600 p-8 rounded-2xl text-white text-center">
        <Sparkles className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          Tu Viaje Comienza Ahora
        </h3>
        <p className="text-primary-100 max-w-2xl mx-auto mb-6">
          Recuerda: El éxito no se trata de cambios radicales, sino de pequeñas mejoras consistentes.
          Un 1% mejor cada día resulta en un 37x de mejora al año.
        </p>
        <div className="flex flex-wrap gap-2 justify-center text-sm">
          <span className="px-4 py-2 bg-white/20 rounded-full">Consistencia > Perfección</span>
          <span className="px-4 py-2 bg-white/20 rounded-full">Progreso > Resultados</span>
          <span className="px-4 py-2 bg-white/20 rounded-full">Acción > Motivación</span>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atrás
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
          loading={isSubmitting}
          disabled={isSubmitting}
          size="lg"
        >
          Ir al Dashboard
          <Sparkles className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
