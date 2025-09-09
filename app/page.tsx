'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Target, 
  CheckSquare, 
  TrendingUp, 
  Users,
  ArrowRight,
  Star,
  Zap,
  Heart
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (session) {
      // User is logged in, redirect to today page
      router.push('/today')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect
  }
  const features = [
    {
      icon: CheckSquare,
      title: 'Sistema de Hábitos Avanzado',
      description: 'Implementa el bucle de hábitos con señales, rutinas y recompensas para crear cambios duraderos.',
    },
    {
      icon: Target,
      title: 'Metas con Framework WOOP',
      description: 'Define tus objetivos usando el método científico WOOP para maximizar tus probabilidades de éxito.',
    },
    {
      icon: TrendingUp,
      title: 'Seguimiento de Progreso',
      description: 'Visualiza tu evolución con métricas detalladas y análisis de tendencias.',
    },
    {
      icon: Heart,
      title: 'Check-ins Diarios',
      description: 'Reflexiona sobre tu día y mantén un registro de tu bienestar emocional.',
    },
  ]

  const testimonials = [
    {
      name: 'María González',
      role: 'Emprendedora',
      content: 'Applify me ha ayudado a transformar mi vida. En 3 meses logré establecer 5 hábitos nuevos y completar 2 metas importantes.',
      rating: 5,
    },
    {
      name: 'Carlos Ruiz',
      role: 'Desarrollador',
      content: 'El sistema de tracking es increíble. Puedo ver exactamente cómo mis hábitos impactan mi productividad y bienestar.',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      role: 'Estudiante',
      content: 'La metodología U.P.L.I.F.T. es revolucionaria. Por fin tengo un sistema que realmente funciona para mi crecimiento personal.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              La App del{' '}
              <span className="text-primary-600">Progreso</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Administra cada área de tu vida con el Protocolo U.P.L.I.F.T. 
              Una plataforma científica para el crecimiento personal que te acompaña en tu transformación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Comenzar Gratis
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu crecimiento personal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Basado en la ciencia del comportamiento y las mejores prácticas de desarrollo personal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol U.P.L.I.F.T. Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              El Protocolo U.P.L.I.F.T.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un framework científico de 6 fases para la auto-superación
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { letter: 'U', word: 'Understand', description: 'Comprensión y autoconciencia radical' },
              { letter: 'P', word: 'Plan', description: 'Planificación y diseño estratégico' },
              { letter: 'L', word: 'Launch', description: 'Lanzamiento y formación de hábitos' },
              { letter: 'I', word: 'Iterate', description: 'Iteración y retroalimentación' },
              { letter: 'F', word: 'Fortify', description: 'Fortalecimiento y resiliencia' },
              { letter: 'T', word: 'Transcend', description: 'Trascender e integración' },
            ].map((phase, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-4">
                    {phase.letter}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {phase.word}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {phase.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600">
              Miles de personas ya están transformando sus vidas con Applify
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para transformar tu vida?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de personas que ya están usando Applify para alcanzar sus metas y desarrollar hábitos duraderos.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              <Zap className="h-5 w-5 mr-2" />
              Comenzar Ahora - Es Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Applify</h3>
            <p className="text-gray-400 mb-6">
              La plataforma para el crecimiento personal
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacidad
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Términos
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contacto
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              © 2024 Applify. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
