import { useState, useEffect } from 'react'
import { DashboardData } from '@/types'
import { useSession } from 'next-auth/react'

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  const fetchDashboardData = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      
      const data = await response.json()
      // Ensure safe zero defaults for UI
      const safe = {
        habits: data.habits ?? [],
        goals: data.goals ?? [],
        todayCheckIn: data.todayCheckIn ?? undefined,
        weeklyReview: data.weeklyReview ?? undefined,
        stats: {
          totalHabits: data.stats?.totalHabits ?? (data.habits ? data.habits.length : 0),
          completedHabitsToday: data.stats?.completedHabitsToday ?? 0,
          activeGoals: data.stats?.activeGoals ?? (data.goals ? data.goals.length : 0),
          currentStreak: data.stats?.currentStreak ?? 0,
          weeklyProgress: data.stats?.weeklyProgress ?? 0,
        }
      }
      setDashboardData(safe)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const checkInToday = async (checkInData: any) => {
    try {
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkInData),
      })

      if (!response.ok) throw new Error('Failed to submit check-in')
      
      const data = await response.json()
      
      // Update dashboard data
      setDashboardData(prev => prev ? {
        ...prev,
        todayCheckIn: data
      } : null)
      
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit check-in')
      throw err
    }
  }

  const submitWeeklyReview = async (reviewData: any) => {
    try {
      const response = await fetch('/api/weekly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      })

      if (!response.ok) throw new Error('Failed to submit weekly review')
      
      const data = await response.json()
      
      // Update dashboard data
      setDashboardData(prev => prev ? {
        ...prev,
        weeklyReview: data
      } : null)
      
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit weekly review')
      throw err
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData()
    }
  }, [session?.user?.id])

  return {
    dashboardData,
    loading,
    error,
    checkInToday,
    submitWeeklyReview,
    refetch: fetchDashboardData,
  }
}
