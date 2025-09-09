'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  X, 
  Send, 
  Mic, 
  MicOff,
  Plus,
  Target,
  Clock,
  BookOpen,
  Calendar,
  Zap,
  Lightbulb,
  Bot
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UniversalComposerProps {
  isOpen: boolean
  onClose: () => void
  onStartAction: (action: any) => void
}

export function UniversalComposer({ isOpen, onClose, onStartAction }: UniversalComposerProps) {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [aiResponse, setAiResponse] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('El reconocimiento de voz no está disponible')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'es-ES'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
      toast.error('Error en el reconocimiento de voz')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsProcessing(true)
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Parse input and create action
      const action = parseInputToAction(input)
      setAiResponse(action)
      
      toast.success('¡Acción creada exitosamente!')
    } catch (error) {
      toast.error('Error al procesar la entrada')
    } finally {
      setIsProcessing(false)
    }
  }

  const parseInputToAction = (input: string) => {
    const lowerInput = input.toLowerCase()
    
    // Habit detection
    if (lowerInput.includes('hábito') || lowerInput.includes('rutina') || lowerInput.includes('diario')) {
      return {
        type: 'habit',
        name: input,
        category: 'personal',
        frequency: 'daily',
        estimatedTime: 15,
        priority: 'medium'
      }
    }
    
    // Goal detection
    if (lowerInput.includes('meta') || lowerInput.includes('objetivo') || lowerInput.includes('quiero')) {
      return {
        type: 'goal',
        name: input,
        category: 'personal',
        estimatedTime: 60,
        priority: 'high'
      }
    }
    
    // Task detection
    if (lowerInput.includes('hacer') || lowerInput.includes('completar') || lowerInput.includes('terminar')) {
      return {
        type: 'task',
        name: input,
        category: 'work',
        estimatedTime: 30,
        priority: 'medium'
      }
    }
    
    // Note detection
    if (lowerInput.includes('nota') || lowerInput.includes('recordar') || lowerInput.includes('anotar')) {
      return {
        type: 'note',
        name: input,
        category: 'personal',
        estimatedTime: 5,
        priority: 'low'
      }
    }
    
    // Default to task
    return {
      type: 'task',
      name: input,
      category: 'personal',
      estimatedTime: 30,
      priority: 'medium'
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'habit': return <Zap className="h-5 w-5" />
      case 'goal': return <Target className="h-5 w-5" />
      case 'task': return <Clock className="h-5 w-5" />
      case 'note': return <BookOpen className="h-5 w-5" />
      default: return <Plus className="h-5 w-5" />
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case 'habit': return 'text-green-600'
      case 'goal': return 'text-blue-600'
      case 'task': return 'text-purple-600'
      case 'note': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'habit': return 'Hábito'
      case 'goal': return 'Meta'
      case 'task': return 'Tarea'
      case 'note': return 'Nota'
      default: return 'Acción'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary-600" />
            Composer Universal
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Input Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe lo que sea... 'Quiero meditar 10 minutos', 'Llamar a mamá mañana', 'Dejar el azúcar'"
                className="pr-20"
                disabled={isProcessing}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  disabled={isListening || isProcessing}
                  className="p-1"
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isProcessing}
                  className="p-1"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Sugerencias rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary-50"
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </form>

          {/* AI Response */}
          {aiResponse && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-white ${getActionColor(aiResponse.type)}`}>
                  {getActionIcon(aiResponse.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="primary" size="sm">
                      {getActionLabel(aiResponse.type)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {aiResponse.estimatedTime} minutos
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {aiResponse.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Kai ha clasificado esto como una {getActionLabel(aiResponse.type).toLowerCase()}. 
                    ¿Quieres que lo agregue a tu plan de hoy?
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        onStartAction(aiResponse)
                        onClose()
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar y Empezar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Add to plan without starting
                        onClose()
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Solo Agregar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <span className="text-gray-600">Kai está procesando...</span>
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Ejemplos de lo que puedes escribir:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <p className="text-gray-600">• "Quiero meditar 10 minutos cada mañana"</p>
                <p className="text-gray-600">• "Llamar a mi madre mañana a las 3pm"</p>
                <p className="text-gray-600">• "Dejar el azúcar entre comidas"</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">• "Anotar idea para el proyecto"</p>
                <p className="text-gray-600">• "Hacer ejercicio 30 minutos"</p>
                <p className="text-gray-600">• "Revisar gastos del mes"</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
