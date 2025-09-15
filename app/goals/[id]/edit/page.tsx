'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { GoalForm } from '@/components/goals/GoalForm'

export default function EditGoalPage() {
  const params = useParams()
  const [initialData, setInitialData] = useState<any | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/goals`)
        const goals = await res.json()
        const g = goals.find((x: any) => x.id === params?.id)
        setInitialData(g || null)
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
          <GoalForm initialData={initialData} onSuccess={() => history.back()} onCancel={() => history.back()} />
        )}
      </div>
    </Layout>
  )
}





