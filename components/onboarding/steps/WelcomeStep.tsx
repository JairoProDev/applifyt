'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Sparkles, Target, TrendingUp, Heart, CheckSquare, BarChart3 } from 'lucide-react'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 mb-4">
          <Sparkles className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900">
          ¡Bienvenido a Applifyt! 🚀
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tu plataforma completa para el crecimiento personal basada en el{' '}
          <span className="font-semibold text-primary-600">Protocolo U.P.L.I.F.T.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="p-6 bg-blue-50 rounded-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Define Metas</h3>
          <p className="text-sm text-gray-600">
            Crea objetivos claros con el framework WOOP y alcánzalos paso a paso
          </p>
        </div>

        <div className="p-6 bg-green-50 rounded-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
            <CheckSquare className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Construye Hábitos</h3>
          <p className="text-sm text-gray-600">
            Implementa rutinas efectivas basadas en Atomic Habits de James Clear
          </p>
        </div>

        <div className="p-6 bg-purple-50 rounded-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Mide Progreso</h3>
          <p className="text-sm text-gray-600">
            Visualiza tu evolución con métricas detalladas y análisis profundos
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-6 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-4">El Protocolo U.P.L.I.F.T.</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
          <div>
            <div className="font-semibold text-primary-600">U - Understand</div>
            <div className="text-sm text-gray-600">Comprende tu situación actual</div>
          </div>
          <div>
            <div className="font-semibold text-primary-600">P - Plan</div>
            <div className="text-sm text-gray-600">Planifica tus objetivos</div>
          </div>
          <div>
            <div className="font-semibold text-primary-600">L - Launch</div>
            <div className="text-sm text-gray-600">Lanza tus hábitos</div>
          </div>
          <div>
            <div className="font-semibold text-primary-600">I - Iterate</div>
            <div className="text-sm text-gray-600">Itera y mejora</div>
          </div>
          <div>
            <div className="font-semibold text-primary-600">F - Fortify</div>
            <div className="text-sm text-gray-600">Fortalece tu resiliencia</div>
          </div>
          <div>
            <div className="font-semibold text-primary-600">T - Transcend</div>
            <div className="text-sm text-gray-600">Trasciende y comparte</div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={onNext}
          size="lg"
          className="px-8"
        >
          Comenzar mi transformación
          <Sparkles className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Solo toma 5 minutos configurar tu perfil
        </p>
      </div>
    </div>
  )
}
