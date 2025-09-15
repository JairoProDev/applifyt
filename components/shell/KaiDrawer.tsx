'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  X, 
  Send, 
  Bot, 
  Lightbulb,
  Target,
  Clock,
  Zap,
  Heart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Mic,
  MicOff
} from 'lucide-react'
import toast from 'react-hot-toast'

interface KaiDrawerProps {
  isOpen: boolean
  onClose: () => void
  currentPage: string
  isMobile?: boolean
}

export function KaiDrawer({ isOpen, onClose, currentPage, isMobile = false }: KaiDrawerProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const aiResponse = generateAIResponse(input, currentPage)
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      toast.error('Error al procesar el mensaje')
    } finally {
      setIsProcessing(false)
    }
  }

  const generateAIResponse = (input: string, page: string) => {
    const lowerInput = input.toLowerCase()
    
    // Context-aware responses based on current page
    if (page === 'today') {
      if (lowerInput.includes('cansado') || lowerInput.includes('fatiga')) {
        return {
          id: Date.now() + 1,
          type: 'ai',
          content: 'Veo que te sientes cansado. Te sugiero hacer una pausa de 5 minutos con respiración profunda. ¿Quieres que active el modo de recuperación?',
          suggestions: [
            { text: 'Activar modo recuperación', action: 'recovery' },
            { text: 'Reorganizar tareas', action: 'reorganize' },
            { text: 'Tomar un descanso', action: 'break' }
          ],
          timestamp: new Date()
        }
      }
    }

    if (lowerInput.includes('hábito') || lowerInput.includes('rutina')) {
      return {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Perfecto, trabajemos en ese hábito. Te ayudo a crear un protocolo paso a paso. ¿Qué hábito específico quieres desarrollar?',
        suggestions: [
          { text: 'Crear protocolo', action: 'create_protocol' },
          { text: 'Ver ejemplos', action: 'show_examples' },
          { text: 'Ajustar horarios', action: 'adjust_schedule' }
        ],
        timestamp: new Date()
      }
    }

    if (lowerInput.includes('meta') || lowerInput.includes('objetivo')) {
      return {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Excelente, definamos esa meta correctamente. Usemos el framework SMART para asegurar que sea alcanzable. ¿Cuál es tu meta específica?',
        suggestions: [
          { text: 'Aplicar framework SMART', action: 'smart_goal' },
          { text: 'Crear plan de acción', action: 'action_plan' },
          { text: 'Establecer hitos', action: 'milestones' }
        ],
        timestamp: new Date()
      }
    }

    // Default response
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: 'Entiendo. Te ayudo a procesar esa información y crear un plan de acción. ¿Podrías darme más detalles?',
      suggestions: [
        { text: 'Analizar situación', action: 'analyze' },
        { text: 'Crear plan', action: 'create_plan' },
        { text: 'Buscar recursos', action: 'find_resources' }
      ],
      timestamp: new Date()
    }
  }

  const handleSuggestionClick = (suggestion: any) => {
    setInput(suggestion.text)
    // Handle suggestion action
    toast.success(`Acción: ${suggestion.action}`)
  }

  const getContextualInsights = () => {
    // Return empty insights for new users
    return []
  }

  const getQuickActions = () => {
    const actions = [
      { text: 'Planificar el día', icon: <Clock className="h-4 w-4" />, action: 'plan_day' },
      { text: 'Revisar progreso', icon: <TrendingUp className="h-4 w-4" />, action: 'review_progress' },
      { text: 'Ajustar hábitos', icon: <Zap className="h-4 w-4" />, action: 'adjust_habits' },
      { text: 'Modo recuperación', icon: <Heart className="h-4 w-4" />, action: 'recovery_mode' }
    ]

    return actions
  }

  if (!isOpen) return null

  return (
    <div className={`fixed ${isMobile ? 'bottom-0 left-0 right-0' : 'right-0 top-16 h-[calc(100vh-4rem)]'} z-40`}>
      <div className={`bg-white border-l border-gray-200 h-full ${isMobile ? 'rounded-t-lg' : ''} flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Kai - Tu Coach IA</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Contextual Insights */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Insights del momento</h4>
            <div className="space-y-2">
              {getContextualInsights().map((insight, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className={insight.color}>
                    {insight.icon}
                  </div>
                  <span className="text-gray-600">{insight.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Acciones rápidas</h4>
            <div className="grid grid-cols-2 gap-2">
              {getQuickActions().map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(action)}
                  className="justify-start"
                >
                  {action.icon}
                  <span className="ml-2 text-xs">{action.text}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500">
                <Bot className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Hola, soy Kai. ¿En qué puedo ayudarte hoy?</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1 transition-colors"
                        >
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span className="text-sm">Kai está pensando...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1"
                disabled={isProcessing}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Handle voice input
                  toast.info('Reconocimiento de voz próximamente')
                }}
                disabled={isProcessing}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isProcessing}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
