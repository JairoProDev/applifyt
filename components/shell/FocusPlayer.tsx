'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  Play, 
  Pause, 
  Square, 
  CheckCircle,
  Clock,
  Target,
  Zap,
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
  Unlock
} from 'lucide-react'
import toast from 'react-hot-toast'

interface FocusPlayerProps {
  isOpen: boolean
  onClose: () => void
  action: any
  onComplete: () => void
}

export function FocusPlayer({ isOpen, onClose, action, onComplete }: FocusPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(action?.estimatedTime * 60 || 0)
  const [isBlocking, setIsBlocking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [notes, setNotes] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const steps = action?.steps || [
    'Preparar el entorno',
    'Enfocarse en la tarea',
    'Completar la acción',
    'Reflexionar sobre el resultado'
  ]

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false)
            handleComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setTimeLeft(action?.estimatedTime * 60 || 0)
    setCurrentStep(0)
  }

  const handleComplete = () => {
    setIsCompleted(true)
    setIsPlaying(false)
    toast.success('¡Acción completada!', {
      duration: 3000,
      icon: '🎉'
    })
    
    // Show micro-reward animation
    setTimeout(() => {
      onComplete()
    }, 2000)
  }

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleBlocking = () => {
    setIsBlocking(!isBlocking)
    if (!isBlocking) {
      toast.success('Modo enfoque activado - Distracciones bloqueadas')
    } else {
      toast.info('Modo enfoque desactivado')
    }
  }

  const getProgressPercentage = () => {
    const totalTime = action?.estimatedTime * 60 || 0
    return totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0
  }

  if (!isOpen || !action) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary-600" />
              Focus Player
            </CardTitle>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant={isBlocking ? "default" : "outline"}
              size="sm"
              onClick={toggleBlocking}
            >
              {isBlocking ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              {isBlocking ? 'Bloqueado' : 'Bloquear'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Action Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {action.name}
            </h2>
            {action.description && (
              <p className="text-gray-600 mb-4">
                {action.description}
              </p>
            )}
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{action.estimatedTime} minutos</span>
              </div>
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                <span>Paso {currentStep + 1} de {steps.length}</span>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary-600"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${getProgressPercentage()}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Pasos a seguir:</h3>
            <div className="space-y-2">
              {steps.map((step: string, index: number) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    index === currentStep
                      ? 'bg-primary-50 border border-primary-200'
                      : index < currentStep
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            
            <Button
              variant="outline"
              onClick={handleStop}
              disabled={!isPlaying && timeLeft === action?.estimatedTime * 60}
            >
              <Square className="h-4 w-4 mr-1" />
              Reiniciar
            </Button>
            
            <Button
              onClick={handlePlayPause}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 mr-1" />
              ) : (
                <Play className="h-4 w-4 mr-1" />
              )}
              {isPlaying ? 'Pausar' : 'Empezar'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleNextStep}
              disabled={currentStep === steps.length - 1}
            >
              Siguiente
              <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
            </Button>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notas rápidas:
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escribe tus observaciones..."
              className="w-full"
            />
          </div>

          {/* Complete Button */}
          <div className="text-center">
            <Button
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Completar Acción
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
