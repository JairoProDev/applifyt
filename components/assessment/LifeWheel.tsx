'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { 
  Heart, 
  DollarSign, 
  Users, 
  Briefcase, 
  BookOpen, 
  Home,
  Zap,
  Brain,
  Save
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface LifeArea {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  description: string
}

const lifeAreas: LifeArea[] = [
  {
    id: 'health',
    name: 'Salud Física',
    icon: Heart,
    color: 'text-red-500',
    description: 'Ejercicio, nutrición, descanso, bienestar físico'
  },
  {
    id: 'finances',
    name: 'Finanzas',
    icon: DollarSign,
    color: 'text-green-500',
    description: 'Ingresos, ahorros, inversiones, libertad financiera'
  },
  {
    id: 'relationships',
    name: 'Relaciones',
    icon: Users,
    color: 'text-blue-500',
    description: 'Familia, amigos, pareja, conexiones sociales'
  },
  {
    id: 'career',
    name: 'Carrera',
    icon: Briefcase,
    color: 'text-purple-500',
    description: 'Trabajo, desarrollo profesional, logros'
  },
  {
    id: 'learning',
    name: 'Aprendizaje',
    icon: BookOpen,
    color: 'text-orange-500',
    description: 'Educación, habilidades, crecimiento intelectual'
  },
  {
    id: 'environment',
    name: 'Entorno',
    icon: Home,
    color: 'text-teal-500',
    description: 'Hogar, espacio de trabajo, ambiente físico'
  },
  {
    id: 'energy',
    name: 'Energía',
    icon: Zap,
    color: 'text-yellow-500',
    description: 'Vitalidad, motivación, entusiasmo por la vida'
  },
  {
    id: 'mindset',
    name: 'Mentalidad',
    icon: Brain,
    color: 'text-indigo-500',
    description: 'Pensamientos, creencias, actitud mental'
  }
]

interface LifeWheelProps {
  onComplete?: (scores: Record<string, number>) => void
}

export function LifeWheel({ onComplete }: LifeWheelProps) {
  const { data: session } = useSession()
  const [scores, setScores] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleScoreChange = (areaId: string, score: number) => {
    setScores(prev => ({ ...prev, [areaId]: score }))
  }

  const calculateAverage = () => {
    const values = Object.values(scores)
    return values.length > 0 ? values.reduce((sum, score) => sum + score, 0) / values.length : 0
  }

  const isComplete = Object.keys(scores).length === lifeAreas.length

  const handleSubmit = async () => {
    if (!isComplete) {
      toast.error('Por favor evalúa todas las áreas de tu vida')
      return
    }

    try {
      setIsSubmitting(true)
      
      // Save assessment to database
      const response = await fetch('/api/assessment/life-wheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores }),
      })

      if (!response.ok) throw new Error('Error al guardar la evaluación')

      toast.success('Evaluación guardada exitosamente')
      onComplete?.(scores)
    } catch (error) {
      toast.error('Error al guardar la evaluación')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-primary-600" />
          Rueda de la Vida
        </CardTitle>
        <p className="text-sm text-gray-600">
          Evalúa cada área de tu vida en una escala del 1 al 10. Sé honesto contigo mismo.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progreso de la evaluación
            </span>
            <span className="text-sm text-gray-500">
              {Object.keys(scores).length}/{lifeAreas.length} áreas evaluadas
            </span>
          </div>
          <ProgressBar 
            value={(Object.keys(scores).length / lifeAreas.length) * 100}
            color="primary"
            showLabel={false}
          />
        </div>

        {/* Life Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lifeAreas.map((area) => {
            const Icon = area.icon
            const currentScore = scores[area.id] || 0
            
            return (
              <div key={area.id} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${area.color}`} />
                  <div>
                    <h3 className="font-medium text-gray-900">{area.name}</h3>
                    <p className="text-xs text-gray-500">{area.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nivel actual:</span>
                    <span className="font-medium text-gray-900">{currentScore}/10</span>
                  </div>
                  
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        onClick={() => handleScoreChange(area.id, score)}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          currentScore >= score
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Muy bajo</span>
                    <span>Muy alto</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Results Summary */}
        {isComplete && (
          <div className="bg-primary-50 p-4 rounded-lg">
            <h3 className="font-medium text-primary-900 mb-2">
              Resumen de tu Rueda de la Vida
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-700">
                Puntuación promedio: {calculateAverage().toFixed(1)}/10
              </span>
              <div className="text-sm text-primary-600">
                {calculateAverage() >= 8 ? 'Excelente equilibrio' :
                 calculateAverage() >= 6 ? 'Buen equilibrio' :
                 calculateAverage() >= 4 ? 'Necesita mejora' : 'Requiere atención urgente'}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            loading={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Evaluación
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
