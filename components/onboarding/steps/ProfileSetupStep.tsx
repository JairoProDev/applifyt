'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { User, ArrowRight, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProfileSetupStepProps {
  data: any
  onNext: (data: any) => void
  onBack: () => void
}

export function ProfileSetupStep({ data, onNext, onBack }: ProfileSetupStepProps) {
  const [formData, setFormData] = useState({
    name: data?.profile?.name || '',
    timezone: data?.profile?.timezone || 'America/Mexico_City',
    bio: data?.profile?.bio || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Por favor ingresa tu nombre')
      return
    }

    onNext(formData)
  }

  const timezones = [
    { value: 'America/Mexico_City', label: 'Ciudad de México (CST)' },
    { value: 'America/New_York', label: 'Nueva York (EST)' },
    { value: 'America/Los_Angeles', label: 'Los Ángeles (PST)' },
    { value: 'America/Chicago', label: 'Chicago (CST)' },
    { value: 'America/Bogota', label: 'Bogotá' },
    { value: 'America/Santiago', label: 'Santiago' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires' },
    { value: 'Europe/Madrid', label: 'Madrid' },
    { value: 'UTC', label: 'UTC' },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <User className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Cuéntanos sobre ti
        </h2>
        <p className="text-gray-600">
          Personaliza tu experiencia con algunos datos básicos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            ¿Cómo te llamas? *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Tu nombre"
            className="text-lg"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
            Zona Horaria
          </label>
          <select
            id="timezone"
            value={formData.timezone}
            onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
            className="input w-full"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Usaremos esto para programar recordatorios
          </p>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Sobre ti (Opcional)
          </label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Cuéntanos qué te motiva a comenzar este viaje de crecimiento personal..."
            rows={4}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>
          <Button type="submit" className="flex-1">
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
