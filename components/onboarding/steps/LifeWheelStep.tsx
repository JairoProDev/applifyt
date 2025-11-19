'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight, ArrowLeft, Heart, Briefcase, Users, Activity, Brain, Wallet, Home, Smile } from 'lucide-react'

interface LifeWheelStepProps {
  data: any
  onNext: (data: any) => void
  onBack: () => void
  onSkip: () => void
}

const lifeAreas = [
  { id: 'health', name: 'Salud Física', icon: Activity, color: 'bg-red-100 text-red-600' },
  { id: 'mental', name: 'Salud Mental', icon: Brain, color: 'bg-purple-100 text-purple-600' },
  { id: 'career', name: 'Carrera', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
  { id: 'finances', name: 'Finanzas', icon: Wallet, color: 'bg-green-100 text-green-600' },
  { id: 'relationships', name: 'Relaciones', icon: Users, color: 'bg-pink-100 text-pink-600' },
  { id: 'family', name: 'Familia', icon: Home, color: 'bg-orange-100 text-orange-600' },
  { id: 'personal', name: 'Crecimiento Personal', icon: Smile, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'spiritual', name: 'Espiritualidad', icon: Heart, color: 'bg-indigo-100 text-indigo-600' },
]

export function LifeWheelStep({ data, onNext, onBack, onSkip }: LifeWheelStepProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    data?.lifeWheel || {}
  )

  const handleSubmit = () => {
    onNext(scores)
  }

  const allScored = lifeAreas.every(area => scores[area.id] !== undefined)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <Activity className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Balance de Vida
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Evalúa tu satisfacción actual en cada área de tu vida del 1 al 10
        </p>
      </div>

      <div className="space-y-6 max-w-3xl mx-auto">
        {lifeAreas.map((area) => {
          const Icon = area.icon
          const score = scores[area.id]

          return (
            <div key={area.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${area.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900">{area.name}</span>
                </div>
                <span className="text-2xl font-bold text-primary-600">
                  {score !== undefined ? score : '-'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <button
                    key={value}
                    onClick={() => setScores(prev => ({ ...prev, [area.id]: value }))}
                    className={`
                      flex-1 h-10 rounded-lg border-2 transition-all font-medium
                      ${score === value
                        ? 'border-primary-600 bg-primary-600 text-white scale-110'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                      }
                    `}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg max-w-3xl mx-auto">
        <p className="text-sm text-blue-900">
          <strong>💡 Consejo:</strong> Sé honesto contigo mismo. Esta evaluación te ayudará a identificar
          áreas que necesitan más atención y te guiará en la creación de tus metas.
        </p>
      </div>

      <div className="flex gap-4 pt-4 max-w-3xl mx-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atrás
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          className="flex-1"
        >
          Omitir
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!allScored}
          className="flex-1"
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
