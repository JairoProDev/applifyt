'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { 
  BookOpen, 
  Plus, 
  X, 
  Save,
  TrendingUp,
  Target,
  CheckSquare,
  Heart
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useDashboard } from '@/hooks/useDashboard'
import toast from 'react-hot-toast'

interface WeeklyReviewFormProps {
  onComplete?: () => void
}

export function WeeklyReviewForm({ onComplete }: WeeklyReviewFormProps) {
  const { data: session } = useSession()
  const { submitWeeklyReview } = useDashboard()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Review sections
  const [wins, setWins] = useState<string[]>([''])
  const [challenges, setChallenges] = useState<string[]>([''])
  const [lessons, setLessons] = useState<string[]>([''])
  
  // Next week planning
  const [nextWeekFocus, setNextWeekFocus] = useState('')
  const [adjustments, setAdjustments] = useState('')

  const addItem = (section: 'wins' | 'challenges' | 'lessons') => {
    switch (section) {
      case 'wins':
        setWins(prev => [...prev, ''])
        break
      case 'challenges':
        setChallenges(prev => [...prev, ''])
        break
      case 'lessons':
        setLessons(prev => [...prev, ''])
        break
    }
  }

  const removeItem = (section: 'wins' | 'challenges' | 'lessons', index: number) => {
    switch (section) {
      case 'wins':
        setWins(prev => prev.filter((_, i) => i !== index))
        break
      case 'challenges':
        setChallenges(prev => prev.filter((_, i) => i !== index))
        break
      case 'lessons':
        setLessons(prev => prev.filter((_, i) => i !== index))
        break
    }
  }

  const updateItem = (section: 'wins' | 'challenges' | 'lessons', index: number, value: string) => {
    switch (section) {
      case 'wins':
        setWins(prev => prev.map((item, i) => i === index ? value : item))
        break
      case 'challenges':
        setChallenges(prev => prev.map((item, i) => i === index ? value : item))
        break
      case 'lessons':
        setLessons(prev => prev.map((item, i) => i === index ? value : item))
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const filteredWins = wins.filter(win => win.trim() !== '')
    const filteredChallenges = challenges.filter(challenge => challenge.trim() !== '')
    const filteredLessons = lessons.filter(lesson => lesson.trim() !== '')

    if (filteredWins.length === 0 || filteredChallenges.length === 0 || filteredLessons.length === 0) {
      toast.error('Completa al menos una victoria, un desafío y una lección')
      return
    }

    try {
      setIsSubmitting(true)
      
      await submitWeeklyReview({
        wins: filteredWins,
        challenges: filteredChallenges,
        lessons: filteredLessons,
        nextWeekFocus,
        adjustments,
      })
      
      toast.success('Revisión semanal guardada exitosamente')
      onComplete?.()
    } catch (error) {
      toast.error('Error al guardar la revisión semanal')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderListSection = (
    title: string,
    items: string[],
    section: 'wins' | 'challenges' | 'lessons',
    icon: React.ComponentType<any>,
    color: string,
    placeholder: string
  ) => {
    const Icon = icon
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${color}`} />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={item}
                onChange={(e) => updateItem(section, index, e.target.value)}
                placeholder={placeholder}
                className="flex-1"
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(section, index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addItem(section)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar {title.slice(0, -1)}
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
          Revisión Semanal
        </CardTitle>
        <p className="text-sm text-gray-600">
          Reflexiona sobre la semana que termina y planifica la próxima.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Wins */}
          {renderListSection(
            'Victorias',
            wins,
            'wins',
            TrendingUp,
            'text-green-600',
            '¿Qué lograste esta semana?'
          )}

          {/* Challenges */}
          {renderListSection(
            'Desafíos',
            challenges,
            'challenges',
            Target,
            'text-orange-600',
            '¿Qué obstáculos enfrentaste?'
          )}

          {/* Lessons */}
          {renderListSection(
            'Lecciones',
            lessons,
            'lessons',
            CheckSquare,
            'text-blue-600',
            '¿Qué aprendiste esta semana?'
          )}

          {/* Next Week Focus */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Enfoque de la Próxima Semana</h3>
            </div>
            
            <Textarea
              value={nextWeekFocus}
              onChange={(e) => setNextWeekFocus(e.target.value)}
              placeholder="¿En qué te quieres enfocar la próxima semana? ¿Qué es lo más importante?"
              rows={3}
            />
          </div>

          {/* Adjustments */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">Ajustes y Mejoras</h3>
            </div>
            
            <Textarea
              value={adjustments}
              onChange={(e) => setAdjustments(e.target.value)}
              placeholder="¿Qué cambios quieres hacer en tus hábitos, rutinas o enfoque?"
              rows={3}
            />
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              💡 Consejos para una revisión efectiva:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Sé específico y honesto en tus reflexiones</li>
              <li>• Celebra las victorias, por pequeñas que sean</li>
              <li>• Ve los desafíos como oportunidades de crecimiento</li>
              <li>• Planifica ajustes concretos y realizables</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Revisión Semanal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
