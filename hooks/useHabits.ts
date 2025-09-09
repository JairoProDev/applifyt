import { useState, useEffect } from 'react'
import { HabitWithLogs, HabitFormData } from '@/types'
import { useSession } from 'next-auth/react'

export function useHabits() {
  const [habits, setHabits] = useState<HabitWithLogs[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  const fetchHabits = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const response = await fetch('/api/habits')
      if (!response.ok) throw new Error('Failed to fetch habits')
      
      const data = await response.json()
      setHabits(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createHabit = async (habitData: HabitFormData) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData),
      })

      if (!response.ok) throw new Error('Failed to create habit')
      
      const newHabit = await response.json()
      setHabits(prev => [...prev, newHabit])
      return newHabit
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create habit')
      throw err
    }
  }

  const updateHabit = async (id: string, habitData: Partial<HabitFormData>) => {
    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData),
      })

      if (!response.ok) throw new Error('Failed to update habit')
      
      const updatedHabit = await response.json()
      setHabits(prev => prev.map(h => h.id === id ? updatedHabit : h))
      return updatedHabit
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update habit')
      throw err
    }
  }

  const deleteHabit = async (id: string) => {
    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete habit')
      
      setHabits(prev => prev.filter(h => h.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete habit')
      throw err
    }
  }

  const logHabit = async (habitId: string, completed: boolean, count: number = 1, notes?: string, mood?: number) => {
    try {
      const response = await fetch('/api/habits/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitId,
          completed,
          count,
          notes,
          mood,
        }),
      })

      if (!response.ok) throw new Error('Failed to log habit')
      
      const logData = await response.json()
      
      // Update the habit in the local state
      setHabits(prev => prev.map(habit => {
        if (habit.id === habitId) {
          return {
            ...habit,
            logs: [...habit.logs, logData],
            currentStreak: logData.currentStreak,
            completionRate: logData.completionRate,
          }
        }
        return habit
      }))
      
      return logData
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log habit')
      throw err
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchHabits()
    }
  }, [session?.user?.id])

  return {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    logHabit,
    refetch: fetchHabits,
  }
}
