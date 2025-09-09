'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/shell/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Download,
  Play,
  Clock,
  Users,
  Target,
  Zap,
  Heart,
  Brain,
  TrendingUp
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LibraryPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const categories = [
    { id: 'all', name: 'Todos', icon: BookOpen },
    { id: 'habits', name: 'Hábitos', icon: Zap },
    { id: 'goals', name: 'Metas', icon: Target },
    { id: 'wellbeing', name: 'Bienestar', icon: Heart },
    { id: 'productivity', name: 'Productividad', icon: TrendingUp },
    { id: 'learning', name: 'Aprendizaje', icon: Brain }
  ]

  const protocols = [
    {
      id: 1,
      title: 'Protocolo de Meditación Matutina',
      description: 'Rutina de 10 minutos para empezar el día con claridad mental',
      category: 'wellbeing',
      duration: '10 min',
      difficulty: 'Principiante',
      rating: 4.8,
      users: 1250,
      tags: ['meditación', 'mañana', 'mindfulness'],
      featured: true
    },
    {
      id: 2,
      title: 'Sistema de Hábitos Atómicos',
      description: 'Implementa el método de James Clear para crear hábitos duraderos',
      category: 'habits',
      duration: '30 días',
      difficulty: 'Intermedio',
      rating: 4.9,
      users: 2100,
      tags: ['hábitos', 'productividad', 'cambio'],
      featured: true
    },
    {
      id: 3,
      title: 'WOOP para Metas',
      description: 'Framework científico para establecer y alcanzar objetivos',
      category: 'goals',
      duration: '45 min',
      difficulty: 'Intermedio',
      rating: 4.7,
      users: 890,
      tags: ['metas', 'planificación', 'éxito']
    },
    {
      id: 4,
      title: 'Rutina de Ejercicio en Casa',
      description: 'Workout de 20 minutos sin equipamiento especial',
      category: 'wellbeing',
      duration: '20 min',
      difficulty: 'Principiante',
      rating: 4.6,
      users: 1500,
      tags: ['ejercicio', 'salud', 'casa']
    },
    {
      id: 5,
      title: 'Técnica Pomodoro Avanzada',
      description: 'Sistema de productividad con bloques de enfoque y descanso',
      category: 'productivity',
      duration: '25 min',
      difficulty: 'Principiante',
      rating: 4.5,
      users: 1800,
      tags: ['productividad', 'enfoque', 'tiempo']
    },
    {
      id: 6,
      title: 'Diario de Gratitud',
      description: 'Práctica diaria para mejorar el bienestar emocional',
      category: 'wellbeing',
      duration: '5 min',
      difficulty: 'Principiante',
      rating: 4.8,
      users: 2200,
      tags: ['gratitud', 'bienestar', 'reflexión']
    }
  ]

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.icon : BookOpen
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'habits': return 'text-green-600'
      case 'goals': return 'text-blue-600'
      case 'wellbeing': return 'text-red-600'
      case 'productivity': return 'text-purple-600'
      case 'learning': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return 'success'
      case 'Intermedio': return 'warning'
      case 'Avanzado': return 'danger'
      default: return 'gray'
    }
  }

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || protocol.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <AppShell currentPage="library">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Biblioteca</h1>
            <p className="text-gray-600">
              Protocolos, plantillas y recursos para tu crecimiento personal
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar protocolos, plantillas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = selectedCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  isActive
                    ? 'bg-primary-50 border-primary-200 text-primary-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            )
          })}
        </div>

        {/* Featured Protocols */}
        {selectedCategory === 'all' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {protocols.filter(p => p.featured).map((protocol) => {
                const Icon = getCategoryIcon(protocol.category)
                
                return (
                  <Card key={protocol.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-white ${getCategoryColor(protocol.category)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{protocol.title}</h3>
                            <p className="text-sm text-gray-500">{protocol.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" size="sm" className="text-yellow-600">
                          <Star className="h-3 w-3 mr-1" />
                          Destacado
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{protocol.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{protocol.users.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          <span>{protocol.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={getDifficultyColor(protocol.difficulty)} size="sm">
                          {protocol.difficulty}
                        </Badge>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Aplicar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* All Protocols */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedCategory === 'all' ? 'Todos los Protocolos' : 
             categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          
          {filteredProtocols.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No se encontraron protocolos</p>
                <p className="text-sm text-gray-400">
                  Intenta ajustar tu búsqueda o filtros
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProtocols.map((protocol) => {
                const Icon = getCategoryIcon(protocol.category)
                
                return (
                  <Card key={protocol.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-white ${getCategoryColor(protocol.category)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{protocol.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{protocol.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{protocol.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{protocol.users.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          <span>{protocol.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {protocol.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={getDifficultyColor(protocol.difficulty)} size="sm">
                          {protocol.difficulty}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
