'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { calculateLevel, getLevelTitle } from '@/lib/achievements'
import { Trophy, Star, TrendingUp } from 'lucide-react'

interface LevelProgressProps {
  totalPoints: number
}

export function LevelProgress({ totalPoints }: LevelProgressProps) {
  const levelData = calculateLevel(totalPoints)
  const levelTitle = getLevelTitle(levelData.level)

  return (
    <Card className="bg-gradient-to-br from-primary-500 to-purple-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Trophy className="h-10 w-10" />
            </div>
            <div>
              <div className="text-sm opacity-90">Nivel</div>
              <div className="text-4xl font-bold">{levelData.level}</div>
              <div className="text-sm opacity-90">{levelTitle}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5" />
              <span className="text-2xl font-bold">{totalPoints}</span>
            </div>
            <div className="text-sm opacity-90">Puntos totales</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2 opacity-90">
            <span>Progreso al Nivel {levelData.level + 1}</span>
            <span>
              {Math.round(levelData.currentLevelPoints)} / {levelData.nextLevelPoints}
            </span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${levelData.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(levelData.progress)}%
            </div>
            <div className="text-xs opacity-90">Progreso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {levelData.nextLevelPoints - levelData.currentLevelPoints}
            </div>
            <div className="text-xs opacity-90">Pts faltantes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="text-xs opacity-90">En ascenso</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
