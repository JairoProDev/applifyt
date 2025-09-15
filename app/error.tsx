'use client'

import React, { useEffect } from 'react'
import { AppShell } from '@/components/shell/AppShell'
import { Button } from '@/components/ui/Button'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <AppShell currentPage="more">
      <div className="w-full max-w-none px-4 lg:px-6 py-12 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Algo salió mal</h1>
        <p className="text-gray-600 mb-6">Hemos detectado un error inesperado. Puedes intentar recargar.</p>
        <Button onClick={() => reset()}>Reintentar</Button>
      </div>
    </AppShell>
  )
}




