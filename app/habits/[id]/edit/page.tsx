'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { HabitForm } from '@/components/habits/HabitForm'

export default function EditHabitPage() {
  const params = useParams()
  const [initialData, setInitialData] = useState<any | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/habits`)
        const items = await res.json()
        const h = items.find((x: any) => x.id === params?.id)
        setInitialData(h || null)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [params?.id])

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        {initialData && (
          <HabitForm initialData={initialData} onSuccess={() => history.back()} onCancel={() => history.back()} />
        )}
      </div>
    </Layout>
  )
}





