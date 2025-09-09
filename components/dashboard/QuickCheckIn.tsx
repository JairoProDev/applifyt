'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { 
  Heart, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import toast from 'react-hot-toast'

interface QuickCheckInProps {
  hasCheckedInToday?: boolean
}

export function QuickCheckIn({ hasCheckedInToday = false }: QuickCheckInProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mood, setMood] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [stress, setStress] = useState(3)
  const [gratitude, setGratitude] = useState('')
  const [win, setWin] = useState('')
  const { checkInToday } = useDashboard()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      await checkInToday({
        mood,
        energy,
        stress,
        gratitude,
        win,
      })
      toast.success('Check-in completado exitosamente')
    } catch (error) {
      toast.error('Error al completar el check-in')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasCheckedInToday) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-success-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Check-in completado
            </h3>
            <p className="text-gray-600">
              Ya has completado tu check-in de hoy. ¡Excelente trabajo!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-primary-600" />
          Check-in Rápido
        </CardTitle>
        <p className="text-sm text-gray-600">
          Tómate un momento para reflexionar sobre tu día
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood, Energy, Stress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Heart className="h-4 w-4 inline mr-1" />
                Estado de ánimo
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMood(value)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      mood >= value
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">1 = Muy bajo, 5 = Muy alto</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="h-4 w-4 inline mr-1" />
                Energía
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEnergy(value)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      energy >= value
                        ? 'bg-yellow-500 border-yellow-500 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">1 = Muy bajo, 5 = Muy alto</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Estrés
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStress(value)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      stress >= value
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">1 = Muy bajo, 5 = Muy alto</p>
            </div>
          </div>

          {/* Gratitude and Win */}
          <div className="space-y-4">
            <Textarea
              label="¿Por qué estás agradecido hoy?"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Escribe algo por lo que te sientas agradecido..."
              rows={2}
            />
            
            <Textarea
              label="¿Cuál fue tu victoria del día?"
              value={win}
              onChange={(e) => setWin(e.target.value)}
              placeholder="Comparte algo positivo que lograste hoy..."
              rows={2}
            />
          </div>

          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Completar Check-in
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
