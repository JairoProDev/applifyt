'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Heart, 
  Zap,
  Brain,
  Sparkles
} from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState({
    name: '',
    mainGoal: '',
    motivation: '',
    timeAvailable: '30'
  })

  const steps = [
    {
      id: 'welcome',
      title: '¡Bienvenido a Applify!',
      description: 'Tu compañero de crecimiento personal',
      icon: <Sparkles className="h-12 w-12 text-primary-600" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600">
            Vamos a configurar tu espacio personal de crecimiento paso a paso
          </p>
          <p className="text-sm text-gray-500">
            Esto solo tomará 2 minutos y te ayudará a personalizar tu experiencia
          </p>
        </div>
      )
    },
    {
      id: 'name',
      title: '¿Cómo te llamas?',
      description: 'Para personalizar tu experiencia',
      icon: <Heart className="h-12 w-12 text-red-500" />,
      content: (
        <div className="space-y-4">
          <Input
            placeholder="Tu nombre"
            value={userData.name}
            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
            className="text-lg"
          />
          <p className="text-sm text-gray-500 text-center">
            Kai te llamará por tu nombre para una experiencia más personal
          </p>
        </div>
      )
    },
    {
      id: 'goal',
      title: '¿Cuál es tu meta principal?',
      description: 'El objetivo que más te motiva ahora mismo',
      icon: <Target className="h-12 w-12 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <Input
            placeholder="Ej: Aprender programación, hacer ejercicio, meditar..."
            value={userData.mainGoal}
            onChange={(e) => setUserData(prev => ({ ...prev, mainGoal: e.target.value }))}
            className="text-lg"
          />
          <p className="text-sm text-gray-500 text-center">
            No te preocupes, puedes cambiarlo después
          </p>
        </div>
      )
    },
    {
      id: 'motivation',
      title: '¿Por qué es importante para ti?',
      description: 'Tu motivación más profunda',
      icon: <Brain className="h-12 w-12 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <Input
            placeholder="Ej: Para conseguir un mejor trabajo, sentirme más saludable..."
            value={userData.motivation}
            onChange={(e) => setUserData(prev => ({ ...prev, motivation: e.target.value }))}
            className="text-lg"
          />
          <p className="text-sm text-gray-500 text-center">
            Recordar tu "por qué" te ayudará en los momentos difíciles
          </p>
        </div>
      )
    },
    {
      id: 'time',
      title: '¿Cuánto tiempo tienes?',
      description: 'Minutos al día para tu crecimiento',
      icon: <Zap className="h-12 w-12 text-yellow-500" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {['15', '30', '60'].map((time) => (
              <Button
                key={time}
                variant={userData.timeAvailable === time ? 'default' : 'outline'}
                onClick={() => setUserData(prev => ({ ...prev, timeAvailable: time }))}
                className="h-12 text-lg"
              >
                {time} min
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Kai adaptará las actividades a tu tiempo disponible
          </p>
        </div>
      )
    },
    {
      id: 'complete',
      title: '¡Perfecto!',
      description: 'Tu espacio personal está listo',
      icon: <CheckCircle className="h-12 w-12 text-green-500" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600">
            Hola {userData.name}, tu viaje de crecimiento comienza ahora
          </p>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Tu meta: {userData.mainGoal}</p>
            <p className="text-sm text-gray-600">Motivación: {userData.motivation}</p>
            <p className="text-sm text-gray-600">Tiempo diario: {userData.timeAvailable} minutos</p>
          </div>
        </div>
      )
    }
  ]

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const canProceed = currentStep === 0 || 
    (currentStep === 1 && userData.name.trim()) ||
    (currentStep === 2 && userData.mainGoal.trim()) ||
    (currentStep === 3 && userData.motivation.trim()) ||
    currentStep === 4 || currentStep === 5

  const handleNext = () => {
    if (isLastStep) {
      // Save user data and complete onboarding
      localStorage.setItem('applify-user-data', JSON.stringify(userData))
      localStorage.setItem('applify-onboarding-complete', 'true')
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('applify-onboarding-complete', 'true')
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {currentStepData.icon}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {currentStepData.title}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {currentStepData.description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStepData.content}
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Paso {currentStep + 1} de {steps.length}
            </div>
            
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Atrás
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {isLastStep ? 'Comenzar' : 'Siguiente'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          
          {currentStep > 0 && (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Omitir configuración
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



