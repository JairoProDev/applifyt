'use client'

import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { GoalForm } from '@/components/goals/GoalForm'

export default function NewGoalPage() {
  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <GoalForm onSuccess={() => history.back()} onCancel={() => history.back()} />
      </div>
    </Layout>
  )
}





