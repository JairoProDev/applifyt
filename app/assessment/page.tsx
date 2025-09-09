'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { LifeWheel } from '@/components/assessment/LifeWheel'
import { ValuesDiscovery } from '@/components/assessment/ValuesDiscovery'
import { GuidedJournaling } from '@/components/assessment/GuidedJournaling'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  Brain,
  Heart,
  BookOpen,
  Target
} from 'lucide-react'

type AssessmentStep = 'life-wheel' | 'values' | 'journaling' | 'complete'

interface AssessmentResults {
  lifeWheelScores?: Record<string, number>
  coreValues?: string[]
  journalEntries?: Record<string, string>
}

export default function AssessmentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('life-wheel')
  const [results, setResults] = useState<AssessmentResults>({})
  const [completedSteps, setCompletedSteps] = useState<AssessmentStep[]>([])

  if (status === 'loading') {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const steps = [
    {
      id: 'life-wheel' as AssessmentStep,
      title: 'Rueda de la Vida',
      description: 'Evalúa el equilibrio en las diferentes áreas de tu vida',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'values' as AssessmentStep,
      title: 'Descubrimiento de Valores',
      description: 'Identifica tus valores fundamentales y no negociables',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 'journaling' as AssessmentStep,
      title: 'Journaling Guiado',
      description: 'Reflexiona sobre patrones de pensamiento y comportamiento',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  const handleStepComplete = (step: AssessmentStep, data: any) => {
    setResults(prev => ({ ...prev, [step]: data }))
    setCompletedSteps(prev => [...prev, step])
    
    // Auto-advance to next step
    const currentIndex = steps.findIndex(s => s.id === step)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    } else {
      setCurrentStep('complete')
    }
  }

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const handleComplete = () => {
    router.push('/dashboard')
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 'life-wheel':
        return (
          <LifeWheel 
            onComplete={(scores) => handleStepComplete('life-wheel', scores)}
          />
        )
      case 'values':
        return (
          <ValuesDiscovery 
            onComplete={(values) => handleStepComplete('values', values)}
          />
        )
      case 'journaling':
        return (
          <GuidedJournaling 
            onComplete={(entries) => handleStepComplete('journaling', entries)}
          />
        )
      case 'complete':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Evaluación Completada!
                </h2>
                <p className="text-gray-600">
                  Has completado la Fase U (Understand) del Protocolo U.P.L.I.F.T.
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {steps.map((step) => {
                    const Icon = step.icon
                    const isCompleted = completedSteps.includes(step.id)
                    
                    return (
                      <div
                        key={step.id}
                        className={`p-4 rounded-lg border-2 ${
                          isCompleted
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          <Icon className={`h-5 w-5 ${step.color}`} />
                        </div>
                        <h3 className="font-medium text-gray-900">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Próximos pasos:
                </h3>
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <p>• Revisa tus resultados en el dashboard</p>
                  <p>• Comienza a crear hábitos basados en tus valores</p>
                  <p>• Define metas alineadas con tu visión de vida</p>
                  <p>• Continúa con la Fase P (Plan) del protocolo</p>
                </div>
              </div>
              
              <Button onClick={handleComplete} className="mt-6">
                Ir al Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)
  const currentStepData = steps[currentStepIndex]

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fase U: Understand (Comprensión)
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            La autoconciencia es el primer paso hacia el cambio. Completa esta evaluación 
            para obtener claridad sobre quién eres y qué valoras.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = currentStep === step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-gray-900">{step.title}</h3>
                    <p className="text-xs text-gray-500 max-w-24">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    completedSteps.includes(steps[index + 1].id) || isCompleted
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Current Step Content */}
        <div className="max-w-4xl mx-auto">
          {getStepContent()}
        </div>

        {/* Navigation (only show for incomplete steps) */}
        {currentStep !== 'complete' && (
          <div className="flex justify-between max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
            >
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
