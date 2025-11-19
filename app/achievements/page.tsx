'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { LevelProgress } from '@/components/gamification/LevelProgress'
import { AchievementCard } from '@/components/gamification/AchievementCard'
import { achievements, Achievement } from '@/lib/achievements'
import { Trophy, Filter } from 'lucide-react'

export default function AchievementsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [filterCategory, setFilterCategory] = useState<string>('all')

  if (status === 'loading') {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  // Mock data - en producción, esto vendría de la API
  const totalPoints = 245
  const unlockedAchievements = new Set([
    'first_habit',
    'first_goal',
    'first_checkin',
    'streak_week',
  ])

  const filteredAchievements = filterCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === filterCategory)

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'habits', label: 'Hábitos' },
    { id: 'goals', label: 'Metas' },
    { id: 'streak', label: 'Rachas' },
    { id: 'check-in', label: 'Check-ins' },
    { id: 'progress', label: 'Progreso' },
    { id: 'special', label: 'Especiales' },
  ]

  const unlockedCount = filteredAchievements.filter(a =>
    unlockedAchievements.has(a.id)
  ).length

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Trophy className="h-8 w-8 mr-3 text-primary-600" />
              Logros y Progreso
            </h1>
            <p className="text-gray-600 mt-1">
              Desbloquea logros y sube de nivel mientras progresas en tu viaje
            </p>
          </div>
        </div>

        {/* Level Progress */}
        <LevelProgress totalPoints={totalPoints} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-3xl font-bold text-primary-600">
              {unlockedCount}
            </div>
            <div className="text-sm text-gray-600">Logros Desbloqueados</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-3xl font-bold text-gray-400">
              {filteredAchievements.length - unlockedCount}
            </div>
            <div className="text-sm text-gray-600">Logros Bloqueados</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-3xl font-bold text-green-600">
              {totalPoints}
            </div>
            <div className="text-sm text-gray-600">Puntos Totales</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Completado</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${filterCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {filterCategory === 'all' ? 'Todos los Logros' : categories.find(c => c.id === filterCategory)?.label}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({unlockedCount} de {filteredAchievements.length})
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={unlockedAchievements.has(achievement.id)}
                progress={Math.floor(Math.random() * achievement.requirement)} // Mock progress
              />
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">
            💡 Consejos para Ganar Puntos
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Mantén rachas largas para desbloquear logros de alto valor</li>
            <li>• Completa tus check-ins diarios para puntos constantes</li>
            <li>• Alcanza tus metas para obtener grandes bonificaciones</li>
            <li>• Busca logros "especiales" para puntos bonus</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
