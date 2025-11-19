'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight, ArrowLeft, Heart, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface ValuesStepProps {
  data: any
  onNext: (data: any) => void
  onBack: () => void
  onSkip: () => void
}

const coreValues = [
  'Honestidad', 'Integridad', 'Lealtad', 'Respeto', 'Responsabilidad',
  'Familia', 'Amistad', 'Amor', 'Compasión', 'Empatía',
  'Creatividad', 'Innovación', 'Excelencia', 'Aprendizaje', 'Sabiduría',
  'Libertad', 'Independencia', 'Autonomía', 'Seguridad', 'Estabilidad',
  'Aventura', 'Diversión', 'Pasión', 'Entusiasmo', 'Alegría',
  'Salud', 'Bienestar', 'Equilibrio', 'Armonía', 'Paz',
  'Éxito', 'Logro', 'Ambición', 'Poder', 'Influencia',
  'Generosidad', 'Servicio', 'Contribución', 'Justicia', 'Equidad',
  'Espiritualidad', 'Fe', 'Propósito', 'Significado', 'Trascendencia',
  'Autenticidad', 'Crecimiento', 'Valentía', 'Perseverancia', 'Gratitud',
]

export function ValuesStep({ data, onNext, onBack, onSkip }: ValuesStepProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    data?.values || []
  )

  const toggleValue = (value: string) => {
    setSelectedValues(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value)
      } else {
        if (prev.length >= 5) {
          toast.error('Puedes seleccionar máximo 5 valores')
          return prev
        }
        return [...prev, value]
      }
    })
  }

  const handleSubmit = () => {
    if (selectedValues.length < 3) {
      toast.error('Por favor selecciona al menos 3 valores')
      return
    }
    onNext(selectedValues)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <Heart className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tus Valores Fundamentales
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Selecciona 3-5 valores que sean más importantes para ti
        </p>
        <div className="mt-4">
          <span className="text-sm font-medium text-primary-600">
            {selectedValues.length} de 5 seleccionados
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
        {coreValues.map((value) => {
          const isSelected = selectedValues.includes(value)

          return (
            <button
              key={value}
              onClick={() => toggleValue(value)}
              className={`
                relative p-4 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-primary-600 bg-primary-50 shadow-md scale-105'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
              <span className={`text-sm font-medium ${isSelected ? 'text-primary-900' : 'text-gray-700'}`}>
                {value}
              </span>
            </button>
          )
        })}
      </div>

      <div className="bg-purple-50 p-4 rounded-lg max-w-4xl mx-auto">
        <p className="text-sm text-purple-900">
          <strong>💡 Reflexiona:</strong> Tus valores son tu brújula moral. Te ayudarán a tomar
          decisiones alineadas con lo que realmente importa y a crear metas significativas.
        </p>
      </div>

      <div className="flex gap-4 pt-4 max-w-4xl mx-auto">
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
          disabled={selectedValues.length < 3}
          className="flex-1"
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
