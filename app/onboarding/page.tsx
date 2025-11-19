'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { OnboardingWizard, OnboardingData } from '@/components/onboarding/OnboardingWizard'
import { LoadingPage } from '@/components/ui/Loading'
import toast from 'react-hot-toast'

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <LoadingPage message="Cargando..." />
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleComplete = async (data: OnboardingData) => {
    try {
      // Save onboarding data
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save onboarding data')
      }

      toast.success('¡Bienvenido a Applifyt! 🎉')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast.error('Error al guardar tus datos. Inténtalo de nuevo.')
    }
  }

  return <OnboardingWizard onComplete={handleComplete} />
}
