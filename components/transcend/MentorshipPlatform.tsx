'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { 
  Users, 
  Star, 
  MessageCircle, 
  Heart,
  Target,
  BookOpen,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Mentor {
  id: string
  name: string
  expertise: string[]
  experience: string
  rating: number
  mentees: number
  bio: string
  availability: 'available' | 'busy' | 'unavailable'
  avatar?: string
}

interface MentorshipPlatformProps {
  onComplete?: () => void
}

export function MentorshipPlatform({ onComplete }: MentorshipPlatformProps) {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExpertise, setSelectedExpertise] = useState('')
  const [showBecomeMentor, setShowBecomeMentor] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data - in real app, this would come from API
  const [mentors] = useState<Mentor[]>([
    {
      id: '1',
      name: 'María González',
      expertise: ['Productividad', 'Liderazgo', 'Crecimiento Personal'],
      experience: '5 años',
      rating: 4.9,
      mentees: 23,
      bio: 'Coach certificada especializada en productividad y desarrollo de liderazgo. He ayudado a más de 50 personas a alcanzar sus metas.',
      availability: 'available'
    },
    {
      id: '2',
      name: 'Carlos Ruiz',
      expertise: ['Tecnología', 'Emprendimiento', 'Innovación'],
      experience: '8 años',
      rating: 4.8,
      mentees: 31,
      bio: 'Emprendedor serial y desarrollador senior. Apasionado por ayudar a otros a construir productos tecnológicos exitosos.',
      availability: 'available'
    },
    {
      id: '3',
      name: 'Ana Martínez',
      expertise: ['Salud Mental', 'Mindfulness', 'Bienestar'],
      experience: '6 años',
      rating: 4.9,
      mentees: 18,
      bio: 'Psicóloga clínica especializada en mindfulness y bienestar mental. Experta en técnicas de manejo del estrés.',
      availability: 'busy'
    }
  ])

  const expertiseOptions = [
    'Productividad',
    'Liderazgo',
    'Crecimiento Personal',
    'Tecnología',
    'Emprendimiento',
    'Innovación',
    'Salud Mental',
    'Mindfulness',
    'Bienestar',
    'Finanzas',
    'Carrera',
    'Relaciones'
  ]

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesExpertise = !selectedExpertise || mentor.expertise.includes(selectedExpertise)
    return matchesSearch && matchesExpertise
  })

  const handleBecomeMentor = async (formData: any) => {
    try {
      setIsSubmitting(true)
      
      // In real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('¡Solicitud enviada! Te contactaremos pronto.')
      setShowBecomeMentor(false)
    } catch (error) {
      toast.error('Error al enviar la solicitud')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'success'
      case 'busy': return 'warning'
      case 'unavailable': return 'danger'
      default: return 'gray'
    }
  }

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case 'available': return 'Disponible'
      case 'busy': return 'Ocupado'
      case 'unavailable': return 'No disponible'
      default: return availability
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary-600" />
            Plataforma de Mentoría
          </CardTitle>
          <p className="text-sm text-gray-600">
            Conecta con mentores experimentados o comparte tu conocimiento ayudando a otros.
          </p>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar mentores por nombre, especialidad o experiencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={selectedExpertise}
            onChange={(e) => setSelectedExpertise(e.target.value)}
            className="input"
          >
            <option value="">Todas las especialidades</option>
            {expertiseOptions.map(expertise => (
              <option key={expertise} value={expertise}>{expertise}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Become Mentor CTA */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¿Tienes experiencia que compartir?
              </h3>
              <p className="text-gray-600">
                Conviértete en mentor y ayuda a otros en su viaje de crecimiento personal.
              </p>
            </div>
            <Button onClick={() => setShowBecomeMentor(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ser Mentor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{mentor.name}</h3>
                    <p className="text-sm text-gray-500">{mentor.experience} de experiencia</p>
                  </div>
                </div>
                <Badge variant={getAvailabilityColor(mentor.availability)} size="sm">
                  {getAvailabilityLabel(mentor.availability)}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{mentor.bio}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Especialidades:</h4>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.map((exp) => (
                      <Badge key={exp} variant="gray" size="sm">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">{mentor.rating}</span>
                  </div>
                  <div className="text-gray-600">
                    {mentor.mentees} mentees
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                disabled={mentor.availability === 'unavailable'}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Become Mentor Form Modal */}
      {showBecomeMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Convertirse en Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleBecomeMentor(Object.fromEntries(formData))
                }} className="space-y-4">
                  <Input
                    label="Nombre completo"
                    name="name"
                    required
                    defaultValue={session?.user?.name || ''}
                  />
                  
                  <Textarea
                    label="Biografía"
                    name="bio"
                    placeholder="Cuéntanos sobre tu experiencia y cómo puedes ayudar a otros..."
                    rows={4}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Especialidades
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {expertiseOptions.map(expertise => (
                        <label key={expertise} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="expertise"
                            value={expertise}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{expertise}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Input
                    label="Años de experiencia"
                    name="experience"
                    type="number"
                    min="1"
                    required
                  />
                  
                  <Textarea
                    label="¿Por qué quieres ser mentor?"
                    name="motivation"
                    placeholder="Comparte tu motivación para ayudar a otros..."
                    rows={3}
                    required
                  />
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBecomeMentor(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Enviar Solicitud
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Benefits */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            Beneficios de la mentoría:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Como Mentee:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Aprende de la experiencia de otros</li>
                <li>• Recibe feedback personalizado</li>
                <li>• Acelera tu crecimiento personal</li>
                <li>• Evita errores comunes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Como Mentor:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Refuerza tu propio conocimiento</li>
                <li>• Desarrolla habilidades de liderazgo</li>
                <li>• Contribuye al crecimiento de otros</li>
                <li>• Construye una red profesional</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
