'use client'

import React from 'react'
import { AppShell } from '@/components/shell/AppShell'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <AppShell currentPage="more">
      <div className="w-full max-w-none px-4 lg:px-6 py-12 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
        <p className="text-gray-600 mb-6">La ruta que buscaste no existe o fue movida.</p>
        <div className="space-x-3">
          <Button onClick={() => router.push('/today')}>Ir a Hoy</Button>
          <Button variant="outline" onClick={() => router.push('/plan')}>Ir a Plan</Button>
        </div>
      </div>
    </AppShell>
  )
}


