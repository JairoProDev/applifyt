'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/shell/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Brain,
  Zap,
  ArrowRight,
  Sparkles,
  Calendar,
  Award,
  Shield,
  Heart
} from 'lucide-react'

export default function SolvePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [problem, setProblem] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [diagnosisAnswers, setDiagnosisAnswers] = useState({})
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [activePlan, setActivePlan] = useState(null)
  const [dailyProgress, setDailyProgress] = useState([])

  useEffect(() => {
    if (!session) {
      router.push('/')
      return
    }
  }, [session, router])

  if (!session) return null

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

  const plans = [
    {
      id: 'atomic',
      name: 'Plan Atómico',
      description: 'Cambio gradual basado en Atomic Habits',
      duration: '21 días',
      difficulty: 'Fácil',
      color: 'green',
      features: ['Hábito de 2 minutos', 'Stacking con rutina existente', 'Recordatorios diarios'],
      science: 'Basado en el libro "Atomic Habits" de James Clear',
      dailyActions: [
        'Identifica tu trigger actual',
        'Crea un hábito de 2 minutos',
        'Refuerza con recompensa inmediata'
      ]
    },
    {
      id: 'woop',
      name: 'Plan WOOP',
      description: 'Metodología WOOP para cambio profundo',
      duration: '30 días',
      difficulty: 'Medio',
      color: 'blue',
      features: ['Identificación de obstáculos', 'Plan de contingencia', 'Seguimiento semanal'],
      science: 'Desarrollado por la psicóloga Gabriele Oettingen',
      dailyActions: [
        'Visualiza el resultado deseado',
        'Identifica el obstáculo principal',
        'Crea plan de contingencia'
      ]
    },
    {
      id: 'behavioral',
      name: 'Plan Conductual',
      description: 'Modificación de comportamiento con IA',
      duration: '45 días',
      difficulty: 'Avanzado',
      color: 'purple',
      features: ['Análisis de patrones', 'Intervenciones personalizadas', 'Coaching 24/7'],
      science: 'Combinación de terapia cognitivo-conductual y IA',
      dailyActions: [
        'Registra patrones de comportamiento',
        'Aplica intervención personalizada',
        'Reflexiona sobre el progreso'
      ]
    }
  ]

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuéntame más detalles sobre tu problema
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ej: Juego videojuegos 4 horas al día y esto me distrae de construir mi startup..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button 
            onClick={() => setCurrentStep(2)}
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
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tu respuesta..."
                value={diagnosisAnswers[index] || ''}
                onChange={(e) => setDiagnosisAnswers(prev => ({ ...prev, [index]: e.target.value }))}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={() => setCurrentStep(3)}
        disabled={Object.keys(diagnosisAnswers).length < 2}
        className="w-full"
      >
        Generar mis planes de acción
        <Sparkles className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )

  const renderPlans = () => (
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
            onClick={() => {
              setActivePlan(plans.find(p => p.id === selectedPlan))
              setCurrentStep(4)
            }}
            className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4"
          >
            <Zap className="h-5 w-5 mr-2" />
            Activar este plan
          </Button>
        </div>
      )}
    </div>
  )

  const renderActivePlan = () => {
    if (!activePlan) return null

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">¡Plan {activePlan.name} activado!</h2>
          <p className="text-gray-600">Tu transformación comienza ahora</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Tu desafío de hoy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Acción del día:</h4>
                <p className="text-sm text-gray-700">{activePlan.dailyActions[0]}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Día 1 de {activePlan.duration}</span>
                <Badge variant="outline">Fácil</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Días completados</span>
                  <span className="font-semibold">0/21</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-center">
                  <Button size="sm" className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completar acción de hoy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Próximos pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activePlan.dailyActions.map((action, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    index === 0 ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index === 0 ? <Zap className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{action}</p>
                    <p className="text-xs text-gray-500">
                      {index === 0 ? 'Hoy' : `Día ${index + 1}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AppShell currentPage="solve">
      <div className="w-full max-w-none px-4 lg:px-6 py-6">
        {currentStep === 1 && renderProblemInput()}
        {currentStep === 2 && renderDiagnosis()}
        {currentStep === 3 && renderPlans()}
        {currentStep === 4 && renderActivePlan()}
      </div>
    </AppShell>
  )
}
