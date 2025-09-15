'use client'

import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { HabitForm } from '@/components/habits/HabitForm'

export default function NewHabitPage() {
  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <HabitForm onSuccess={() => history.back()} onCancel={() => history.back()} />
      </div>
    </Layout>
  )
}





