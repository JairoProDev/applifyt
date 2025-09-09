'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  AlertTriangle, 
  Lightbulb, 
  Heart, 
  Target,
  Save,
  Plus,
  X,
  CheckCircle
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface FailureEntry {
  id: string
  date: string
  description: string
  impact: 'low' | 'medium' | 'high'
  category: string
  lesson: string
  action: string
  status: 'processing' | 'learned' | 'applied'
}

interface FailureManagementProps {
  onComplete?: () => void
}

export function FailureManagement({ onComplete }: FailureManagementProps) {
  const { data: session } = useSession()
  const [failures, setFailures] = useState<FailureEntry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  // Form state
  const [description, setDescription] = useState('')
  const [impact, setImpact] = useState<'low' | 'medium' | 'high'>('medium')
  const [category, setCategory] = useState('')
  const [lesson, setLesson] = useState('')
  const [action, setAction] = useState('')

  const categories = [
    'Hábitos',
    'Metas',
    'Relaciones',
    'Trabajo',
    'Salud',
    'Finanzas',
    'Aprendizaje',
    'Otro'
  ]

  const handleSubmitFailure = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!description.trim() || !lesson.trim() || !action.trim()) {
      toast.error('Completa todos los campos requeridos')
      return
    }

    const newFailure: FailureEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: description.trim(),
      impact,
      category: category || 'Otro',
      lesson: lesson.trim(),
      action: action.trim(),
      status: 'processing'
    }

    setFailures(prev => [newFailure, ...prev])
    
    // Reset form
    setDescription('')
    setImpact('medium')
    setCategory('')
    setLesson('')
    setAction('')
    setShowForm(false)
    
    toast.success('Fracaso registrado exitosamente')
  }

  const updateFailureStatus = (id: string, status: FailureEntry['status']) => {
    setFailures(prev => prev.map(failure => 
      failure.id === id ? { ...failure, status } : failure
    ))
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'success'
      case 'medium': return 'warning'
      case 'high': return 'danger'
      default: return 'gray'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'warning'
      case 'learned': return 'primary'
      case 'applied': return 'success'
      default: return 'gray'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return 'Procesando'
      case 'learned': return 'Aprendido'
      case 'applied': return 'Aplicado'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Gestión del Fracaso
          </CardTitle>
          <p className="text-sm text-gray-600">
            Transforma los fracasos en oportunidades de crecimiento usando la autocompasión y el aprendizaje.
          </p>
        </CardHeader>
      </Card>

      {/* Add Failure Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar un Fracaso
        </Button>
      </div>

      {/* Failure Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar un Fracaso</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitFailure} className="space-y-4">
              <Textarea
                label="Describe el fracaso o contratiempo"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Sé específico sobre qué pasó, cuándo y en qué contexto..."
                rows={3}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impacto
                  </label>
                  <select
                    value={impact}
                    onChange={(e) => setImpact(e.target.value as any)}
                    className="input"
                  >
                    <option value="low">Bajo - Impacto mínimo</option>
                    <option value="medium">Medio - Impacto moderado</option>
                    <option value="high">Alto - Impacto significativo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Textarea
                label="¿Qué lección aprendiste?"
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
                placeholder="¿Qué puedes aprender de esta experiencia? ¿Qué harías diferente?"
                rows={3}
                required
              />
              
              <Textarea
                label="¿Qué acción específica tomarás?"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="¿Qué harás para aplicar esta lección en el futuro?"
                rows={3}
                required
              />
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Failures List */}
      {failures.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Historial de Fracasos ({failures.length})
          </h3>
          
          {failures.map((failure) => (
            <Card key={failure.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Badge variant={getImpactColor(failure.impact)} size="sm">
                      {failure.impact === 'low' ? 'Bajo' : 
                       failure.impact === 'medium' ? 'Medio' : 'Alto'} Impacto
                    </Badge>
                    <Badge variant="gray" size="sm">
                      {failure.category}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(failure.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(failure.status)} size="sm">
                      {getStatusLabel(failure.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Descripción:</h4>
                    <p className="text-gray-700">{failure.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                      Lección aprendida:
                    </h4>
                    <p className="text-gray-700">{failure.lesson}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-1 text-blue-500" />
                      Acción a tomar:
                    </h4>
                    <p className="text-gray-700">{failure.action}</p>
                  </div>
                </div>
                
                {/* Status Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Progreso:</span>
                    {failure.status === 'processing' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateFailureStatus(failure.id, 'learned')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Marcar como Aprendido
                      </Button>
                    )}
                    {failure.status === 'learned' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateFailureStatus(failure.id, 'applied')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Marcar como Aplicado
                      </Button>
                    )}
                    {failure.status === 'applied' && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Lección aplicada exitosamente</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay fracasos registrados
            </h3>
            <p className="text-gray-600 mb-4">
              Los fracasos son oportunidades de crecimiento. Registra tus contratiempos 
              para aprender de ellos y fortalecer tu resiliencia.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar mi primer fracaso
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            Consejos para la gestión del fracaso:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <strong>Sé compasivo contigo mismo:</strong> Los fracasos son parte del proceso de crecimiento</li>
            <li>• <strong>Enfócate en el aprendizaje:</strong> Pregúntate qué puedes aprender de cada experiencia</li>
            <li>• <strong>Actúa rápidamente:</strong> Registra el fracaso mientras los detalles están frescos</li>
            <li>• <strong>Busca patrones:</strong> Identifica si hay patrones en tus fracasos que puedas cambiar</li>
            <li>• <strong>Celebra el progreso:</strong> Reconoce cuando aplicas las lecciones aprendidas</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
