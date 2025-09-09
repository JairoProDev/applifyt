'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { FailureManagement } from '@/components/resilience/FailureManagement'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Shield, 
  Heart, 
  Target, 
  Lightbulb,
  TrendingUp,
  Users
} from 'lucide-react'

export default function ResiliencePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fase F: Fortify (Fortalecimiento)
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Construye resiliencia mental y sistemas de apoyo para mantener el progreso 
            cuando la motivación falla y surgen obstáculos.
          </p>
        </div>

        {/* Resilience Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Autocompasión</h3>
              <p className="text-sm text-gray-600">
                Trátate con amabilidad ante el fracaso. La autocompasión es más efectiva 
                que la autocrítica para la perseverancia a largo plazo.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Mentalidad de Crecimiento</h3>
              <p className="text-sm text-gray-600">
                Cree que tus habilidades pueden desarrollarse a través de la dedicación 
                y el trabajo duro. Los fracasos son oportunidades de aprendizaje.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Antifragilidad</h3>
              <p className="text-sm text-gray-600">
                Ve más allá de la resiliencia. Construye sistemas que se beneficien 
                del caos, el estrés y la volatilidad.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Planificación de Fallos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Antes de empezar un proyecto, imagina que ha fracasado estrepitosamente. 
                ¿Qué salió mal? Crea planes para mitigar esos riesgos.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Identifica posibles puntos de falla</li>
                <li>• Crea planes de contingencia</li>
                <li>• Establece sistemas de apoyo</li>
                <li>• Prepara respuestas automáticas</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Gabinete de Apoyo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Identifica a las personas en tu vida que te apoyan y programa 
                interacciones regulares con ellas.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Familia y amigos cercanos</li>
                <li>• Mentores y coaches</li>
                <li>• Compañeros de accountability</li>
                <li>• Comunidades de apoyo</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Failure Management Tool */}
        <FailureManagement />
      </div>
    </Layout>
  )
}
