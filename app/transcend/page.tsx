'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { MentorshipPlatform } from '@/components/transcend/MentorshipPlatform'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Star, 
  Heart, 
  Target, 
  Users,
  BookOpen,
  Lightbulb,
  Globe
} from 'lucide-react'

export default function TranscendPage() {
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
            Fase T: Transcend (Trascender)
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            El nivel de maestría. El sistema ya no es algo que "haces", es parte de quién "eres". 
            El enfoque se desplaza de la superación personal a la contribución y el impacto.
          </p>
        </div>

        {/* Transcendence Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Cambio de Identidad</h3>
              <p className="text-sm text-gray-600">
                El objetivo final de los hábitos es convertirse en el tipo de persona 
                que logra esas cosas. El comportamiento sostenido cambia la autoimagen.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Autotrascendencia</h3>
              <p className="text-sm text-gray-600">
                Una vez que las necesidades básicas están cubiertas, el impulso humano 
                se dirige a alcanzar el máximo potencial y contribuir a un bien mayor.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Efecto Protegido</h3>
              <p className="text-sm text-gray-600">
                Enseñar a otros es una de las formas más efectivas de profundizar 
                el propio conocimiento y consolidar el aprendizaje.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Conviértete en Mentor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ayuda a alguien que está unos pasos detrás de ti en su propio viaje. 
                La mentoría es una de las formas más poderosas de consolidar tu propio crecimiento.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Comparte tu experiencia y conocimientos</li>
                <li>• Guía a otros en su proceso de crecimiento</li>
                <li>• Refuerza tu propio aprendizaje</li>
                <li>• Construye una red de impacto positivo</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-500" />
                Metas de Contribución
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                ¿Cómo puedes usar tus habilidades y tu crecimiento para impactar 
                positivamente a tu comunidad o al mundo?
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Proyectos de impacto social</li>
                <li>• Voluntariado y servicio comunitario</li>
                <li>• Creación de contenido educativo</li>
                <li>• Liderazgo en iniciativas positivas</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Mentorship Platform */}
        <MentorshipPlatform />

        {/* Legacy Planning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
              Planificación de Legado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              En este punto, eres el arquitecto jefe de tu propio sistema de crecimiento. 
              Lo optimizas y adaptas continuamente a las nuevas estaciones de tu vida.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Refina tu Sistema:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Optimiza continuamente tus hábitos</li>
                  <li>• Adapta tu sistema a nuevas etapas de vida</li>
                  <li>• Integra nuevas metodologías y técnicas</li>
                  <li>• Mantén la flexibilidad y la evolución</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Crea tu Legado:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Documenta tu sistema y metodologías</li>
                  <li>• Crea recursos para otros</li>
                  <li>• Establece proyectos de largo plazo</li>
                  <li>• Deja un impacto duradero</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100">
          <CardContent className="p-8 text-center">
            <Lightbulb className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¿Listo para Trascender?
            </h3>
            <p className="text-gray-600 mb-6">
              Has llegado al nivel de maestría. Ahora es momento de compartir tu conocimiento 
              y crear un impacto positivo en el mundo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary">
                <Users className="h-4 w-4 mr-2" />
                Convertirme en Mentor
              </button>
              <button className="btn btn-outline">
                <Globe className="h-4 w-4 mr-2" />
                Planificar mi Legado
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
