'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  Sparkles,
  Check
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeSettings() {
  const { theme, colorScheme, stylePreset, setTheme, setColorScheme, setStylePreset, toggleTheme } = useTheme()

  const colorSchemes = [
    { id: 'blue', name: 'Azul', color: '#3b82f6' },
    { id: 'green', name: 'Verde', color: '#22c55e' },
    { id: 'purple', name: 'Púrpura', color: '#a855f7' },
    { id: 'red', name: 'Rojo', color: '#ef4444' },
    { id: 'orange', name: 'Naranja', color: '#f97316' },
    { id: 'pink', name: 'Rosa', color: '#ec4899' },
    { id: 'indigo', name: 'Índigo', color: '#6366f1' },
    { id: 'teal', name: 'Verde Azulado', color: '#14b8a6' },
  ]

  const stylePresets = [
    { id: 'modern', name: 'Moderno', description: 'Diseño limpio y contemporáneo' },
    { id: 'minimal', name: 'Minimalista', description: 'Simplicidad y elegancia' },
    { id: 'vintage', name: 'Vintage', description: 'Estilo clásico y retro' },
    { id: 'tech', name: 'Tecnológico', description: 'Futurista y digital' },
    { id: 'scientific', name: 'Científico', description: 'Precisión y datos' },
    { id: 'retro', name: 'Retro', description: 'Nostalgia de los 80s' },
    { id: 'neon', name: 'Neón', description: 'Colores vibrantes y brillo' },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'Futuro distópico' },
    { id: 'elegant', name: 'Elegante', description: 'Sofisticado y refinado' },
    { id: 'playful', name: 'Juguetón', description: 'Divertido y colorido' },
  ]

  return (
    <div className="space-y-6">
      {/* Theme Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="h-5 w-5 mr-2" />
            Tema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className="flex items-center space-x-2"
            >
              <Sun className="h-4 w-4" />
              <span>Claro</span>
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className="flex items-center space-x-2"
            >
              <Moon className="h-4 w-4" />
              <span>Oscuro</span>
            </Button>
            <Button
              variant="outline"
              onClick={toggleTheme}
              className="flex items-center space-x-2"
            >
              <Monitor className="h-4 w-4" />
              <span>Auto</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Colores Principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setColorScheme(scheme.id as any)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  colorScheme === scheme.id
                    ? 'border-primary-500 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-full h-8 rounded mb-2"
                  style={{ backgroundColor: scheme.color }}
                />
                <div className="text-sm font-medium text-gray-900">
                  {scheme.name}
                </div>
                {colorScheme === scheme.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-primary-600" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Style Preset */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Estilo de Diseño
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stylePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setStylePreset(preset.id as any)}
                className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                  stylePreset === preset.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {preset.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {preset.description}
                    </div>
                  </div>
                  {stylePreset === preset.id && (
                    <Check className="h-5 w-5 text-primary-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Vista Previa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div>
                <div className="font-semibold text-primary-900">Applify</div>
                <div className="text-sm text-primary-600">La App del Progreso</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-primary-200 rounded-full w-3/4"></div>
              <div className="h-2 bg-primary-200 rounded-full w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

