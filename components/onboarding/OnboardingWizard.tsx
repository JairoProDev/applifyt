'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { WelcomeStep } from './steps/WelcomeStep'
import { ProfileSetupStep } from './steps/ProfileSetupStep'
import { LifeWheelStep } from './steps/LifeWheelStep'
import { ValuesStep } from './steps/ValuesStep'
import { FirstGoalStep } from './steps/FirstGoalStep'
import { FirstHabitStep } from './steps/FirstHabitStep'
import { TourStep } from './steps/TourStep'

export interface OnboardingData {
  profile?: {
    name: string
    timezone: string
    bio?: string
  }
  lifeWheel?: Record<string, number>
  values?: string[]
  firstGoal?: any
  firstHabit?: any
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void
}

const steps = [
  { id: 'welcome', title: 'Bienvenida', component: WelcomeStep },
  { id: 'profile', title: 'Perfil', component: ProfileSetupStep },
  { id: 'lifeWheel', title: 'Balance de Vida', component: LifeWheelStep },
  { id: 'values', title: 'Valores', component: ValuesStep },
  { id: 'goal', title: 'Primera Meta', component: FirstGoalStep },
  { id: 'habit', title: 'Primer Hábito', component: FirstHabitStep },
  { id: 'tour', title: 'Tour', component: TourStep },
]

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const CurrentStepComponent = steps[currentStep].component
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const handleNext = async (stepData?: any) => {
    // Update onboarding data with current step data
    if (stepData) {
      const stepId = steps[currentStep].id
      setOnboardingData(prev => ({
        ...prev,
        [stepId]: stepData,
      }))
    }

    if (isLastStep) {
      // Complete onboarding
      setIsSubmitting(true)
      try {
        await onComplete(onboardingData)
      } catch (error) {
        console.error('Error completing onboarding:', error)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    setCurrentStep(prev => prev + 1)
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-700">
              Paso {currentStep + 1} de {steps.length}
            </h2>
            <span className="text-sm font-medium text-primary-600">
              {Math.round(progress)}% completado
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="hidden md:flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${isCurrent ? 'bg-primary-600 text-white ring-4 ring-primary-200' : ''}
                      ${isUpcoming ? 'bg-gray-200 text-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`
                      text-xs font-medium text-center
                      ${isCurrent ? 'text-primary-600' : 'text-gray-500'}
                    `}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-0.5 flex-1 mx-2 transition-all
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <Card className="shadow-2xl">
          <CardContent className="p-8">
            <CurrentStepComponent
              data={onboardingData}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda? Visita nuestra{' '}
            <a href="/help" className="text-primary-600 hover:underline">
              guía de inicio
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
