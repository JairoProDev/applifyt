'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { ArrowRight, ArrowLeft, CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'

interface FirstHabitStepProps {
  data: any
  onNext: (data: any) => void
  onBack: () => void
  onSkip: () => void
}

export function FirstHabitStep({ data, onNext, onBack, onSkip }: FirstHabitStepProps) {
  const [formData, setFormData] = useState({
    name: data?.firstHabit?.name || '',
    cue: data?.firstHabit?.cue || '',
    routine: data?.firstHabit?.routine || '',
    reward: data?.firstHabit?.reward || '',
    craving: data?.firstHabit?.craving || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Por favor ingresa un nombre para tu hábito')
      return
    }

    if (!formData.cue.trim() || !formData.routine.trim() || !formData.reward.trim()) {
      toast.error('Por favor completa el bucle de hábito (señal, rutina, recompensa)')
      return
    }

    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <CheckSquare className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tu Primer Hábito
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Diseña un hábito poderoso con el bucle de Atomic Habits
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Hábito *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ej: Meditar por las mañanas"
            autoFocus
          />
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">El Bucle del Hábito</h3>
          <p className="text-sm text-green-800">
            Basado en Atomic Habits de James Clear. Este bucle es la clave para hacer que tu hábito se mantenga.
          </p>
        </div>

        <div>
          <label htmlFor="cue" className="block text-sm font-medium text-gray-700 mb-2">
            1. Señal (Cue) *
          </label>
          <Input
            id="cue"
            type="text"
            value={formData.cue}
            onChange={(e) => setFormData(prev => ({ ...prev, cue: e.target.value }))}
            placeholder="¿Qué activará este hábito? Ej: Después de despertarme"
          />
          <p className="text-xs text-gray-500 mt-1">
            Puede ser un momento del día, una ubicación, un evento anterior, un estado emocional, o una persona
          </p>
        </div>

        <div>
          <label htmlFor="routine" className="block text-sm font-medium text-gray-700 mb-2">
            2. Rutina (Routine) *
          </label>
          <Textarea
            id="routine"
            value={formData.routine}
            onChange={(e) => setFormData(prev => ({ ...prev, routine: e.target.value }))}
            placeholder="¿Qué acción específica vas a realizar? Sé muy específico..."
            rows={2}
          />
          <p className="text-xs text-gray-500 mt-1">
            Consejo: Empieza pequeño. "2 minutos de meditación" es mejor que "30 minutos"
          </p>
        </div>

        <div>
          <label htmlFor="reward" className="block text-sm font-medium text-gray-700 mb-2">
            3. Recompensa (Reward) *
          </label>
          <Input
            id="reward"
            type="text"
            value={formData.reward}
            onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
            placeholder="¿Cómo te premiarás? Ej: Disfrutar mi café favorito"
          />
        </div>

        <div>
          <label htmlFor="craving" className="block text-sm font-medium text-gray-700 mb-2">
            4. Anhelo (Craving)
          </label>
          <Input
            id="craving"
            type="text"
            value={formData.craving}
            onChange={(e) => setFormData(prev => ({ ...prev, craving: e.target.value }))}
            placeholder="¿Qué necesidad satisface? Ej: Sentirme calmado y centrado"
          />
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-900">
            <strong>💡 Regla de los 2 minutos:</strong> Un nuevo hábito debe tomar menos de 2 minutos para completarse.
            Puedes expandirlo después de que se vuelva automático.
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
