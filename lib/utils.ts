import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, startOfWeek, endOfWeek, isSameDay, isSameWeek } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy')
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm')
}

export function getWeekRange(date: Date) {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }), // Monday
    end: endOfWeek(date, { weekStartsOn: 1 })
  }
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function isThisWeek(date: Date): boolean {
  return isSameWeek(date, new Date(), { weekStartsOn: 1 })
}

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0
  
  const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime())
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i])
    date.setHours(0, 0, 0, 0)
    
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (date.getTime() === expectedDate.getTime()) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export function getHabitFrequencyMultiplier(frequency: string): number {
  switch (frequency) {
    case 'daily':
      return 1
    case 'weekly':
      return 7
    case 'monthly':
      return 30
    default:
      return 1
  }
}

export function calculateHabitScore(completed: number, target: number, frequency: string): number {
  const multiplier = getHabitFrequencyMultiplier(frequency)
  const adjustedTarget = target * multiplier
  return Math.min((completed / adjustedTarget) * 100, 100)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
