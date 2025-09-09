'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { 
  BookOpen, 
  Lightbulb, 
  Heart, 
  Target,
  Save,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface JournalPrompt {
  id: string
  title: string
  question: string
  icon: React.ComponentType<any>
  category: string
  description: string
}

const journalPrompts: JournalPrompt[] = [
  {
    id: 'challenge_analysis',
    title: 'Análisis de Desafíos',
    question: 'Describe un desafío reciente que enfrentaste. ¿Qué pensamientos tuviste? ¿Cómo te sentiste? ¿Qué acciones tomaste?',
    icon: Target,
    category: 'Cognitivo-Conductual',
    description: 'Explora la conexión entre tus pensamientos, sentimientos y comportamientos'
  },
  {
    id: 'values_alignment',
    title: 'Alineación con Valores',
    question: '¿En qué situaciones recientes te sentiste más alineado con tus valores? ¿Cuándo te sentiste desconectado?',
    icon: Heart,
    category: 'Clarificación de Valores',
    description: 'Reflexiona sobre cómo tus acciones reflejan tus valores fundamentales'
  },
  {
    id: 'growth_mindset',
    title: 'Mentalidad de Crecimiento',
    question: 'Describe un error o fracaso reciente. ¿Qué aprendiste de él? ¿Cómo puedes usar esta experiencia para crecer?',
    icon: Lightbulb,
    category: 'Desarrollo Personal',
    description: 'Practica ver los errores como oportunidades de aprendizaje'
  },
  {
    id: 'gratitude_practice',
    title: 'Práctica de Gratitud',
    question: '¿Por qué tres cosas específicas estás agradecido hoy? ¿Cómo han impactado tu vida?',
    icon: Heart,
    category: 'Bienestar',
    description: 'Cultiva la gratitud para mejorar tu bienestar general'
  },
  {
    id: 'future_self',
    title: 'Tu Yo Futuro',
    question: 'Imagina tu vida en 5 años. ¿Qué tipo de persona quieres ser? ¿Qué hábitos y valores quieres haber desarrollado?',
    icon: Target,
    category: 'Visión',
    description: 'Conecta con tu visión de futuro para motivar el cambio presente'
  },
  {
    id: 'obstacle_identification',
    title: 'Identificación de Obstáculos',
    question: '¿Qué patrones de pensamiento o comportamiento te están frenando? ¿Qué creencias limitantes tienes?',
    icon: Lightbulb,
    category: 'Autoconciencia',
    description: 'Identifica los obstáculos internos para poder superarlos'
  }
]

interface GuidedJournalingProps {
  onComplete?: (entries: Record<string, string>) => void
}

export function GuidedJournaling({ onComplete }: GuidedJournalingProps) {
  const { data: session } = useSession()
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [entries, setEntries] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEntryChange = (promptId: string, value: string) => {
    setEntries(prev => ({ ...prev, [promptId]: value }))
  }

  const handleNext = () => {
    if (currentPrompt < journalPrompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1)
    }
  }

  const handleSubmit = async () => {
    const completedEntries = Object.keys(entries).length
    if (completedEntries < 3) {
      toast.error('Completa al menos 3 reflexiones')
      return
    }

    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/assessment/journaling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
      })

      if (!response.ok) throw new Error('Error al guardar las reflexiones')

      toast.success('Reflexiones guardadas exitosamente')
      onComplete?.(entries)
    } catch (error) {
      toast.error('Error al guardar las reflexiones')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentJournalPrompt = journalPrompts[currentPrompt]
  const Icon = currentJournalPrompt.icon
  const currentEntry = entries[currentJournalPrompt.id] || ''

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
          Journaling Guiado
        </CardTitle>
        <p className="text-sm text-gray-600">
          Reflexiona sobre tu vida usando técnicas de terapia cognitivo-conductual.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {journalPrompts.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentPrompt
                    ? 'bg-primary-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {currentPrompt + 1} de {journalPrompts.length}
          </span>
        </div>

        {/* Current Prompt */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Icon className="h-6 w-6 text-primary-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {currentJournalPrompt.title}
              </h3>
              <Badge variant="gray" size="sm">
                {currentJournalPrompt.category}
              </Badge>
            </div>
          </div>
          
          <p className="text-gray-600">
            {currentJournalPrompt.description}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Pregunta de reflexión:
            </h4>
            <p className="text-gray-700">
              {currentJournalPrompt.question}
            </p>
          </div>
        </div>

        {/* Journal Entry */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tu reflexión:
          </label>
          <Textarea
            value={currentEntry}
            onChange={(e) => handleEntryChange(currentJournalPrompt.id, e.target.value)}
            placeholder="Escribe tus pensamientos aquí... No hay respuestas correctas o incorrectas. Sé honesto contigo mismo."
            rows={8}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            {currentEntry.length} caracteres
          </p>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            💡 Consejos para una reflexión efectiva:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Sé específico y detallado en tus respuestas</li>
            <li>• No juzgues tus pensamientos, solo obsérvalos</li>
            <li>• Escribe libremente sin preocuparte por la gramática</li>
            <li>• Si te quedas en blanco, escribe "No sé qué escribir" y continúa</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentPrompt === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {currentPrompt < journalPrompts.length - 1 ? (
            <Button onClick={handleNext}>
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(entries).length < 3 || isSubmitting}
              loading={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Reflexiones
            </Button>
          )}
        </div>

        {/* Summary */}
        {Object.keys(entries).length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Progreso de tu reflexión:
            </h4>
            <p className="text-sm text-gray-600">
              Has completado {Object.keys(entries).length} de {journalPrompts.length} reflexiones.
              {Object.keys(entries).length >= 3 && ' ¡Excelente trabajo!'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
