'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Smile, 
  Frown, 
  Meh, 
  Heart,
  Zap,
  Target,
  Send
} from 'lucide-react'
import toast from 'react-hot-toast'

export function QuickCheckIn() {
  const [mood, setMood] = useState<number | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [stress, setStress] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mood === null || energy === null || stress === null) {
      toast.error('Por favor completa todos los campos')
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setIsSubmitted(true)
      toast.success('Check-in guardado exitosamente')
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setMood(null)
        setEnergy(null)
        setStress(null)
        setNote('')
      }, 3000)
    } catch (error) {
      toast.error('Error al guardar el check-in')
    }
  }

  const getMoodIcon = (value: number) => {
    if (value >= 4) return <Smile className="h-6 w-6 text-green-500" />
    if (value >= 3) return <Meh className="h-6 w-6 text-yellow-500" />
    return <Frown className="h-6 w-6 text-red-500" />
  }

  const getMoodLabel = (value: number) => {
    if (value >= 4) return 'Excelente'
    if (value >= 3) return 'Bien'
    if (value >= 2) return 'Regular'
    return 'Mal'
  }

  const getEnergyColor = (value: number) => {
    if (value >= 4) return 'text-green-600'
    if (value >= 3) return 'text-yellow-600'
    if (value >= 2) return 'text-orange-600'
    return 'text-red-600'
  }

  const getStressColor = (value: number) => {
    if (value <= 2) return 'text-green-600'
    if (value <= 3) return 'text-yellow-600'
    if (value <= 4) return 'text-orange-600'
    return 'text-red-600'
  }

  if (isSubmitted) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-medium text-green-900 mb-1">¡Check-in completado!</h3>
          <p className="text-sm text-green-700">
            Gracias por compartir cómo te sientes hoy
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Check-in Rápido
        </CardTitle>
        <p className="text-sm text-gray-500">
          ¿Cómo te sientes hoy? Esto ayuda a Kai a darte mejores sugerencias
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado de ánimo
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMood(value)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    mood === value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {getMoodIcon(value)}
                </button>
              ))}
            </div>
            {mood && (
              <p className="text-sm text-gray-600 mt-1">
                {getMoodLabel(mood)}
              </p>
            )}
          </div>

          {/* Energy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de energía
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEnergy(value)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    energy === value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Zap className={`h-5 w-5 ${getEnergyColor(value)}`} />
                </button>
              ))}
            </div>
            {energy && (
              <p className="text-sm text-gray-600 mt-1">
                {energy === 5 ? 'Muy alta' : energy === 4 ? 'Alta' : energy === 3 ? 'Media' : energy === 2 ? 'Baja' : 'Muy baja'}
              </p>
            )}
          </div>

          {/* Stress */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de estrés
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStress(value)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    stress === value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Target className={`h-5 w-5 ${getStressColor(value)}`} />
                </button>
              ))}
            </div>
            {stress && (
              <p className="text-sm text-gray-600 mt-1">
                {stress === 5 ? 'Muy alto' : stress === 4 ? 'Alto' : stress === 3 ? 'Medio' : stress === 2 ? 'Bajo' : 'Muy bajo'}
              </p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nota rápida (opcional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="¿Algo específico que quieras recordar?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={2}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700"
            disabled={mood === null || energy === null || stress === null}
          >
            <Send className="h-4 w-4 mr-2" />
            Guardar Check-in
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
