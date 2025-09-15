'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/shell/AppShell'
import { ProgressiveDashboard } from '@/components/dashboard/ProgressiveDashboard'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { useDashboard } from '@/hooks/useDashboard'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TodayPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    // Redirect to solve page for now - focused on single use case
    router.push('/solve')
  }, [session, router])

  return null
}
