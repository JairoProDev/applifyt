'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/shell/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  CreditCard,
  Download,
  Share2,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  Target,
  Zap,
  Heart,
  Brain,
  TrendingUp,
  Calendar,
  BookOpen
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function MorePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const quickActions = [
    {
      title: 'Finanzas',
      description: 'Controla tus gastos y ahorros',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/finances'
    },
    {
      title: 'Salud',
      description: 'Seguimiento de ejercicio y nutrición',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/health'
    },
    {
      title: 'Diario',
      description: 'Reflexiones y pensamientos',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/journal'
    },
    {
      title: 'Aprendizaje',
      description: 'Cursos y habilidades',
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/learning'
    }
  ]

  const settingsSections = [
    {
      title: 'Cuenta',
      items: [
        {
          icon: User,
          title: 'Perfil',
          description: 'Información personal y preferencias',
          href: '/profile'
        },
        {
          icon: Bell,
          title: 'Notificaciones',
          description: 'Configura alertas y recordatorios',
          href: '/notifications'
        },
        {
          icon: Shield,
          title: 'Privacidad',
          description: 'Controla tu información personal',
          href: '/privacy'
        }
      ]
    },
    {
      title: 'Aplicación',
      items: [
        {
          icon: Settings,
          title: 'Configuración General',
          description: 'Preferencias de la aplicación',
          href: '/settings'
        },
        {
          icon: Download,
          title: 'Exportar Datos',
          description: 'Descarga tu información',
          href: '/export'
        },
        {
          icon: Share2,
          title: 'Compartir',
          description: 'Invita amigos y familiares',
          href: '/share'
        }
      ]
    },
    {
      title: 'Soporte',
      items: [
        {
          icon: HelpCircle,
          title: 'Ayuda y FAQ',
          description: 'Preguntas frecuentes y guías',
          href: '/help'
        },
        {
          icon: Target,
          title: 'Tutoriales',
          description: 'Aprende a usar Applify',
          href: '/tutorials'
        }
      ]
    }
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleThemeToggle = () => {
    setDarkMode(!darkMode)
    // Implement theme switching logic here
  }

  return (
    <AppShell currentPage="more">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Más</h1>
            <p className="text-gray-600">
              Configuración, herramientas adicionales y soporte
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleThemeToggle}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* User Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {session.user?.name || 'Usuario'}
                </h3>
                <p className="text-gray-500">{session.user?.email}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Miembro desde 2024</span>
                  <Badge variant="outline" size="sm">Plan Gratuito</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${action.bgColor}`}>
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
              <Card>
                <CardContent className="p-0">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon
                    const isLast = itemIndex === section.items.length - 1
                    
                    return (
                      <div
                        key={itemIndex}
                        className={`flex items-center justify-between p-4 ${
                          !isLast ? 'border-b border-gray-200' : ''
                        } hover:bg-gray-50 cursor-pointer`}
                        onClick={() => router.push(item.href)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gray-100">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* App Info */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Applify</h3>
              <p className="text-gray-500 mb-4">Versión 1.0.0</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>© 2024 Applify</span>
                <span>•</span>
                <span>Todos los derechos reservados</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
