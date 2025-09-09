'use client'

import React from 'react'
import { DashboardData } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  CheckSquare, 
  Target, 
  Flame, 
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react'

interface DashboardStatsProps {
  data: DashboardData
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const { stats } = data

  const statCards = [
    {
      title: 'Hábitos Completados Hoy',
      value: stats.completedHabitsToday,
      total: stats.totalHabits,
      icon: CheckSquare,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      description: 'de tus hábitos diarios',
    },
    {
      title: 'Racha Actual',
      value: stats.currentStreak,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'días consecutivos',
    },
    {
      title: 'Metas Activas',
      value: stats.activeGoals,
      icon: Target,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      description: 'en progreso',
    },
    {
      title: 'Progreso Semanal',
      value: `${stats.weeklyProgress.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'de tus objetivos',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.total && (
                    <span className="ml-1 text-sm text-gray-500">
                      / {stat.total}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
