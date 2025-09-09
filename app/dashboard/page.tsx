'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { TodayHabits } from '@/components/dashboard/TodayHabits'
import { ActiveGoals } from '@/components/dashboard/ActiveGoals'
import { QuickCheckIn } from '@/components/dashboard/QuickCheckIn'
import { HabitForm } from '@/components/habits/HabitForm'
import { GoalForm } from '@/components/goals/GoalForm'
import { useDashboard } from '@/hooks/useDashboard'
import { useHabits } from '@/hooks/useHabits'
import { useGoals } from '@/hooks/useGoals'
import { Button } from '@/components/ui/Button'
import { 
  Plus, 
  Calendar,
  TrendingUp,
  Target,
  CheckSquare
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { dashboardData, loading: dashboardLoading } = useDashboard()
  const { habits, loading: habitsLoading } = useHabits()
  const { goals, loading: goalsLoading } = useGoals()
  
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<any>(null)
  const [editingGoal, setEditingGoal] = useState<any>(null)

  if (status === 'loading' || dashboardLoading || habitsLoading || goalsLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bienvenido a Applify
            </h2>
            <p className="text-gray-600 mb-8">
              Comienza tu viaje de crecimiento personal creando tu primer hábito o meta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setShowHabitForm(true)}>
                <CheckSquare className="h-5 w-5 mr-2" />
                Crear mi primer hábito
              </Button>
              <Button variant="outline" onClick={() => setShowGoalForm(true)}>
                <Target className="h-5 w-5 mr-2" />
                Crear mi primera meta
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const handleHabitSuccess = () => {
    setShowHabitForm(false)
    setEditingHabit(null)
  }

  const handleGoalSuccess = () => {
    setShowGoalForm(false)
    setEditingGoal(null)
  }

  const handleEditHabit = (habit: any) => {
    setEditingHabit(habit)
    setShowHabitForm(true)
  }

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal)
    setShowGoalForm(true)
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              ¡Hola, {session.user?.name || 'Usuario'}!
            </h1>
            <p className="text-gray-600">
              Aquí tienes un resumen de tu progreso de hoy
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowHabitForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Hábito
            </Button>
            <Button
              onClick={() => setShowGoalForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Meta
            </Button>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats data={dashboardData} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Habits */}
          <div className="lg:col-span-2">
            <TodayHabits
              habits={habits}
              onAddHabit={() => setShowHabitForm(true)}
            />
          </div>

          {/* Quick Check-in */}
          <div>
            <QuickCheckIn
              hasCheckedInToday={!!dashboardData.todayCheckIn}
            />
          </div>
        </div>

        {/* Active Goals */}
        <ActiveGoals
          goals={goals}
          onAddGoal={() => setShowGoalForm(true)}
          onAddProgress={(goal) => {
            // TODO: Implement progress logging modal
            console.log('Add progress for goal:', goal)
          }}
        />

        {/* Modals */}
        {showHabitForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <HabitForm
                initialData={editingHabit}
                onSuccess={handleHabitSuccess}
                onCancel={() => {
                  setShowHabitForm(false)
                  setEditingHabit(null)
                }}
              />
            </div>
          </div>
        )}

        {showGoalForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <GoalForm
                initialData={editingGoal}
                onSuccess={handleGoalSuccess}
                onCancel={() => {
                  setShowGoalForm(false)
                  setEditingGoal(null)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
