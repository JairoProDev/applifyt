'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  Brain, 
  Target, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Heart,
  Shield,
  TrendingUp
} from 'lucide-react'

export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [problem, setProblem] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [diagnosisAnswers, setDiagnosisAnswers] = useState({})
  const [selectedPlan, setSelectedPlan] = useState(null)

  // Si ya está logueado, ir directo al flujo principal
  if (session) {
    router.push('/solve')
    return null
  }

  const problemCategories = [
    { id: 'distraction', name: 'Distracciones', icon: Brain, color: 'text-red-600 bg-red-50' },
    { id: 'procrastination', name: 'Procrastinación', icon: Target, color: 'text-orange-600 bg-orange-50' },
    { id: 'addiction', name: 'Adicciones', icon: Shield, color: 'text-purple-600 bg-purple-50' },
    { id: 'productivity', name: 'Productividad', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { id: 'health', name: 'Salud', icon: Heart, color: 'text-blue-600 bg-blue-50' },
    { id: 'other', name: 'Otro', icon: Sparkles, color: 'text-gray-600 bg-gray-50' }
  ]

  const diagnosisQuestions = {
    distraction: [
      "¿Cuántas horas al día pierdes en esta distracción?",
      "¿En qué momentos del día es peor?",
      "¿Qué emociones sientes antes de caer en la distracción?",
      "¿Qué actividad importante estás evitando?"
    ],
    procrastination: [
      "¿Qué tarea importante estás postergando?",
      "¿Qué excusas te das a ti mismo?",
      "¿Cuándo empezaste a procrastinar esto?",
      "¿Qué pasaría si no lo haces?"
    ],
    addiction: [
      "¿Cuánto tiempo llevas con este hábito?",
      "¿Has intentado dejarlo antes?",
      "¿Qué desencadena este comportamiento?",
      "¿Cómo te sientes después de hacerlo?"
    ]
  }

  const renderWelcome = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">
          Supera tu <span className="text-primary-600">mal hábito</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Cuéntame tu problema y te ayudo a solucionarlo usando ciencia, tecnología y estrategias probadas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center p-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">1. Cuenta tu problema</h3>
          <p className="text-gray-600 text-sm">Describe qué hábito quieres cambiar</p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">2. Te doy 3 planes</h3>
          <p className="text-gray-600 text-sm">Estrategias científicas personalizadas</p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">3. Activa el plan</h3>
          <p className="text-gray-600 text-sm">Seguimiento y mejora continua</p>
        </Card>
      </div>

      <div className="space-y-4">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
          onClick={() => setCurrentStep(2)}
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Empezar ahora
        </Button>
        <p className="text-sm text-gray-500">Es gratis y toma menos de 5 minutos</p>
      </div>
    </div>
  )

  const renderProblemInput = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">¿Cuál es tu problema?</h2>
        <p className="text-gray-600">Selecciona la categoría que mejor describa tu situación</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {problemCategories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCategory === category.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${category.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="font-medium text-sm">{category.name}</p>
            </button>
          )
        })}
      </div>

      {selectedCategory && (
        <div className="space-y-4">
          <Input
            label="Cuéntame más detalles sobre tu problema"
            placeholder="Ej: Juego videojuegos 4 horas al día y esto me distrae de construir mi startup..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            multiline
            rows={4}
          />
          
          <Button 
            onClick={() => setCurrentStep(3)}
            disabled={!problem.trim()}
            className="w-full"
          >
            Continuar al diagnóstico
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )

  const renderDiagnosis = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Diagnóstico rápido</h2>
        <p className="text-gray-600">Algunas preguntas para entender mejor tu situación</p>
      </div>

      <div className="space-y-6">
        {diagnosisQuestions[selectedCategory]?.map((question, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">{question}</h3>
              <Input
                placeholder="Tu respuesta..."
                value={diagnosisAnswers[index] || ''}
                onChange={(e) => setDiagnosisAnswers(prev => ({ ...prev, [index]: e.target.value }))}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={() => setCurrentStep(4)}
        disabled={Object.keys(diagnosisAnswers).length < 2}
        className="w-full"
      >
        Generar mis planes de acción
        <Sparkles className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )

  const renderPlans = () => {
    const plans = [
      {
        id: 'atomic',
        name: 'Plan Atómico',
        description: 'Cambio gradual basado en Atomic Habits',
        duration: '21 días',
        difficulty: 'Fácil',
        color: 'green',
        features: ['Hábito de 2 minutos', 'Stacking con rutina existente', 'Recordatorios diarios'],
        science: 'Basado en el libro "Atomic Habits" de James Clear'
      },
      {
        id: 'woop',
        name: 'Plan WOOP',
        description: 'Metodología WOOP para cambio profundo',
        duration: '30 días',
        difficulty: 'Medio',
        color: 'blue',
        features: ['Identificación de obstáculos', 'Plan de contingencia', 'Seguimiento semanal'],
        science: 'Desarrollado por la psicóloga Gabriele Oettingen'
      },
      {
        id: 'behavioral',
        name: 'Plan Conductual',
        description: 'Modificación de comportamiento con IA',
        duration: '45 días',
        difficulty: 'Avanzado',
        color: 'purple',
        features: ['Análisis de patrones', 'Intervenciones personalizadas', 'Coaching 24/7'],
        science: 'Combinación de terapia cognitivo-conductual y IA'
      }
    ]

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Tus 3 planes personalizados</h2>
          <p className="text-gray-600">Basados en tu problema y respuestas, aquí tienes las mejores estrategias</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-primary-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={plan.color} size="sm">{plan.difficulty}</Badge>
                  <Badge variant="outline" size="sm">{plan.duration}</Badge>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Incluye:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-xs text-gray-500 italic">
                  {plan.science}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPlan && (
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => setCurrentStep(5)}
              className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4"
            >
              <Zap className="h-5 w-5 mr-2" />
              Activar este plan
            </Button>
          </div>
        )}
      </div>
    )
  }

  const renderActivation = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">¡Plan activado!</h2>
        <p className="text-gray-600">
          Tu plan personalizado está listo. Te acompañaré paso a paso en tu transformación.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Próximos pasos:</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xs font-bold text-primary-600">1</span>
              </div>
              <span>Recibirás tu primer desafío en 5 minutos</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xs font-bold text-primary-600">2</span>
              </div>
              <span>Check-in diario para mantener el momentum</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xs font-bold text-primary-600">3</span>
              </div>
              <span>Ajustes automáticos basados en tu progreso</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        size="lg"
        onClick={() => router.push('/auth/signup')}
        className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4"
      >
        Crear mi cuenta y empezar
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        {currentStep === 1 && renderWelcome()}
        {currentStep === 2 && renderProblemInput()}
        {currentStep === 3 && renderDiagnosis()}
        {currentStep === 4 && renderPlans()}
        {currentStep === 5 && renderActivation()}
      </div>
    </div>
  )
}