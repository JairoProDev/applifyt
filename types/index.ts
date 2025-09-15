import { User, Habit, Goal, HabitLog, GoalProgress, DailyCheckIn, WeeklyReview } from '@prisma/client'

export type { User, Habit, Goal, HabitLog, GoalProgress, DailyCheckIn, WeeklyReview }

export interface HabitWithLogs extends Habit {
  logs: HabitLog[]
  currentStreak: number
  completionRate: number
}

export interface GoalWithProgress extends Goal {
  progressLogs: GoalProgress[]
  subGoals: Goal[]
}

export interface DashboardData {
  habits: HabitWithLogs[]
  goals: GoalWithProgress[]
  todayCheckIn?: DailyCheckIn
  weeklyReview?: WeeklyReview
  stats: {
    totalHabits: number
    completedHabitsToday: number
    activeGoals: number
    currentStreak: number
    weeklyProgress: number
  }
}

export interface HabitFormData {
  name: string
  description?: string
  cue: string
  routine: string
  reward: string
  craving?: string
  frequency: 'daily' | 'weekly' | 'monthly'
  targetCount: number
  unit?: string
  stackAfter?: string
  stackBefore?: string
  difficulty: number
  importance: number
}

export interface GoalFormData {
  title: string
  description?: string
  type: 'vision' | 'annual' | 'quarterly' | 'monthly' | 'weekly' | 'project'
  level: number
  wish: string
  outcome: string
  obstacle: string
  plan: string
  specific: string
  measurable: string
  achievable: boolean
  relevant: string
  timebound: Date
  priority: number
  parentGoalId?: string
}

export interface CheckInFormData {
  mood: number
  energy: number
  stress: number
  gratitude?: string
  win?: string
  challenge?: string
  lesson?: string
  goalsProgress?: string
  habitsReflection?: string
}

export interface WeeklyReviewFormData {
  wins: string[]
  challenges: string[]
  lessons: string[]
  nextWeekFocus?: string
  adjustments?: string
}

export type HabitFrequency = 'daily' | 'weekly' | 'monthly'
export type GoalType = 'vision' | 'annual' | 'quarterly' | 'monthly' | 'weekly' | 'project'
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled'

export interface ChartData {
  name: string
  value: number
  date?: string
  [key: string]: any
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

// Protocol types (for Library)
export interface Protocol {
  id: string
  title: string
  description?: string
  category: string
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | string
  duration: string
  tags: string[]
  steps?: any
  featured?: boolean
  createdById?: string
  createdAt: string
  updatedAt: string
}

export interface ProtocolFormData {
  title: string
  description?: string
  category: string
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | string
  duration: string
  tags: string[]
  steps?: any
  featured?: boolean
}
