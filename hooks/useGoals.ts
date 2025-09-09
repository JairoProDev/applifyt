import { useState, useEffect } from 'react'
import { GoalWithProgress, GoalFormData } from '@/types'
import { useSession } from 'next-auth/react'

export function useGoals() {
  const [goals, setGoals] = useState<GoalWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  const fetchGoals = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const response = await fetch('/api/goals')
      if (!response.ok) throw new Error('Failed to fetch goals')
      
      const data = await response.json()
      setGoals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async (goalData: GoalFormData) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData),
      })

      if (!response.ok) throw new Error('Failed to create goal')
      
      const newGoal = await response.json()
      setGoals(prev => [...prev, newGoal])
      return newGoal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal')
      throw err
    }
  }

  const updateGoal = async (id: string, goalData: Partial<GoalFormData>) => {
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData),
      })

      if (!response.ok) throw new Error('Failed to update goal')
      
      const updatedGoal = await response.json()
      setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g))
      return updatedGoal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal')
      throw err
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete goal')
      
      setGoals(prev => prev.filter(g => g.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete goal')
      throw err
    }
  }

  const logProgress = async (goalId: string, progress: number, notes?: string, evidence?: string) => {
    try {
      const response = await fetch('/api/goals/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId,
          progress,
          notes,
          evidence,
        }),
      })

      if (!response.ok) throw new Error('Failed to log progress')
      
      const progressData = await response.json()
      
      // Update the goal in the local state
      setGoals(prev => prev.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            progressLogs: [...goal.progressLogs, progressData],
            progress: progressData.updatedProgress,
          }
        }
        return goal
      }))
      
      return progressData
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log progress')
      throw err
    }
  }

  const getGoalsByType = (type: string) => {
    return goals.filter(goal => goal.type === type)
  }

  const getGoalsByLevel = (level: number) => {
    return goals.filter(goal => goal.level === level)
  }

  const getActiveGoals = () => {
    return goals.filter(goal => goal.status === 'active')
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchGoals()
    }
  }, [session?.user?.id])

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    logProgress,
    getGoalsByType,
    getGoalsByLevel,
    getActiveGoals,
    refetch: fetchGoals,
  }
}
