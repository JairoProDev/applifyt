'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { ArrowRight, ArrowLeft, Target } from 'lucide-react'
import toast from 'react-hot-toast'

interface FirstGoalStepProps {
  data: any
  onNext: (data: any) => void
  onBack: () => void
  onSkip: () => void
}

export function FirstGoalStep({ data, onNext, onBack, onSkip }: FirstGoalStepProps) {
  const [formData, setFormData] = useState({
    title: data?.firstGoal?.title || '',
    wish: data?.firstGoal?.wish || '',
    outcome: data?.firstGoal?.outcome || '',
    obstacle: data?.firstGoal?.obstacle || '',
    plan: data?.firstGoal?.plan || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Por favor ingresa un título para tu meta')
      return
    }

    if (!formData.wish.trim() || !formData.outcome.trim()) {
      toast.error('Por favor completa al menos el deseo y el resultado esperado')
      return
    }

    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <Target className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tu Primera Meta
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Usa el método WOOP para definir una meta poderosa y alcanzable
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título de tu Meta *
          </label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ej: Mejorar mi salud física"
            autoFocus
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Método WOOP</h3>
          <p className="text-sm text-blue-800">
            WOOP es un framework científico que aumenta significativamente tus probabilidades de éxito.
          </p>
        </div>

        <div>
          <label htmlFor="wish" className="block text-sm font-medium text-gray-700 mb-2">
            W - Wish (Deseo) *
          </label>
          <Textarea
            id="wish"
            value={formData.wish}
            onChange={(e) => setFormData(prev => ({ ...prev, wish: e.target.value }))}
            placeholder="¿Qué deseas lograr? Sé específico..."
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 mb-2">
            O - Outcome (Resultado) *
          </label>
          <Textarea
            id="outcome"
            value={formData.outcome}
            onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
            placeholder="¿Cuál es el mejor resultado posible? Imagínalo vívidamente..."
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="obstacle" className="block text-sm font-medium text-gray-700 mb-2">
            O - Obstacle (Obstáculo)
          </label>
          <Textarea
            id="obstacle"
            value={formData.obstacle}
            onChange={(e) => setFormData(prev => ({ ...prev, obstacle: e.target.value }))}
            placeholder="¿Cuál es el principal obstáculo interno que podría impedirte lograrlo?"
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
            P - Plan (Plan)
          </label>
          <Textarea
            id="plan"
            value={formData.plan}
            onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
            placeholder="Si [obstáculo], entonces yo [acción específica]..."
            rows={2}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ejemplo: "Si siento pereza por las mañanas, entonces prepararé mi ropa deportiva la noche anterior"
          </p>
        </div>

        <div className="flex gap-4 pt-4">
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
          <Button type="submit" className="flex-1">
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
