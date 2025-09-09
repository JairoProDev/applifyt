'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Star, 
  Heart, 
  Shield, 
  Target, 
  Users, 
  Zap,
  BookOpen,
  Home,
  DollarSign,
  Award,
  Save,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Value {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  category: string
}

const allValues: Value[] = [
  // Personal Growth
  { id: 'growth', name: 'Crecimiento', description: 'Desarrollo personal y mejora continua', icon: BookOpen, category: 'Personal' },
  { id: 'learning', name: 'Aprendizaje', description: 'Adquisición de conocimiento y habilidades', icon: BookOpen, category: 'Personal' },
  { id: 'excellence', name: 'Excelencia', description: 'Buscar la mejor versión de ti mismo', icon: Award, category: 'Personal' },
  { id: 'authenticity', name: 'Autenticidad', description: 'Ser genuino y verdadero contigo mismo', icon: Heart, category: 'Personal' },
  
  // Relationships
  { id: 'family', name: 'Familia', description: 'Conexión y cuidado de la familia', icon: Home, category: 'Relaciones' },
  { id: 'friendship', name: 'Amistad', description: 'Conexiones profundas y leales', icon: Users, category: 'Relaciones' },
  { id: 'love', name: 'Amor', description: 'Dar y recibir amor incondicional', icon: Heart, category: 'Relaciones' },
  { id: 'community', name: 'Comunidad', description: 'Contribuir al bienestar de otros', icon: Users, category: 'Relaciones' },
  
  // Achievement
  { id: 'success', name: 'Éxito', description: 'Lograr objetivos y reconocimiento', icon: Target, category: 'Logros' },
  { id: 'achievement', name: 'Logros', description: 'Completar metas importantes', icon: Award, category: 'Logros' },
  { id: 'impact', name: 'Impacto', description: 'Hacer una diferencia en el mundo', icon: Zap, category: 'Logros' },
  { id: 'leadership', name: 'Liderazgo', description: 'Guiar e inspirar a otros', icon: Star, category: 'Logros' },
  
  // Security
  { id: 'security', name: 'Seguridad', description: 'Estabilidad y protección', icon: Shield, category: 'Seguridad' },
  { id: 'freedom', name: 'Libertad', description: 'Autonomía e independencia', icon: Zap, category: 'Seguridad' },
  { id: 'financial_freedom', name: 'Libertad Financiera', description: 'Independencia económica', icon: DollarSign, category: 'Seguridad' },
  { id: 'health', name: 'Salud', description: 'Bienestar físico y mental', icon: Heart, category: 'Seguridad' }
]

interface ValuesDiscoveryProps {
  onComplete?: (values: string[]) => void
}

export function ValuesDiscovery({ onComplete }: ValuesDiscoveryProps) {
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleValueToggle = (valueId: string) => {
    setSelectedValues(prev => 
      prev.includes(valueId) 
        ? prev.filter(id => id !== valueId)
        : [...prev, valueId]
    )
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    if (selectedValues.length < 3) {
      toast.error('Selecciona al menos 3 valores fundamentales')
      return
    }

    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/assessment/values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: selectedValues }),
      })

      if (!response.ok) throw new Error('Error al guardar los valores')

      toast.success('Valores guardados exitosamente')
      onComplete?.(selectedValues)
    } catch (error) {
      toast.error('Error al guardar los valores')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Paso 1: Selecciona todos los valores que resuenen contigo
            </h3>
            <p className="text-gray-600">
              No te limites, selecciona todos los valores que sientas que son importantes para ti.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allValues.map((value) => {
                const Icon = value.icon
                const isSelected = selectedValues.includes(value.id)
                
                return (
                  <button
                    key={value.id}
                    onClick={() => handleValueToggle(value.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{value.name}</h4>
                        <p className="text-sm text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      
      case 2:
        const topValues = selectedValues.slice(0, 10)
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Paso 2: Reduce a tus 10 valores más importantes
            </h3>
            <p className="text-gray-600">
              De los {selectedValues.length} valores seleccionados, elige los 10 más importantes para ti.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allValues
                .filter(value => selectedValues.includes(value.id))
                .map((value) => {
                  const Icon = value.icon
                  const isSelected = topValues.includes(value.id)
                  
                  return (
                    <button
                      key={value.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedValues(prev => prev.filter(id => id !== value.id))
                        } else if (topValues.length < 10) {
                          setSelectedValues(prev => [...prev, value.id])
                        }
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : topValues.length >= 10 && !isSelected
                          ? 'border-gray-200 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{value.name}</h4>
                          <p className="text-sm text-gray-600">{value.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
            </div>
            
            <div className="text-center text-sm text-gray-500">
              {topValues.length}/10 valores seleccionados
            </div>
          </div>
        )
      
      case 3:
        const finalValues = selectedValues.slice(0, 5)
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Paso 3: Selecciona tus 5 valores fundamentales
            </h3>
            <p className="text-gray-600">
              Estos son tus valores no negociables, los que guiarán todas tus decisiones importantes.
            </p>
            
            <div className="space-y-3">
              {allValues
                .filter(value => selectedValues.includes(value.id))
                .map((value, index) => {
                  const Icon = value.icon
                  const isSelected = finalValues.includes(value.id)
                  
                  return (
                    <button
                      key={value.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedValues(prev => prev.filter(id => id !== value.id))
                        } else if (finalValues.length < 5) {
                          setSelectedValues(prev => [...prev, value.id])
                        }
                      }}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : finalValues.length >= 5 && !isSelected
                          ? 'border-gray-200 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isSelected ? <Star className="h-4 w-4" /> : index + 1}
                        </div>
                        <Icon className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">{value.name}</h4>
                          <p className="text-sm text-gray-600">{value.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
            </div>
            
            <div className="text-center text-sm text-gray-500">
              {finalValues.length}/5 valores fundamentales seleccionados
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2 text-primary-600" />
          Descubrimiento de Valores
        </CardTitle>
        <p className="text-sm text-gray-600">
          Identifica tus valores fundamentales para vivir una vida alineada con lo que realmente importa.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber <= step
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {getStepContent()}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {step < 3 ? (
            <Button onClick={handleNext}>
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={selectedValues.length < 3 || isSubmitting}
              loading={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Valores
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
