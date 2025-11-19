import { Trophy, Target, CheckSquare, TrendingUp, Calendar, Award, Star, Zap, Heart, Users } from 'lucide-react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  category: 'habits' | 'goals' | 'streak' | 'check-in' | 'progress' | 'special'
  requirement: number
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export const achievements: Achievement[] = [
  // Habit Achievements
  {
    id: 'first_habit',
    title: 'Primer Paso',
    description: 'Crea tu primer hábito',
    icon: CheckSquare,
    category: 'habits',
    requirement: 1,
    points: 10,
    tier: 'bronze',
  },
  {
    id: 'habit_master',
    title: 'Maestro de Hábitos',
    description: 'Crea 5 hábitos',
    icon: CheckSquare,
    category: 'habits',
    requirement: 5,
    points: 50,
    tier: 'silver',
  },
  {
    id: 'habit_architect',
    title: 'Arquitecto de Rutinas',
    description: 'Crea 10 hábitos',
    icon: CheckSquare,
    category: 'habits',
    requirement: 10,
    points: 100,
    tier: 'gold',
  },

  // Streak Achievements
  {
    id: 'streak_week',
    title: 'Una Semana Fuerte',
    description: 'Mantén una racha de 7 días',
    icon: Zap,
    category: 'streak',
    requirement: 7,
    points: 25,
    tier: 'bronze',
  },
  {
    id: 'streak_month',
    title: 'Mes de Consistencia',
    description: 'Mantén una racha de 30 días',
    icon: Zap,
    category: 'streak',
    requirement: 30,
    points: 100,
    tier: 'silver',
  },
  {
    id: 'streak_quarter',
    title: 'Imparable',
    description: 'Mantén una racha de 90 días',
    icon: Zap,
    category: 'streak',
    requirement: 90,
    points: 300,
    tier: 'gold',
  },
  {
    id: 'streak_year',
    title: 'Leyenda Viviente',
    description: 'Mantén una racha de 365 días',
    icon: Zap,
    category: 'streak',
    requirement: 365,
    points: 1000,
    tier: 'platinum',
  },

  // Goal Achievements
  {
    id: 'first_goal',
    title: 'Visionario',
    description: 'Crea tu primera meta',
    icon: Target,
    category: 'goals',
    requirement: 1,
    points: 10,
    tier: 'bronze',
  },
  {
    id: 'goal_complete',
    title: 'Conquistador',
    description: 'Completa tu primera meta',
    icon: Trophy,
    category: 'goals',
    requirement: 1,
    points: 50,
    tier: 'silver',
  },
  {
    id: 'goal_master',
    title: 'Maestro de Objetivos',
    description: 'Completa 5 metas',
    icon: Trophy,
    category: 'goals',
    requirement: 5,
    points: 200,
    tier: 'gold',
  },
  {
    id: 'goal_legend',
    title: 'Leyenda del Logro',
    description: 'Completa 10 metas',
    icon: Trophy,
    category: 'goals',
    requirement: 10,
    points: 500,
    tier: 'platinum',
  },

  // Check-in Achievements
  {
    id: 'first_checkin',
    title: 'Primer Registro',
    description: 'Completa tu primer check-in diario',
    icon: Calendar,
    category: 'check-in',
    requirement: 1,
    points: 5,
    tier: 'bronze',
  },
  {
    id: 'checkin_week',
    title: 'Semana Consciente',
    description: 'Completa check-ins 7 días seguidos',
    icon: Calendar,
    category: 'check-in',
    requirement: 7,
    points: 30,
    tier: 'silver',
  },
  {
    id: 'checkin_month',
    title: 'Mes de Reflexión',
    description: 'Completa check-ins 30 días seguidos',
    icon: Calendar,
    category: 'check-in',
    requirement: 30,
    points: 100,
    tier: 'gold',
  },

  // Progress Achievements
  {
    id: 'habit_100',
    title: 'Centenario',
    description: 'Completa un hábito 100 veces',
    icon: TrendingUp,
    category: 'progress',
    requirement: 100,
    points: 100,
    tier: 'silver',
  },
  {
    id: 'habit_500',
    title: 'Dedicación Extrema',
    description: 'Completa un hábito 500 veces',
    icon: TrendingUp,
    category: 'progress',
    requirement: 500,
    points: 300,
    tier: 'gold',
  },
  {
    id: 'habit_1000',
    title: 'Maestría Total',
    description: 'Completa un hábito 1000 veces',
    icon: TrendingUp,
    category: 'progress',
    requirement: 1000,
    points: 1000,
    tier: 'platinum',
  },

  // Special Achievements
  {
    id: 'perfect_week',
    title: 'Semana Perfecta',
    description: 'Completa todos tus hábitos durante 7 días',
    icon: Star,
    category: 'special',
    requirement: 1,
    points: 75,
    tier: 'gold',
  },
  {
    id: 'early_bird',
    title: 'Madrugador',
    description: 'Completa un hábito antes de las 6 AM',
    icon: Award,
    category: 'special',
    requirement: 1,
    points: 25,
    tier: 'bronze',
  },
  {
    id: 'night_owl',
    title: 'Búho Nocturno',
    description: 'Completa un hábito después de las 10 PM',
    icon: Award,
    category: 'special',
    requirement: 1,
    points: 25,
    tier: 'bronze',
  },
]

export function getTierColor(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'text-orange-600 bg-orange-100'
    case 'silver':
      return 'text-gray-600 bg-gray-100'
    case 'gold':
      return 'text-yellow-600 bg-yellow-100'
    case 'platinum':
      return 'text-purple-600 bg-purple-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function calculateLevel(totalPoints: number): {
  level: number
  currentLevelPoints: number
  nextLevelPoints: number
  progress: number
} {
  // Level formula: level = floor(sqrt(points / 100))
  const level = Math.floor(Math.sqrt(totalPoints / 100)) + 1
  const currentLevelThreshold = Math.pow(level - 1, 2) * 100
  const nextLevelThreshold = Math.pow(level, 2) * 100
  const currentLevelPoints = totalPoints - currentLevelThreshold
  const pointsNeeded = nextLevelThreshold - currentLevelThreshold
  const progress = (currentLevelPoints / pointsNeeded) * 100

  return {
    level,
    currentLevelPoints,
    nextLevelPoints: pointsNeeded,
    progress,
  }
}

export function getLevelTitle(level: number): string {
  if (level >= 50) return 'Maestro Supremo'
  if (level >= 40) return 'Leyenda'
  if (level >= 30) return 'Gurú'
  if (level >= 25) return 'Experto'
  if (level >= 20) return 'Avanzado'
  if (level >= 15) return 'Competente'
  if (level >= 10) return 'Experimentado'
  if (level >= 5) return 'Aprendiz'
  return 'Novato'
}
